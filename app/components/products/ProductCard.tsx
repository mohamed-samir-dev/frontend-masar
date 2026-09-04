"use client";

import { memo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingCart, CheckCircle2 } from "lucide-react";
import { Icon } from "@iconify/react";
import type { Product, ProductVariant } from "./types";
import { useCartStore } from "../../store/cartStore";

const fmt = (n: number) => n.toLocaleString("en-US");
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const resolveImg = (src: string) => {
  if (src.startsWith("http")) {
    const idx = src.indexOf("https://", 8);
    return idx > 0 ? src.substring(idx) : src;
  }
  return `${API}${src.startsWith("/") ? src : "/" + src}`;
};

function ProductCard({ product, priority = false, highlightColor }: { product: Product; priority?: boolean; highlightColor?: string }) {
  const hasVariants = product.variants && product.variants.length > 0;
  const initialVariantIdx = (() => {
    if (!highlightColor || !product.variants) return 0;
    const idx = product.variants.findIndex((v) => v.color === highlightColor);
    return idx >= 0 ? idx : 0;
  })();
  const [activeVariantIdx, setActiveVariantIdx] = useState(initialVariantIdx);

  useEffect(() => {
    if (!highlightColor || !product.variants) return;
    const idx = product.variants.findIndex((v) => v.color === highlightColor);
    if (idx >= 0) setActiveVariantIdx(idx);
  }, [highlightColor, product.variants]);
  const initialStorageIdx = (() => {
    const storageOpts = product.variants?.[0]?.storageOptions;
    if (!storageOpts) return 0;
    const match = product.name.match(/(\d+(?:GB|TB))/i);
    if (!match) return 0;
    const idx = storageOpts.findIndex(o => o.storage.toLowerCase() === match[1].toLowerCase());
    return idx >= 0 ? idx : 0;
  })();
  const [activeStorageIdx, setActiveStorageIdx] = useState(initialStorageIdx);
  const [added, setAdded] = useState(false);

  const activeVariant: ProductVariant | undefined = hasVariants ? product.variants![activeVariantIdx] : undefined;
  const activeStorageOpt = activeVariant?.storageOptions?.[activeStorageIdx];

  const baseName = product.name.replace(/\d+GB|\d+TB/gi, "").replace(/\s{2,}/g, " ").trim();
  const selectedColorName = activeVariant?.color ?? product.color ?? "";
  const selectedStorageName = activeStorageOpt?.storage ?? product.storage ?? "";
  const displayName = `${baseName}${selectedStorageName ? " – " + selectedStorageName : ""}${selectedColorName ? " | " + selectedColorName : ""}`;

  const originalPrice = activeStorageOpt?.originalPrice ?? product.originalPrice ?? product.price ?? 0;
  const salePrice = activeStorageOpt?.salePrice ?? product.salePrice;
  const hasDiscount = salePrice != null && salePrice !== originalPrice;
  const displayPrice = hasDiscount ? salePrice! : originalPrice;
  const discountPct = hasDiscount ? Math.round(((originalPrice - salePrice!) / originalPrice) * 100) : (product.discountPercent ?? 0);

  const variantImages = activeVariant?.images ?? product.images;
  const allImages = variantImages?.length ? variantImages : product.image ? [product.image] : [];
  const mainImage = allImages[0] ? resolveImg(allImages[0]) : "";

  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ ...product, name: displayName, color: activeVariant?.color ?? product.color, storage: activeStorageOpt?.storage ?? product.storage, originalPrice, salePrice, image: allImages[0], images: [allImages[0]] });
    setAdded(true);
    setTimeout(() => { setAdded(false); window.scrollTo(0, 0); window.location.href = "/cart"; }, 800);
  }, [addItem, product, activeVariant, activeStorageOpt, originalPrice, salePrice, allImages, displayName]);

  const router = useRouter();

  const goToProduct = () => {
    let url = `/product/${product._id}`;
    const params = new URLSearchParams();
    
    if (activeVariant?.color) {
      params.append('color', activeVariant.color);
    }
    if (activeStorageOpt?.storage) {
      params.append('storage', activeStorageOpt.storage);
    }
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
    
    router.push(url);
  };

  return (
    <div dir="rtl"
      className="flex flex-col rounded-2xl overflow-hidden bg-white border border-[#e8edf5] hover:border-[#0B43FD]/30 hover:shadow-[0_8px_28px_rgba(11,67,253,0.10)] transition-all duration-200"
    >
      {/* ── Image ── */}
      <div onClick={goToProduct} className="relative w-full aspect-square bg-[#f4f7ff] overflow-hidden cursor-pointer">
        {discountPct > 0 && (
          <span className="absolute top-2 right-2 z-10 bg-[#0B43FD] text-white text-[10px] font-black px-2 py-0.5 rounded-full">
            -{discountPct}%
          </span>
        )}
        {(product.warrantyYears > 0 || product.installment?.available) && (
          <span className="absolute top-2 left-2 z-10 flex items-center gap-1 bg-white/90 border border-gray-200 px-1.5 py-0.5 rounded-full text-[9px] font-bold text-[#155E6F]">
            {product.warrantyYears > 0
              ? <><Icon icon="solar:shield-check-bold" width={11} />ضمان {product.warrantyYears}س</>
              : <><Icon icon="solar:card-bold" width={11} className="text-[#0B43FD]" /><span className="text-[#0B43FD]">تقسيط</span></>}
          </span>
        )}
        {mainImage && (
          <Image src={mainImage} alt={product.name} fill priority={priority}
            className="object-contain p-3 drop-shadow-md"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        )}
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col gap-1 sm:gap-1 p-2 sm:p-4 flex-1">

        {/* Name */}
        <p onClick={goToProduct} className="text-[11px] sm:text-[13px] font-bold text-gray-900 leading-snug line-clamp-2 min-h-[28px] sm:min-h-[34px] cursor-pointer">
          {displayName}
        </p>

        {/* Colors */}
        {hasVariants && product.variants!.length > 1 && (
          <div className="flex gap-1.5 items-center">
            {product.variants!.map((v, i) => (
              <button key={v.color} title={v.color}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveVariantIdx(i); const currentStorage = activeVariant?.storageOptions?.[activeStorageIdx]?.storage; const newIdx = product.variants![i].storageOptions?.findIndex(o => o.storage === currentStorage) ?? 0; setActiveStorageIdx(newIdx >= 0 ? newIdx : 0); }}
                className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 transition-transform duration-150 cursor-pointer ${activeVariantIdx === i ? "border-[#0B43FD] scale-110 shadow-[0_0_0_2px_rgba(11,67,253,0.25)]" : "border-gray-300"}`}
                style={{ backgroundColor: v.colorCode }}
              />
            ))}
          </div>
        )}

        {/* Storage */}
        {activeVariant?.storageOptions && activeVariant.storageOptions.length > 1 && (
          <div className="flex flex-wrap gap-1">
            {activeVariant.storageOptions.map((opt, i) => (
              <button key={opt.storage}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveStorageIdx(i); }}
                className={`px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[9px] sm:text-[11px] font-bold border cursor-pointer transition-colors duration-150 ${activeStorageIdx === i ? "bg-[#0B43FD] text-white border-[#0B43FD]" : "bg-white text-[#0B43FD] border-[#0B43FD]/30"}`}
              >
                {opt.storage}
              </button>
            ))}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-1 pt-1 border-t border-gray-100">
          <span className="text-[14px] sm:text-[20px] font-black text-[#0B43FD] leading-none">{fmt(displayPrice)}</span>
          <span className="text-[9px] sm:text-[10px] font-bold text-[#0B43FD]/60">ر.س</span>
          {hasDiscount && <span className="text-[9px] sm:text-[10px] text-gray-400 line-through">{fmt(originalPrice)}</span>}
        </div>

        {/* CTA */}
        <button onClick={handleAddToCart} disabled={!product.inStock}
          className={`mt-2 w-full flex items-center justify-center gap-1 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-[12px] font-black text-white border-none cursor-pointer transition-opacity duration-150 ${added ? "bg-emerald-500" : "bg-[#0B43FD]"} disabled:bg-gray-300 disabled:cursor-not-allowed hover:opacity-90`}
        >
          {added ? <><CheckCircle2 size={13} /><span>تمت الإضافة</span></> : !product.inStock ? <span>غير متوفر</span> : <><ShoppingCart size={13} /><span>أضف للسلة</span></>}
        </button>

      </div>
    </div>
  );
}

export default memo(ProductCard);
