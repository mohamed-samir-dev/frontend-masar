"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../../components/products/ProductCard";
import type { Product } from "../../components/products/types";

const ITEMS_PER_PAGE = 12;

interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
  highlight?: string;
}

interface Props {
  products: Product[];
  modelName: string;
  hero?: HeroSlide[];
}

export default function ShopModelClient({ products, modelName, hero = [] }: Props) {
  // ── Hero slider state ─────────────────────────────────────────
  const [slideIdx, setSlideIdx] = useState(0);
  const slides = hero.length > 0 ? hero : null;

  const nextSlide = useCallback(() => {
    if (!slides) return;
    setSlideIdx((i) => (i + 1) % slides.length);
  }, [slides]);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const t = setInterval(nextSlide, 4000);
    return () => clearInterval(t);
  }, [slides, nextSlide]);
  // ── Filter state ──────────────────────────────────────────────
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedStorages, setSelectedStorages] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number] | null>(null);
  const [onlyInstallment, setOnlyInstallment] = useState(false);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "discount">("default");
  const [page, setPage] = useState(1);

  // ── Derive filter options from products ───────────────────────
  const allColors = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      p.variants?.forEach((v) => v.color && set.add(v.color));
      if (p.color) set.add(p.color);
    });
    return [...set];
  }, [products]);

  const allStorages = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      p.variants?.forEach((v) =>
        v.storageOptions?.forEach((s) => s.storage && set.add(s.storage))
      );
      if (p.storage) set.add(p.storage);
    });
    return [...set].sort((a, b) => parseInt(a) - parseInt(b));
  }, [products]);

  const maxPrice = useMemo(
    () => Math.max(...products.map((p) => p.originalPrice ?? p.price ?? 0), 0),
    [products]
  );

  // ── Apply filters ─────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...products];

    if (selectedColors.length) {
      list = list.filter((p) => {
        const colors = p.variants?.map((v) => v.color) ?? (p.color ? [p.color] : []);
        return colors.some((c) => selectedColors.includes(c));
      });
    }

    if (selectedStorages.length) {
      list = list.filter((p) => {
        const storages =
          p.variants?.flatMap((v) => v.storageOptions?.map((s) => s.storage) ?? []) ??
          (p.storage ? [p.storage] : []);
        return storages.some((s) => selectedStorages.includes(s));
      });
    }

    if (priceRange) {
      list = list.filter((p) => {
        const price = p.salePrice ?? p.originalPrice ?? p.price ?? 0;
        return price >= priceRange[0] && price <= priceRange[1];
      });
    }

    if (onlyInstallment) {
      list = list.filter((p) => p.installment?.available);
    }

    if (onlyInStock) {
      list = list.filter((p) => p.inStock);
    }

    if (sortBy === "price-asc") {
      list.sort((a, b) => (a.salePrice ?? a.originalPrice ?? 0) - (b.salePrice ?? b.originalPrice ?? 0));
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => (b.salePrice ?? b.originalPrice ?? 0) - (a.salePrice ?? a.originalPrice ?? 0));
    } else if (sortBy === "discount") {
      list.sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0));
    }

    return list;
  }, [products, selectedColors, selectedStorages, priceRange, onlyInstallment, onlyInStock, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const activeFiltersCount =
    selectedColors.length +
    selectedStorages.length +
    (priceRange ? 1 : 0) +
    (onlyInstallment ? 1 : 0) +
    (onlyInStock ? 1 : 0);

  const resetFilters = () => {
    setSelectedColors([]);
    setSelectedStorages([]);
    setPriceRange(null);
    setOnlyInstallment(false);
    setOnlyInStock(false);
    setSortBy("default");
    setPage(1);
  };

  const toggle = <T,>(arr: T[], val: T) =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

  return (
    <main dir="rtl" className="min-h-screen bg-[#f5f7ff]">

      {/* ── Hero Slider ──────────────────────────────────────── */}
      <div className="relative w-full h-[300px] sm:h-[420px] lg:h-[500px] overflow-hidden">

        {/* Slides */}
        {slides ? (
          slides.map((slide, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                i === slideIdx ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.subtitle}
                fill
                priority={i === 0}
                className="object-cover object-center scale-105"
                sizes="100vw"
              />
            </div>
          ))
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0B43FD] via-[#0a35cc] to-[#061a6e]" />
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(4,14,60,0.82) 0%, rgba(4,14,60,0.35) 50%, rgba(4,14,60,0.15) 100%)" }} />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 sm:pb-14 lg:pb-16 px-4 sm:px-10 text-center gap-2 sm:gap-3">

          {/* Badge */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/20 backdrop-blur-md mb-1"
            style={{ background: "rgba(11,67,253,0.25)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#7eb3ff] animate-pulse" />
            <span className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-white/70">
              {modelName}
            </span>
          </div>

          {/* Title */}
          {slides?.[slideIdx]?.title && (
            <h1
              key={`title-${slideIdx}`}
              className="font-black text-center max-w-xs sm:max-w-xl lg:max-w-3xl leading-tight"
              style={{
                fontSize: "clamp(1.5rem, 5vw, 3.2rem)",
                background: "linear-gradient(90deg, #ffffff 0%, #a8c8ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "none",
              }}
            >
              {slides[slideIdx].title}
            </h1>
          )}

          {/* Subtitle */}
          {slides?.[slideIdx]?.subtitle && (
            <p
              key={`sub-${slideIdx}`}
              className="text-center max-w-xs sm:max-w-lg lg:max-w-2xl leading-relaxed font-medium"
              style={{ fontSize: "clamp(0.8rem, 2.2vw, 1.15rem)", color: "rgba(255,255,255,0.75)", textShadow: "0 1px 8px rgba(4,14,60,0.5)" }}
            >
              {(() => {
                const text = slides[slideIdx].subtitle;
                const hl = slides[slideIdx].highlight;
                if (!hl || !text.includes(hl)) return text;
                const [before, after] = text.split(hl);
                return (
                  <>
                    {before}
                    <span className="font-black" style={{
                      background: "linear-gradient(90deg, #60a5fa, #0B43FD)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}>{hl}</span>
                    {after}
                  </>
                );
              })()}
            </p>
          )}

          {/* Dots */}
          {slides && slides.length > 1 && (
            <div className="flex gap-1.5 mt-1 sm:mt-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setSlideIdx(i)}
                  className={`rounded-full transition-all duration-300 cursor-pointer ${
                    i === slideIdx ? "w-6 h-1.5 bg-white" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="max-w-[1380px] mx-auto px-4 sm:px-8 py-8">

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center gap-2 bg-white border border-[#e0e7ff] text-[#0B43FD] font-bold text-sm px-4 py-2 rounded-xl shadow-sm hover:bg-[#0B43FD] hover:text-white transition-colors cursor-pointer"
            >
              <SlidersHorizontal size={16} />
              فلتر
              {activeFiltersCount > 0 && (
                <span className="bg-[#0B43FD] text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-[#0B43FD]">
                  {activeFiltersCount}
                </span>
              )}
            </button>
            {activeFiltersCount > 0 && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
              >
                <X size={13} /> مسح الكل
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => { setSortBy(e.target.value as typeof sortBy); setPage(1); }}
            className="bg-white border border-[#e0e7ff] text-sm text-gray-700 font-medium px-3 py-2 rounded-xl shadow-sm outline-none cursor-pointer"
          >
            <option value="default">الترتيب الافتراضي</option>
            <option value="price-asc">السعر: الأقل أولاً</option>
            <option value="price-desc">السعر: الأعلى أولاً</option>
            <option value="discount">أعلى خصم</option>
          </select>
        </div>

        {/* Filter Panel */}
        {filterOpen && (
          <div className="bg-white border border-[#e0e7ff] rounded-2xl p-5 mb-6 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Colors */}
            {allColors.length > 0 && (
              <div>
                <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">اللون</p>
                <div className="flex flex-wrap gap-2">
                  {allColors.map((c) => (
                    <button
                      key={c}
                      onClick={() => { setSelectedColors(toggle(selectedColors, c)); setPage(1); }}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-semibold cursor-pointer transition-colors ${
                        selectedColors.includes(c)
                          ? "bg-[#0B43FD] text-white border-[#0B43FD]"
                          : "bg-white text-gray-700 border-gray-200 hover:border-[#0B43FD]"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Storage */}
            {allStorages.length > 0 && (
              <div>
                <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">السعة</p>
                <div className="flex flex-wrap gap-2">
                  {allStorages.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setSelectedStorages(toggle(selectedStorages, s)); setPage(1); }}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-semibold cursor-pointer transition-colors ${
                        selectedStorages.includes(s)
                          ? "bg-[#0B43FD] text-white border-[#0B43FD]"
                          : "bg-white text-gray-700 border-gray-200 hover:border-[#0B43FD]"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range */}
            <div>
              <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">
                السعر {priceRange ? `(${priceRange[0].toLocaleString()} – ${priceRange[1].toLocaleString()} ر.س)` : ""}
              </p>
              <div className="flex flex-col gap-2">
                {[
                  [0, 1000],
                  [1000, 3000],
                  [3000, 6000],
                  [6000, maxPrice],
                ].map(([min, max]) => (
                  <button
                    key={`${min}-${max}`}
                    onClick={() => {
                      setPriceRange(priceRange?.[0] === min && priceRange?.[1] === max ? null : [min, max]);
                      setPage(1);
                    }}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-semibold cursor-pointer transition-colors text-right ${
                      priceRange?.[0] === min && priceRange?.[1] === max
                        ? "bg-[#0B43FD] text-white border-[#0B43FD]"
                        : "bg-white text-gray-700 border-gray-200 hover:border-[#0B43FD]"
                    }`}
                  >
                    {min.toLocaleString()} – {max === maxPrice ? `${max.toLocaleString()}+` : max.toLocaleString()} ر.س
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div>
              <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">خيارات</p>
              <div className="flex flex-col gap-3">
                {[
                  { label: "تقسيط متاح", val: onlyInstallment, set: setOnlyInstallment },
                  { label: "متوفر فقط", val: onlyInStock, set: setOnlyInStock },
                ].map(({ label, val, set }) => (
                  <button
                    key={label}
                    onClick={() => { set(!val); setPage(1); }}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <span className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${val ? "bg-[#0B43FD] border-[#0B43FD]" : "border-gray-300 group-hover:border-[#0B43FD]"}`}>
                      {val && <span className="text-white text-[10px] font-black">✓</span>}
                    </span>
                    <span className="text-sm text-gray-700 font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-4">
          عرض <span className="font-bold text-gray-800">{filtered.length}</span> منتج
          {activeFiltersCount > 0 && " (بعد الفلتر)"}
        </p>

        {/* Grid */}
        {paginated.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-gray-400 text-lg mb-3">لا توجد منتجات تطابق الفلتر</p>
            <button onClick={resetFilters} className="text-[#0B43FD] font-bold text-sm underline cursor-pointer">
              مسح الفلاتر
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {paginated.map((p, i) => (
              <ProductCard key={p._id} product={p} priority={i < 4} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 rounded-xl border border-[#e0e7ff] bg-white flex items-center justify-center text-[#0B43FD] disabled:opacity-30 hover:bg-[#0B43FD] hover:text-white transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((n) => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
              .reduce<(number | "...")[]>((acc, n, idx, arr) => {
                if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push("...");
                acc.push(n);
                return acc;
              }, [])
              .map((n, i) =>
                n === "..." ? (
                  <span key={`dots-${i}`} className="text-gray-400 px-1">…</span>
                ) : (
                  <button
                    key={n}
                    onClick={() => setPage(n as number)}
                    className={`w-9 h-9 rounded-xl border font-bold text-sm transition-colors cursor-pointer ${
                      page === n
                        ? "bg-[#0B43FD] text-white border-[#0B43FD]"
                        : "bg-white text-gray-700 border-[#e0e7ff] hover:border-[#0B43FD] hover:text-[#0B43FD]"
                    }`}
                  >
                    {n}
                  </button>
                )
              )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 rounded-xl border border-[#e0e7ff] bg-white flex items-center justify-center text-[#0B43FD] disabled:opacity-30 hover:bg-[#0B43FD] hover:text-white transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        )}

      </div>
    </main>
  );
}
