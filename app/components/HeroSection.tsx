"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Banner {
  url: string;
  active: boolean;
}

export default function HeroSection({ banners }: { banners: Banner[] }) {
  const active = banners.filter((b) => b.url && b.active);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (active.length <= 1) return;
    const t = setInterval(() => setCurrent((p) => (p + 1) % active.length), 4000);
    return () => clearInterval(t);
  }, [active.length]);

  if (!active.length) return null;

  return (
    <div className="px-1 sm:px-5 lg:px-8 pt-4 pb-2">
      <section
        className="relative w-full overflow-hidden"
        style={{
          borderRadius: "20px",
          boxShadow: "0 8px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.10)",
        }}
      >
        {/* الصورة الأولى تحدد ارتفاع الـ section */}
        <Image
          src={active[0].url}
          alt="banner-size"
          width={1600}
          height={900}
          className="w-full h-auto block invisible"
          priority
          aria-hidden
        />

        {/* كل الصور فوق بعض */}
        {active.map((b, i) => (
          <div
            key={b.url}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            <Image
              src={b.url}
              alt={`banner-${i + 1}`}
              fill
              priority={i === 0}
              className="object-contain"
              quality={90}
            />
          </div>
        ))}

        {active.length > 1 && (
          <>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {active.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="transition-all duration-300"
                  style={{
                    width: i === current ? "24px" : "8px",
                    height: "8px",
                    borderRadius: "4px",
                    background: i === current ? "#fff" : "rgba(255,255,255,0.45)",
                  }}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
