"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { FiShoppingBag } from "react-icons/fi";
import Link from "next/link";
import { HiArrowRight, HiArrowLeft } from "react-icons/hi2";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

/* ─── Types & Data ──────────────────────────────────────────────────────── */

interface ColorVariant {
  name: string;
  value: string;
  image: string;
}

interface Product {
  id: string;
  name: string;
  subtitle: string;
  colors: ColorVariant[];
  storage: string[];
}

const PRODUCTS: Product[] = [
  {
    id: "17-pro-max",
    name: "آيفون 17 برو ماكس",
    subtitle: "iPhone 17 Pro Max",
    colors: [
      { name: "برتقالي", value: "#F07B2C", image: "/iphone-17-promax/iphone17promax-org.webp" },
      { name: "سيلفر",   value: "#F5F5F5", image: "/iphone-17-promax/iphone-17promax-silver.webp" },
      { name: "أزرق",    value: "#32374A", image: "/iphone-17-promax/iphone1-promax-blu.webp" },
    ],
    storage: ["256GB", "512GB", "1TB"],
  },
  {
    id: "17-pro",
    name: "آيفون 17 برو",
    subtitle: "iPhone 17 Pro",
    colors: [
      { name: "سيلفر",   value: "#F5F5F5", image: "/iphone-17-promax/iphone-17promax-silver.webp" },
      { name: "برتقالي", value: "#F07B2C", image: "/iphone-17-promax/iphone17promax-org.webp" },
      { name: "أزرق",    value: "#32374A", image: "/iphone-17-promax/iphone1-promax-blu.webp" },
    ],
    storage: ["256GB", "512GB", "1TB"],
  },
  {
    id: "17-air",
    name: "آيفون 17 إير",
    subtitle: "iPhone 17 Air",
    colors: [
      { name: "أبيض",   value: "#FFFFFF", image: "/iphone-17-air/i-white.webp" },
      { name: "أسود",   value: "#000000", image: "/iphone-17-air/i-black.webp" },
      { name: "ذهبي",   value: "#e4a017", image: "/iphone-17-air/i-gold.webp" },
      { name: "سماوي",  value: "#96AED1F", image: "/iphone-17-air/i-blue.webp" },
    ],
    storage: ["256GB", "512GB", "1TB"],
  },
  {
    id: "17",
    name: "آيفون 17",
    subtitle: "iPhone 17",
    colors: [
      { name: "وردي",  value: "#C9ADDC", image: "/iphone-17/i-pink.webp" },
      { name: "أخضر",  value: "#A6B286", image: "/iphone-17/i-green.webp" },
      { name: "أبيض",  value: "#FFFFFF", image: "/iphone-17/i-white.webp" },
      { name: "أسود",  value: "#000000", image: "/iphone-17/i-black.webp" },
    ],
    storage: ["256GB", "512GB", "1TB"],
  },
  {
    id: "16-pro-max",
    name: "آيفون 16 برو ماكس",
    subtitle: "iPhone 16 Pro Max",
    colors: [
      { name: "تيتانيوم صحراوي", value: "#C8A77A", image: "/iphone-16-pro-max/i-1.webp" },
      { name: "تيتانيوم طبيعي ", value: "#9A9A9A", image: "/iphone-16-pro-max/i-2.webp" },
      {  name: "تيتانيوم ابيض ",value: "#E5E5E0", image: "/iphone-16-pro-max/i-3.webp" },
    ],
    storage: ["256GB", "512GB", "1TB"],
  },
  {
    id: "16-pro",
    name: "آيفون 16 برو",
    subtitle: "iPhone 16 Pro",
    colors: [
     { name: "تيتانيوم صحراوي", value: "#C8A77A", image: "/iphone-16-pro-max/i-1.webp" },
      { name: "تيتانيوم طبيعي ", value: "#9A9A9A", image: "/iphone-16-pro-max/i-2.webp" },
      {  name: "تيتانيوم ابيض ",value: "#E5E5E0", image: "/iphone-16-pro-max/i-3.webp" },
    ],
    storage: ["128GB", "256GB", "512GB"],
  },
  {
    id: "16-plus",
    name: "آيفون 16 بلس",
    subtitle: "iPhone 16 Plus",
    colors: [
      { name: "أسود", value: "#1C1C1E", image: "/iphone-17-promax/iphone17promax-org.webp" },
    ],
    storage: ["128GB", "256GB", "512GB"],
  },
  {
    id: "16",
    name: "آيفون 16",
    subtitle: "iPhone 16",
    colors: [
      { name: "أسود", value: "#1C1C1E", image: "/iphone-17-promax/iphone17promax-org.webp" },
    ],
    storage: ["128GB", "256GB", "512GB"],
  },
  {
    id: "15-pro-max",
    name: "آيفون 15 برو ماكس",
    subtitle: "iPhone 15 Pro Max",
    colors: [
      { name: "تيتانيوم أسود", value: "#4A4A4A", image: "/iphone-17-promax/iphone17promax-org.webp" },
    ],
    storage: ["256GB", "512GB", "1TB"],
  },
  {
    id: "15-pro",
    name: "آيفون 15 برو",
    subtitle: "iPhone 15 Pro",
    colors: [
      { name: "تيتانيوم أسود", value: "#4A4A4A", image: "/iphone-17-promax/iphone17promax-org.webp" },
    ],
    storage: ["128GB", "256GB", "512GB"],
  },
  {
    id: "15-plus",
    name: "آيفون 15 بلس",
    subtitle: "iPhone 15 Plus",
    colors: [
      { name: "أسود", value: "#1C1C1E", image: "/iphone-17-promax/iphone17promax-org.webp" },
    ],
    storage: ["128GB", "256GB", "512GB"],
  },
  {
    id: "15",
    name: "آيفون 15",
    subtitle: "iPhone 15",
    colors: [
      { name: "أسود", value: "#1C1C1E", image: "/iphone-17-promax/iphone17promax-org.webp" },
    ],
    storage: ["128GB", "256GB", "512GB"],
  },
  {
    id: "14-pro-max",
    name: "آيفون 14 برو ماكس",
    subtitle: "iPhone 14 Pro Max",
    colors: [
      { name: "أسود", value: "#1C1C1E", image: "/iphone-17-promax/iphone17promax-org.webp" },
    ],
    storage: ["128GB", "256GB", "512GB"],
  },
  {
    id: "14-pro",
    name: "آيفون 14 برو",
    subtitle: "iPhone 14 Pro",
    colors: [
      { name: "أسود", value: "#1C1C1E", image: "/iphone-17-promax/iphone17promax-org.webp" },
    ],
    storage: ["128GB", "256GB", "512GB"],
  },
];

/* ─── ProductCard ───────────────────────────────────────────────────────── */

function ProductCard({ product }: { product: Product }) {
  const [activeColor, setActiveColor] = useState(0);
  const imgSwiperRef = useRef<SwiperType | null>(null);
  const color = product.colors[activeColor];

  function handleColorChange(i: number) {
    setActiveColor(i);
    imgSwiperRef.current?.slideTo(i);
  }

  return (
    <article className="group relative flex flex-col bg-white rounded-[28px] overflow-hidden border border-black/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.07)] transition-all duration-300 hover:shadow-[0_16px_48px_rgba(11,67,253,0.13),0_4px_16px_rgba(0,0,0,0.07)] hover:-translate-y-1 h-full">

      {/* ── Image area ── */}
      <div className="relative w-full overflow-hidden" style={{ aspectRatio: "3/2.8" }}>
        {/* Gradient bg */}
        <div
          className="absolute inset-0 transition-colors duration-500 z-0"
          style={{ background: `radial-gradient(ellipse at 50% 30%, ${color.value}22 0%, #f0f4ff 55%, #e8eeff 100%)` }}
        />

        {/* Image Swiper */}
        <Swiper
          modules={[EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          allowTouchMove={false}
          onSwiper={(s) => { imgSwiperRef.current = s; }}
          className="absolute inset-0 z-10 w-full h-full group-hover:[&_.swiper-slide-active_img]:scale-[1.04]"
        >
          {product.colors.map((c) => (
            <SwiperSlide key={c.image}>
              <div className="relative w-full h-full">
                <Image
                  src={c.image}
                  alt={`${product.name} - ${c.name}`}
                  fill
                  sizes="(max-width: 400px) 80vw, (max-width: 640px) 90vw, (max-width: 1100px) 45vw, 23vw"
                  className="object-contain p-3 xs:p-5 transition-transform duration-500"
                  priority={product.id === "17-pro-max"}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>


      </div>

      {/* ── Content ── */}
      <div className="flex flex-col p-3 xs:p-4 gap-2">

        {/* Name */}
        <h3 className="text-[0.82rem] xs:text-[1rem] font-black text-[#0a0a0a] leading-snug tracking-tight">
          {product.name}
        </h3>

        {/* Swatches */}
        <div className="flex items-center gap-2">
          {product.colors.map((c, i) => (
            <button
              key={c.name}
              onClick={() => handleColorChange(i)}
              aria-label={`اللون ${c.name}`}
              aria-pressed={activeColor === i}
              className={`rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B43FD] focus-visible:ring-offset-2 ${
                activeColor === i
                  ? "w-4 h-4 xs:w-5 xs:h-5 ring-2 ring-[#0B43FD] ring-offset-2 scale-110"
                  : "w-3.5 h-3.5 xs:w-4 xs:h-4 hover:scale-110 hover:ring-2 hover:ring-[#0B43FD]/30 hover:ring-offset-1"
              }`}
              style={{ backgroundColor: c.value, boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.1)" }}
            />
          ))}
        </div>

        {/* Storage */}
        <div className="flex gap-1.5">
          {product.storage.map((s) => (
            <span key={s} className="px-1.5 xs:px-2.5 py-0.5 xs:py-1 rounded-lg text-[0.6rem] xs:text-[0.68rem] font-semibold bg-[#f4f6ff] text-[#6b7280] border border-[#e8edf5] select-none">
              {s}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 w-full">
          <Link
            href={`/shop/${product.id}`}
            className="flex-1 flex items-center justify-center gap-1 py-2 xs:py-2.5 rounded-[10px] xs:rounded-[12px] bg-[#0B43FD] text-white text-[0.72rem] xs:text-[0.8rem] font-bold shadow-[0_4px_16px_rgba(11,67,253,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(11,67,253,0.5)] active:scale-[0.97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B43FD] focus-visible:ring-offset-2"
          >
            <FiShoppingBag size={11} />
            تسوق الآن
          </Link>
        </div>

      </div>
    </article>
  );
}

/* ─── ShopByModel ───────────────────────────────────────────────────────── */

export default function ShopByModel() {
  return (
    <section
      dir="rtl"
      className="w-full py-14 sm:py-20 overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 60% 0%, #dde6ff 0%, #eef1ff 30%, #f5f7ff 60%, #ffffff 100%)" }}
    >
      <div className="max-w-[1380px] mx-auto px-4 sm:px-8">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#0B43FD]/8 text-[#0B43FD] text-[0.72rem] font-bold px-3 py-1.5 rounded-full mb-3 border border-[#0B43FD]/12 tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0B43FD]" />
              أحدث الموديلات
            </div>
            <h2 className="text-[clamp(1.4rem,5vw,3rem)] font-black text-[#0a0a0a] leading-[1.1] tracking-tight">
              تسوّق حسب{" "}
              <span className="bg-gradient-to-l from-[#0B43FD] to-[#4f8bff] bg-clip-text text-transparent">
                الجهاز
              </span>
            </h2>
          </div>

          {/* Nav arrows — desktop only */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              className="swiper-models-prev w-10 h-10 rounded-full bg-white border border-[#e5e7eb] shadow-sm flex items-center justify-center text-[#374151] transition-all duration-200 hover:bg-[#0B43FD] hover:text-white hover:border-[#0B43FD] hover:shadow-[0_4px_14px_rgba(11,67,253,0.3)] disabled:opacity-30"
              aria-label="السابق"
            >
              <HiArrowRight size={16} />
            </button>
            <button
              className="swiper-models-next w-10 h-10 rounded-full bg-white border border-[#e5e7eb] shadow-sm flex items-center justify-center text-[#374151] transition-all duration-200 hover:bg-[#0B43FD] hover:text-white hover:border-[#0B43FD] hover:shadow-[0_4px_14px_rgba(11,67,253,0.3)] disabled:opacity-30"
              aria-label="التالي"
            >
              <HiArrowLeft size={16} />
            </button>
          </div>
        </div>

        {/* ── Swiper ── */}
        <Swiper
          modules={[Navigation, Pagination, A11y]}
          dir="rtl"
          navigation={{
            prevEl: ".swiper-models-prev",
            nextEl: ".swiper-models-next",
          }}
          pagination={{
            clickable: true,
            el: ".swiper-models-dots",
            bulletClass: "swiper-models-bullet",
            bulletActiveClass: "swiper-models-bullet-active",
          }}
          grabCursor
          slidesPerView={1.2}
          spaceBetween={12}
          breakpoints={{
            0:    { slidesPerView: 1.5,  spaceBetween: 10 },
            350:  { slidesPerView: 1.65, spaceBetween: 10 },
            400:  { slidesPerView: 1.85, spaceBetween: 12 },
            480:  { slidesPerView: 2.2,  spaceBetween: 14 },
            640:  { slidesPerView: 2.7,  spaceBetween: 18 },
            900:  { slidesPerView: 3.2,  spaceBetween: 20 },
            1200: { slidesPerView: 4,    spaceBetween: 22 },
          }}
          className="!overflow-visible"
        >
          {PRODUCTS.map((p) => (
            <SwiperSlide key={p.id} className="!h-auto">
              <ProductCard product={p} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Dots */}
        <div className="swiper-models-dots flex justify-center gap-2 mt-8" />

      </div>

      {/* Dot styles */}
      <style>{`
        .swiper-models-bullet {
          display: inline-block;
          width: 8px; height: 8px;
          border-radius: 9999px;
          background: #0B43FD;
          opacity: 0.2;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .swiper-models-bullet-active {
          opacity: 1;
          width: 22px;
          background: #0B43FD;
        }
      `}</style>
    </section>
  );
}
