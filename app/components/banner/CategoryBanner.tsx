"use client";
import Image from "next/image";

export default function CategoryBanner({ category, images }: { category: string; images?: string[] }) {
  if (!images?.length) return null;
  return (
    <div className="w-full overflow-x-auto flex gap-3 px-3 sm:px-4 py-2">
      {images.map((src, i) => (
        <div key={i} className="relative shrink-0 w-full max-w-2xl h-24 sm:h-32 rounded-xl overflow-hidden">
          <Image src={src} alt={`${category} بانر ${i + 1}`} fill className="object-cover" unoptimized />
        </div>
      ))}
    </div>
  );
}
