"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoCartOutline, IoCheckmarkDoneCircle, IoFlash,
  IoStarSharp, IoCheckmarkCircle, IoShieldCheckmarkOutline,
  IoCarOutline, IoLockClosedOutline,
} from "react-icons/io5";
import type { Product } from "../../../components/products/types";
import { useCartStore } from "../../../store/cartStore";

const fmt = (n: number) => n.toLocaleString("en-US");

interface Props {
  product: Product;
  selectedColor: string;
  selectedStorage: string;
  onColorChange: (c: string) => void;
  onStorageChange: (s: string) => void;
}

export default function ProductInfo({ product, selectedColor, selectedStorage, onColorChange, onStorageChange }: Props) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [popup, setPopup] = useState(false);

  const { name, brand, salePrice, originalPrice = 0, taxIncluded, installment, freeDelivery, inStock } = product;
  const hasDiscount = salePrice != null && salePrice !== originalPrice;
  const savings = hasDiscount ? originalPrice - (salePrice ?? 0) : 0;
  const discountPct = hasDiscount ? Math.round((savings / originalPrice) * 100) : 0;
  const activeVariant = product.variants?.find((v) => v.color === selectedColor);
  const storageOpts = activeVariant?.storageOptions ?? [];

  const handleAdd = () => {
    setLoading(true);
    setTimeout(() => {
      addItem(product);
      setLoading(false);
      setAdded(true);
      setPopup(true);
      setTimeout(() => setPopup(false), 3000);
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      dir="rtl"
    >
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/[.06] overflow-hidden">
        <div className="p-3.5 sm:p-4 flex flex-col gap-3">

          {/* Brand + Stock */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {brand && (
                brand.toLowerCase() === "apple" ? (
                  <div className="flex items-center gap-1 bg-gray-900 px-2.5 py-1 rounded-lg">
                    <img src="/ebe10e4a-ea76-4c7f-bff8-a89fde550082.svg" alt="Apple" className="w-2.5 h-3 brightness-0 invert" />
                    <span className="text-[11px] font-black text-white tracking-wide">Apple</span>
                  </div>
                ) : (
                  <span className="text-[11px] font-black text-[#0B43FD] bg-[#0B43FD]/8 px-2.5 py-1 rounded-lg tracking-wide">
                    {brand}
                  </span>
                )
              )}
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <IoStarSharp key={i} size={9} className={i < 4 ? "text-amber-400" : "text-gray-200"} />
                ))}
                <span className="text-[10px] text-gray-400 mr-1">4.8</span>
              </div>
            </div>
            <span className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg ${
              inStock ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${inStock ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
              {inStock ? "متوفر" : "غير متوفر"}
            </span>
          </div>

          {/* Name */}
          <h1 className="text-sm font-black text-gray-900 leading-snug">{name}</h1>

          <div className="h-px bg-gray-100" />

          {/* Colors */}
          {product.variants && product.variants.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-400 shrink-0">اللون</span>
              <div className="flex gap-2">
                {product.variants.map((v) => (
                  <motion.button
                    key={v.color}
                    title={v.color}
                    whileTap={{ scale: 0.88 }}
                    onClick={() => { onColorChange(v.color); onStorageChange(v.storageOptions?.[0]?.storage ?? ""); }}
                    className={`relative w-6 h-6 rounded-full border-2 cursor-pointer transition-all duration-200 ${
                      selectedColor === v.color
                        ? "border-[#0B43FD] shadow-[0_0_0_2px_rgba(11,67,253,0.15)]"
                        : "border-white shadow-md"
                    }`}
                    style={{ backgroundColor: v.colorCode }}
                  >
                    {selectedColor === v.color && (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <IoCheckmarkCircle size={12} className="text-white drop-shadow" />
                      </span>
                    )}
                  </motion.button>
                ))}
              </div>
              <span className="text-[11px] text-gray-600 font-semibold">{selectedColor}</span>
            </div>
          )}

          {/* Storage */}
          {storageOpts.length > 1 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-gray-400 shrink-0">السعة</span>
              <div className="flex gap-1.5 flex-wrap">
                {storageOpts.map((opt) => (
                  <motion.button
                    key={opt.storage}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => onStorageChange(opt.storage)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-black border cursor-pointer transition-all duration-150 ${
                      selectedStorage === opt.storage
                        ? "bg-[#0B43FD] text-white border-[#0B43FD] shadow-sm shadow-[#0B43FD]/20"
                        : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {opt.storage}
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          <div className="h-px bg-gray-100" />

          {/* Price */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedColor}-${selectedStorage}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 flex-wrap"
            >
              <span className="text-2xl font-black text-gray-900 leading-none">
                {fmt(salePrice ?? originalPrice)}
              </span>
              <span className="text-[11px] font-bold text-gray-400">ر.س</span>
              {hasDiscount && (
                <>
                  <span className="text-[11px] text-gray-400 line-through">{fmt(originalPrice)}</span>
                  <span className="text-[10px] font-black text-white bg-red-500 px-1.5 py-0.5 rounded-md">
                    -{discountPct}%
                  </span>
                </>
              )}
            </motion.div>
          </AnimatePresence>

          {taxIncluded && (
            <p className="text-[10px] text-gray-400 -mt-1">شامل ضريبة القيمة المضافة 15%</p>
          )}

          {/* Installment */}
          {installment?.available && (
            <div className="flex items-center gap-2 bg-[#f7fdf0] rounded-xl px-3 py-2 border border-[#7CC043]/20">
              <IoFlash size={12} className="text-[#5a9030] shrink-0" />
              <p className="text-[11px] font-black text-[#3d6b1a]">
                تقسيط متاح {installment.downPayment ? `• مقدم ${fmt(installment.downPayment)} ر.س` : ""}
              </p>
            </div>
          )}

          {/* Trust */}
          <div className="flex items-center justify-between gap-2">
            {[
              { icon: IoShieldCheckmarkOutline, label: "ضمان سنتين",  color: "#059669" },
              { icon: IoCarOutline,             label: freeDelivery ? "توصيل مجاني" : "توصيل سريع", color: "#0B43FD" },
              { icon: IoLockClosedOutline,       label: "دفع آمن",     color: "#7c3aed" },
            ].map((b, i) => (
              <div key={i} className="flex items-center gap-1">
                <b.icon size={12} style={{ color: b.color }} />
                <span className="text-[11px] font-bold text-gray-500">{b.label}</span>
              </div>
            ))}
          </div>

          {/* CTA — shown always */}
          <div className="relative">
            <AnimatePresence>
              {popup && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-11 inset-x-0 z-20"
                >
                  <div className="bg-[#0B43FD] rounded-xl px-3 py-2 shadow-lg flex items-center gap-2">
                    <IoCheckmarkDoneCircle size={14} className="text-white shrink-0" />
                    <span className="text-[11px] font-bold text-white">تمت الإضافة للسلة ✓</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.975 }}
              onClick={added ? () => router.push("/cart") : handleAdd}
              disabled={loading}
              className={`w-full font-black text-sm py-3 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-70 ${
                added
                  ? "bg-emerald-600 text-white shadow-emerald-500/20"
                  : "bg-[#0B43FD] text-white shadow-[#0B43FD]/20"
              }`}
            >
              {loading ? (
                <svg className="animate-spin" width={15} height={15} viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,.3)" strokeWidth="3" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                </svg>
              ) : added ? (
                <><IoCartOutline size={15} /> عرض السلة</>
              ) : (
                <><IoCartOutline size={15} /> أضف للسلة</>
              )}
            </motion.button>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
