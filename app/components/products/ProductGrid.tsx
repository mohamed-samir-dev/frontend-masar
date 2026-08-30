"use client";
import { useMemo, memo } from "react";
import Link from "next/link";
import ProductCard from "./ProductCard";
import type { Product } from "./types";
import CategoryBanner from "../banner/CategoryBanner";

const LIMIT = 4;

// map category value → page path for "عرض الكل" link
const categoryPageMap: Record<string, string> = {
  // English keys
  smartphone: "/smartphones/apple-only",
  smartphones: "/smartphones/apple-only",
  watch: "/apple-watches/se",
  audio: "/audio/airpods-pro",
  speaker: "/audio/airpods-max",
  earbuds: "/audio/samsung-buds",
  ps5: "/playstation/ps5",
  ps4: "/playstation/ps5-slim",
  xbox: "/playstation/xbox-one",
  controller: "/playstation/controllers",
  "gaming-accessories": "/playstation/ps-accessories",
  laptop: "/laptops/macbook-pro",
  monitor: "/laptops/samsung-monitors",
  tablet: "/tablets/ipad-pro",
  powerbank: "/accessories/anker-batteries",
  gaming: "/games/ps5-games",
  "mice-keyboards": "/games/mice-keyboards",
  microphone: "/games/microphones",
  figures: "/games/figures",
  rgb: "/games/rgb-lighting",
  // Arabic category names from products
  "ابل ايفون 17 برو": "/smartphones/iphone-17-pro",
  "ابل ايفون 17 برو ماكس": "/smartphones/iphone-17-pro-max",
  "ابل ايفون 17برو ماكس": "/smartphones/iphone-17-pro-max",
  "ابل ايفون 17": "/smartphones/iphone-17",
  "ابل ايفون 17 اير": "/smartphones/iphone-17-air",
  "ابل ايفون 16 برو": "/smartphones/iphone-16-pro",
  "ابل ايفون 16 برو ماكس": "/smartphones/iphone-16-pro-max",
  "ابل ايفون 16": "/smartphones/iphone-16",
  "ابل ايفون 16 بلس": "/smartphones/iphone-16-plus",
  "ابل ايفون 15 برو": "/smartphones/iphone-15-pro",
  "ابل ايفون 15 برو ماكس": "/smartphones/iphone-15-pro-max",
  "ابل ايفون 15": "/smartphones/iphone-15",
  "ابل ايفون 15 بلس": "/smartphones/iphone-15-plus",
  "ابل ايفون 14 برو": "/smartphones/iphone-14-pro",
  "ابل ايفون 14 برو ماكس": "/smartphones/iphone-14-pro-max",
  "ابل ايفون 14": "/smartphones/iphone-14",
  "ابل ايفون 14 بلس": "/smartphones/iphone-14-plus",
  "ابل ايفون 13 برو ماكس": "/smartphones/iphone-13-pro-max",
  "سامسونج جالكسي": "/smartphones/samsung-s25-ultra",
  "سامسونج جالاكسي": "/smartphones/samsung-s25-ultra",
  "سامسونج جالاكسي S26": "/smartphones/samsung-s26-ultra",
  "سامسونج جالاكسي S26 الترا": "/smartphones/samsung-s26-ultra",
  "سامسونج جالاكسي اس 26 الترا": "/smartphones/samsung-s26-ultra",
  "سامسونج جالاكسي S25": "/smartphones/samsung-s25-ultra",
  "سامسونج جالاكسي S25 الترا": "/smartphones/samsung-s25-ultra",
  "ساعات ابل": "/apple-watches/se",
  "سماعات ابل": "/audio/airpods-pro",
  "بلاي ستيشن": "/playstation/ps5",
  "بلاي ستيشن وملحقاته": "/playstation/ps5",
  "بلاستيشن وملحقاته": "/playstation",
  "بلاستيشن": "/playstation",
  "لابتوبات": "/laptops/macbook-pro",
  "ايبادات": "/tablets/ipad-pro",
  "ملحقات": "/accessories/anker-batteries",
  "العاب": "/games/ps5-games",
};

const CategoryRow = memo(function CategoryRow({ category, items, isFirst }: { category: string; items: Product[]; isFirst?: boolean }) {
  const visible = items.slice(0, LIMIT);
  const href = categoryPageMap[category] ?? categoryPageMap[category.toLowerCase()] ?? `/search?q=${encodeURIComponent(category)}`;

  return (
    <div className="mb-8 sm:mb-12">
      {/* Category Header */}
      <div className="flex items-end justify-between mb-3 sm:mb-4" dir="rtl">
        {/* Title + underline */}
        <div className="flex flex-col gap-1 sm:gap-1.5">
          <h2 className="text-[clamp(1rem,4vw,1.6rem)] font-black text-[#0a0a0a] leading-none tracking-tight">
            {category}
          </h2>
          <div className="h-[3px] w-8 sm:w-12 rounded-full bg-gradient-to-l from-[#0B43FD] to-[#4f8bff]" />
        </div>
        {/* View All */}
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 text-[clamp(0.65rem,2.5vw,0.78rem)] font-bold text-[#0B43FD] whitespace-nowrap px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border border-[#0B43FD]/30 hover:bg-[#0B43FD]/6 transition-all duration-200"
        >
          <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
          عرض الكل
        </Link>
      </div>
      {/* Dotted divider */}
      <div className="border-t-2 border-dashed border-[#0B43FD]/20 mb-4 sm:mb-6" />

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
        {visible.map((p, i) => (
          <ProductCard key={p._id} product={p} priority={isFirst && i === 0} />
        ))}
      </div>
    </div>
  );
});

type HomeSettings = { category: string; subCategory: string; showInHome: boolean; order: number };
type HomeConfig = { settings: HomeSettings[]; max: number };

export default function ProductGrid({
  products,
  homeConfig,
  bannerMap,
}: {
  products: Product[];
  homeConfig: HomeConfig | null;
  bannerMap: Record<string, string[]>;
}) {
  const grouped = useMemo(() => {
    const map: Record<string, Product[]> = {};
    products.forEach((p) => {
      const cat = p.category || "أخرى";
      (map[cat] ??= []).push(p);
    });
    // Sort each category the same way as the category page (storage → color)
    const parseStorage = (s?: string) => {
      if (!s) return 0;
      const n = parseFloat(s);
      if (s.includes("تيرا") || s.toLowerCase().includes("tb")) return n * 1024;
      return n || 0;
    };
    const colorOrder = (c?: string) => {
      if (!c) return 99;
      if (c.includes("برتقال") || c.toLowerCase().includes("orange")) return 0;
      if (c.includes("سيلفر") || c.toLowerCase().includes("silver")) return 1;
      if (c.includes("ازرق") || c.includes("أزرق") || c.toLowerCase().includes("blue")) return 2;
      return 3;
    };
    for (const cat of Object.keys(map)) {
      map[cat].sort((a, b) => {
        const storageDiff = parseStorage(a.storage) - parseStorage(b.storage);
        if (storageDiff !== 0) return storageDiff;
        return colorOrder(a.color) - colorOrder(b.color);
      });
    }
    return map;
  }, [products]);

  // If no settings configured yet, show all. Otherwise filter & sort by settings.
  const orderedCategories = useMemo(() => {
    const allCats = Object.keys(grouped).filter((c) => c !== "أخرى");
    if (!homeConfig) return allCats;
    const { settings, max } = homeConfig;
    const visibleSettings = settings.filter((s) => s.showInHome);
    if (visibleSettings.length === 0) return allCats;
    const orderedCats = visibleSettings
      .sort((a, b) => a.order - b.order)
      .slice(0, max)
      .map((s) => s.category)
      .filter((c, idx, arr) => arr.indexOf(c) === idx)
      .filter((c) => allCats.some((ac) => ac === c || ac.trim() === c.trim()));
    return orderedCats;
  }, [grouped, homeConfig]);

  if (!products.length) return <p className="text-center text-gray-400 py-10">لا توجد منتجات حالياً</p>;

  return (
    <section className="w-full py-6 sm:py-8 overflow-hidden">
    <div className="max-w-[1380px] mx-auto px-4 sm:px-8">
      {orderedCategories.map((category, catIdx) => (
        <div key={category}>
          <div className="-mx-3 sm:-mx-4 mb-4 sm:mb-6 border-t border-gray-100 pt-4 sm:pt-6">
            <CategoryBanner category={category} images={bannerMap[category]} />
          </div>
          <CategoryRow category={category} items={grouped[category]} isFirst={catIdx === 0} />
        </div>
      ))}
    </div>
    </section>
  );
}
