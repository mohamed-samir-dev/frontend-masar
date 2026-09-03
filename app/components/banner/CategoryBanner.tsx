"use client";
import Image from "next/image";

export default function CategoryBanner({ category, images }: { category: string; images?: string[] }) {
  if (!images?.length) return null;
  return (
    <div className="px-1 sm:px-5 lg:px-8 py-2">
      <section
        className="relative w-full overflow-hidden"
        style={{
          borderRadius: "20px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)",
        }}
      >
        <Image
          src={images[0]}
          alt="banner-size"
          width={1600}
          height={900}
          className="w-full h-auto block invisible"
          aria-hidden
          unoptimized
        />
        {images.map((src, i) => (
          <div key={i} className="absolute inset-0">
            <Image src={src} alt={`${category} بانر ${i + 1}`} fill className="object-contain" unoptimized />
          </div>
        ))}
      </section>
    </div>
  );
}
