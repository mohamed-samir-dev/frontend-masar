"use client";
import Image from "next/image";

export default function CategoryBanner({ category, images }: { category: string; images?: string[] }) {
  if (!images?.length) return null;
  return (
    <div className="w-full overflow-x-auto flex gap-3 px-3 sm:px-4 py-2 scrollbar-hide snap-x snap-mandatory">
      {images.map((src, i) => (
        <div key={i} className="relative shrink-0 w-full snap-start rounded-xl overflow-hidden bg-white">
          <Image src={src} alt={`${category} بانر ${i + 1}`} width={1400} height={500} className="w-full h-auto" unoptimized />
        </div>
      ))}
    </div>
  );
}
