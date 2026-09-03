"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useCartStore } from "../store/cartStore";
import type { CustomerInfo } from "../store/cartStore";
import CheckoutStepper from "../components/checkout/CheckoutStepper";
import CartItemCard from "../components/checkout/CartItemCard";
import CustomerInfoForm from "./components/CustomerInfoForm";
import PaymentForm from "./components/PaymentForm";
import DiscountBanner from "./components/DiscountPopup";
import OrderReviewPopup from "./components/OrderReviewPopup";
import {
  RiShoppingCart2Line, RiArrowRightLine, RiHome4Line,
  RiArrowLeftSLine, RiTruckLine, RiArrowLeftLine,
} from "react-icons/ri";

const fmt = (n: number) => n.toLocaleString("en-US");

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQty, totalPrice, totalItems, setCustomer, customer } = useCartStore();
  const [mounted, setMounted]           = useState(false);
  const [step, setStep]                 = useState<1 | 2>(1);
  const [customerDraft, setCustomerDraft] = useState<Partial<CustomerInfo>>(customer ?? {});
  const [reviewInfo, setReviewInfo]     = useState<CustomerInfo | null>(null);

  useEffect(() => { setMounted(true); }, []);

  const total   = mounted ? totalPrice() : 0;
  const count   = mounted ? totalItems() : 0;
  const installmentMonths = mounted
    ? Math.max(...items.map(i => i.product.installment?.months ?? 0)) || undefined
    : undefined;

  const originalTotal = mounted
    ? items.reduce((s, i) => s + ((i.product.originalPrice ?? i.product.salePrice ?? i.product.price) * i.qty), 0)
    : 0;
  const discountTotal = originalTotal - total;

  if (!mounted) return null;

  /* ── Empty state ── */
  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-[#F7F9FC]" dir="rtl">
        <CheckoutStepper currentStep={1} />
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 gap-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-20 h-20 bg-[#0874ED]/10 rounded-full flex items-center justify-center"
          >
            <RiShoppingCart2Line size={36} className="text-[#0874ED]" />
          </motion.div>
          <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }} className="text-center">
            <h2 className="text-lg font-bold text-[#040D2A]">سلتك فارغة</h2>
            <p className="text-sm text-[#8A96A8] mt-1">لم تضف أي منتجات بعد</p>
          </motion.div>
          <motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 }}>
            <Link href="/" className="inline-flex items-center gap-2 bg-[#0874ED] hover:bg-[#0665D0] text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors">
              <RiArrowRightLine size={15} />
              تصفح المنتجات
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  /* ── Main ── */
  return (
    <main className="min-h-screen bg-[#F7F9FC]" dir="rtl">
      <style>{`body { background-color: #F7F9FC; }`}</style>
      <CheckoutStepper currentStep={step === 1 ? 1 : 2} />

      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-32 lg:pb-10">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[11px] text-[#8A96A8] mb-4">
          <Link href="/" className="flex items-center gap-1 hover:text-[#0874ED] transition-colors text-[#0874ED]">
            <RiHome4Line size={12} />
            الرئيسية
          </Link>
          <RiArrowLeftSLine size={13} className="text-[#C8D0DC]" />
          <span className="text-[#040D2A] font-semibold">سلتي</span>
        </div>

        {/* Page title */}
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-base sm:text-lg font-bold text-[#040D2A]">سلتي</h1>
          <span className="bg-[#0874ED] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
            {count} منتج
          </span>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col lg:flex-row gap-4 items-start"
            >
              {/* ── Right col: products + form ── */}
              <div className="flex-1 space-y-3 w-full">

                {/* Products */}
                <div className="bg-[#FEFEFE] rounded-xl border border-[#E8EDF5] overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#E8EDF5]">
                    <h2 className="text-xs font-semibold text-[#040D2A]">المنتجات</h2>
                  </div>
                  <div className="p-3 space-y-2.5">
                    <AnimatePresence>
                      {items.map(({ product, qty, cartKey }) => (
                        <CartItemCard
                          key={cartKey}
                          product={product}
                          qty={qty}
                          onUpdateQty={updateQty}
                          onRemove={removeItem}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Discount coupon */}
                <DiscountBanner />

                {/* Customer form */}
                <CustomerInfoForm
                  initialData={customerDraft}
                  onNext={(info) => {
                    setCustomerDraft(info);
                    setStep(2);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </div>

              {/* ── Left col: Order Summary ── */}
              <div className="w-full lg:w-72 shrink-0 lg:sticky lg:top-4">
                <div className="bg-[#FEFEFE] rounded-xl border border-[#E8EDF5]">
                  <div className="px-4 py-3 border-b border-[#E8EDF5]">
                    <h2 className="text-xs font-semibold text-[#040D2A]">ملخص الطلب</h2>
                  </div>
                  <div className="px-4 py-3 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#6B7A8D]">المجموع الفرعي</span>
                      <span className="text-xs font-medium text-[#040D2A]">{fmt(originalTotal)} <span className="text-[10px] text-[#B0BCCE]">ريال</span></span>
                    </div>
                    {discountTotal > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#6B7A8D]">الخصم</span>
                        <span className="text-xs font-medium text-[#0874ED]">- {fmt(discountTotal)} <span className="text-[10px]">ريال</span></span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[#6B7A8D]">الشحن</span>
                      <span className="text-xs font-medium text-emerald-500">مجاني</span>
                    </div>
                    <div className="border-t border-[#E8EDF5] pt-2.5 flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#040D2A]">الإجمالي</span>
                      <div>
                        <span className="text-sm font-bold text-[#040D2A]">{fmt(total)}</span>
                        <span className="text-[10px] text-[#B0BCCE] mr-1">ريال</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2">
                      <RiTruckLine size={13} className="text-emerald-500 shrink-0" />
                      <span className="text-[11px] text-emerald-600">شحن مجاني لجميع الطلبات</span>
                    </div>
                  </div>
                  <div className="px-4 pb-4 hidden lg:block">
                    <div className="flex items-center gap-1.5 bg-[#0874ED]/5 border border-[#0874ED]/15 rounded-lg px-3 py-2.5">
                      <RiArrowLeftLine size={12} className="text-[#0874ED]" />
                      <span className="text-[11px] text-[#0874ED]">أكمل تعبئة البيانات أدناه للمتابعة</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.22 }}
            >
              <PaymentForm
                total={total}
                itemCount={count}
                initialData={customerDraft}
                installmentMonths={installmentMonths}
                onBack={() => { setStep(1); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                onSubmit={(info: CustomerInfo) => { setCustomer(info); setReviewInfo(info); }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sticky CTA mobile */}
      {step === 1 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#FEFEFE] border-t border-[#E8EDF5] px-4 py-3 z-40">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#8A96A8]">الإجمالي</span>
            <span className="text-sm font-bold text-[#040D2A]">{fmt(total)} <span className="text-[11px] font-normal text-[#B0BCCE]">ريال</span></span>
          </div>
        </div>
      )}

      {reviewInfo && (
        <OrderReviewPopup
          customer={reviewInfo}
          total={total}
          onDone={() => router.push("/checkout")}
        />
      )}
    </main>
  );
}
