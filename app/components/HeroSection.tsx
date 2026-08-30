"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FiShoppingBag, FiCreditCard, FiArrowLeft } from "react-icons/fi";
import { Icon } from "@iconify/react";

const slide3Features = [
  { icon: "solar:headphones-round-sound-bold", label: "دعم فني", sub: "24/7 على مدار الساعة" },
  { icon: "solar:delivery-bold", label: "شحن سريع", sub: "لجميع مناطق المملكة" },
  { icon: "solar:shield-check-bold", label: "ضمان معتمد", sub: "على كل المنتجات" },
];

export default function HeroSection() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      if (animating || index === current) return;
      setAnimating(true);
      setCurrent(index);
      setTimeout(() => setAnimating(false), 600);
    },
    [animating, current]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => {
        setAnimating(true);
        setTimeout(() => setAnimating(false), 600);
        return (prev + 1) % 3;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Slides wrapper */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(${current * 100}%)` }}
      >
        {/* Slide 1 */}
        <section
          dir="rtl"
          className="relative w-full shrink-0 flex items-center py-6 sm:py-8 min-h-[320px] sm:min-h-[520px]"
        >
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/hero1.webp)" }} />
          <div className="absolute inset-0 bg-gradient-to-l from-white/80 via-white/55 to-transparent" />
          <div className="relative z-10 max-w-[700px] pr-5 sm:pr-14 ml-auto mr-0 sm:mr-[5%]">
            <div className="font-black text-[#0a0a0a] tracking-tight mb-3 sm:mb-4">
              <div className="leading-[1.1] mb-2 text-[clamp(1.4rem,2.5vw,1.8rem)]">اكتشف عالم</div>
              <div className="leading-[1.1]">
                <span className="inline-block bg-gradient-to-br from-[#0B43FD] to-[#4f8bff] bg-clip-text text-transparent py-1 text-[clamp(2.8rem,5vw,4rem)] tracking-wide">
                  الابتكار
                </span>
              </div>
            </div>
            <p className="text-[clamp(0.85rem,2vw,1rem)] text-[#1a1a1a] leading-[1.7] font-medium mb-2 max-w-[500px]">
              نوفر لك أحدث أجهزة <span className="text-[#0B43FD] font-bold">iPhone</span> وإكسسوارات أصلية معتمدة،
            </p>
            <p className="text-[clamp(0.85rem,2vw,1rem)] text-[#1a1a1a] leading-[1.7] font-medium mb-3 sm:mb-4 max-w-[500px]">
              مع خدمة توصيل سريعة وضمان شامل على جميع المنتجات — لأن راحتك وثقتك هي أولويتنا.
            </p>
            <div className="h-px bg-gradient-to-l from-transparent via-[#0B43FD]/30 to-transparent mb-3 sm:mb-4 max-w-[500px]" />
            <div className="flex items-start gap-0 max-w-[500px] mb-4 sm:mb-5">
              {slide3Features.map((item, i) => (
                <div key={i} className="flex items-start flex-1">
                  <div className="flex flex-col items-center gap-2 flex-1">
                    <Icon icon={item.icon} className="text-[#0B43FD] drop-shadow-[0_0_6px_rgba(11,67,253,0.3)]" style={{ fontSize: "clamp(1rem,2.5vw,1.3rem)" }} />
                    <span className="text-[clamp(0.7rem,1.5vw,0.8rem)] font-semibold text-[#111] text-center leading-tight">{item.label}</span>
                    <span className="hidden sm:block text-[clamp(0.65rem,1.2vw,0.75rem)] font-normal text-[#444] text-center leading-tight">{item.sub}</span>
                  </div>
                  {i < slide3Features.length - 1 && (
                    <div className="w-px self-stretch bg-[#0B43FD]/20 mx-2 sm:mx-3" />
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-3 items-center">
              <button className="bg-[#0B43FD] text-white border-none rounded-[2rem] px-5 sm:px-8 py-2.5 sm:py-3 text-[clamp(0.72rem,1.6vw,0.88rem)] font-semibold inline-flex items-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(11,67,253,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_8px_30px_rgba(11,67,253,0.5)] shrink-0 whitespace-nowrap">
                <FiShoppingBag size={14} />
                تسوق الآن
              </button>
              <button className="bg-white/80 text-[#0B43FD] border-2 border-[#0B43FD] rounded-[2rem] px-5 sm:px-8 py-2.5 sm:py-3 text-[clamp(0.68rem,1.6vw,0.84rem)] font-semibold inline-flex items-center gap-2 cursor-pointer backdrop-blur-sm transition-all duration-200 hover:bg-[#0B43FD]/15 hover:-translate-y-0.5 shrink-0 whitespace-nowrap">
                <Icon icon="solar:widget-bold" width={13} />
                عرض المنتجات
              </button>
            </div>
          </div>
        </section>

        {/* Slide 2 */}
        <section
          dir="rtl"
          className="relative w-full shrink-0 overflow-hidden flex items-center py-10 min-h-[320px] sm:min-h-[520px]"
        >
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/hero2.webp)" }} />
          <div className="absolute inset-0 bg-gradient-to-l from-white/95 via-white/80 to-white/10" />
          <div className="relative z-10 max-w-[580px] pr-4 sm:pr-8 ml-auto mr-[2%] sm:mr-[4%] flex flex-col gap-0">
            <div className="font-black text-[#0a0a0a] tracking-tight mb-2 leading-[1.2]">
              <div className="mb-1.5 text-[clamp(1.1rem,2.5vw,1.8rem)]">خلي اللي</div>
              <div className="flex items-center gap-3 mb-1.5">
                <span className="bg-gradient-to-br from-[#0B43FD] to-[#4f8bff] bg-clip-text text-transparent text-[clamp(2rem,4vw,3.2rem)] tracking-wide">
                  نفسك فيه
                </span>
                <Icon icon="fluent:sparkle-28-filled" className="text-[#0B43FD] shrink-0 drop-shadow-[0_0_10px_rgba(11,67,253,0.6)]" style={{ fontSize: "clamp(1rem,2vw,1.4rem)" }} />
              </div>
              <div className="text-[clamp(1.1rem,2.5vw,1.8rem)]">يبقي ف إيدك</div>
            </div>
            <p className="text-[clamp(0.85rem,2vw,1rem)] text-[#333] leading-[1.5] font-normal mb-4 max-w-[420px]">
              أحدث أجهزة <span className="text-[#0B43FD]">Apple</span> بأسعار تنافسية مع تقسيط مرن — نضمن لك أفضل تجربة من الاختيار حتى التوصيل.
            </p>
            <div className="flex flex-col items-center mb-5 max-w-[420px] gap-2">
              <span className="text-[clamp(0.78rem,1.8vw,0.9rem)] text-[#555] font-medium">نقبل جميع طرق الدفع</span>
              <img src="/mada-visa-mas.webp" alt="طرق الدفع" className="h-20 sm:h-24 object-contain" />
            </div>

            <div className="flex gap-3 flex-wrap">
              <button className="bg-[#0B43FD] text-white border-none rounded-2xl px-5 sm:px-8 py-2.5 sm:py-3.5 text-[clamp(0.85rem,2.5vw,1rem)] font-bold inline-flex items-center gap-2 cursor-pointer shadow-[0_4px_24px_rgba(11,67,253,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_8px_32px_rgba(11,67,253,0.55)]">
                <FiShoppingBag size={16} />
                تسوق الآن
                <FiArrowLeft size={14} className="opacity-70" />
              </button>
              <button
                onClick={() => router.push("/taqseet")}
                className="bg-white/80 text-[#0B43FD] border-2 border-[#0B43FD] rounded-2xl px-4 sm:px-7 py-2.5 sm:py-3.5 text-[clamp(0.8rem,2.5vw,0.95rem)] font-bold inline-flex items-center gap-2 cursor-pointer backdrop-blur-sm transition-all duration-200 hover:bg-[#0B43FD]/10 hover:-translate-y-0.5 shadow-[0_2px_12px_rgba(11,67,253,0.1)]"
              >
                <FiCreditCard size={15} />
                خطط التقسيط
              </button>
            </div>
          </div>
        </section>

        {/* Slide 3 */}
        <section
          dir="rtl"
          className="relative w-full shrink-0 overflow-hidden flex items-center py-6 sm:py-8 min-h-[320px] sm:min-h-[520px]"
        >
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(/hero3.webp)" }} />
          <div className="absolute inset-0 bg-gradient-to-l from-white/90 via-white/70 to-white/10" />
          <div className="relative z-10 max-w-[700px] pr-5 sm:pr-14 ml-auto mr-[3%] sm:mr-[5%]">
            <div className="font-black text-[#0a0a0a] tracking-tight mb-3 sm:mb-4">
              <div className="leading-[1.1] mb-2 text-[clamp(1.1rem,2.5vw,1.8rem)]">اختار جهازك ..</div>
              <div className="leading-[1.1] mb-1">
                <span className="text-[clamp(2rem,5vw,4rem)] tracking-wide">واحنا نُسَهِّل</span>
              </div>
              <div className="leading-[1.1] flex items-center gap-3">
                <span className="inline-block bg-gradient-to-br from-[#0B43FD] to-[#4f8bff] bg-clip-text text-transparent py-1 text-[clamp(2rem,5vw,4rem)] tracking-wide">
                  الباقي
                </span>
                <Icon
                  icon="fluent:sparkle-28-filled"
                  className="text-[#0B43FD] shrink-0 drop-shadow-[0_0_8px_rgba(11,67,253,0.5)]"
                  style={{ fontSize: "clamp(1rem,2.5vw,1.8rem)" }}
                />
              </div>
            </div>
            <p className="text-[clamp(0.85rem,2vw,1rem)] text-[#333] leading-[1.6] font-normal mb-3 max-w-[420px]">
              اختار خطتك المناسبة وادفع على دفعات مريحة، بسهولة ووضوح، بدون تعقيد.
            </p>
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <div className="flex items-baseline gap-1">
                <span className="text-[clamp(1.4rem,3vw,2rem)] font-black text-[#0B43FD] leading-none tracking-tighter">1000</span>
                <span className="text-[clamp(0.85rem,2vw,1rem)] font-bold text-[#0B43FD]">ريال</span>
              </div>
              <div className="h-8 w-px bg-[#0B43FD]/20" />
              <span className="text-[clamp(0.75rem,1.8vw,0.88rem)] font-medium text-[#555] leading-snug">دفعة أولى<br />والباقي أقساط مريحة</span>
            </div>
            <div className="flex gap-3 flex-wrap mb-0">
              <button className="bg-[#0B43FD] text-white border-none rounded-2xl px-5 sm:px-8 py-2.5 sm:py-3 text-[clamp(0.85rem,2.5vw,1rem)] font-bold inline-flex items-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(11,67,253,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_8px_30px_rgba(11,67,253,0.5)]">
                <FiShoppingBag size={16} />
                تسوق الآن
              </button>
              <button
                onClick={() => router.push("/taqseet")}
                className="bg-[#0B43FD]/8 text-[#0B43FD] border-2 border-[#0B43FD] rounded-2xl px-4 sm:px-7 py-2.5 sm:py-3 text-[clamp(0.8rem,2.5vw,0.95rem)] font-bold inline-flex items-center gap-2 cursor-pointer backdrop-blur-sm transition-all duration-200 hover:bg-[#0B43FD]/15 hover:-translate-y-0.5"
              >
                <FiCreditCard size={15} />
                خطط التقسيط
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-400 ${
              current === i
                ? "w-6 h-2.5 bg-[#0B43FD]"
                : "w-2.5 h-2.5 bg-[#0B43FD]/30 hover:bg-[#0B43FD]/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
