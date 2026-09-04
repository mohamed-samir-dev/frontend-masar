"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import type { ProductSection } from "../../../components/products/types";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};
const stagger = { show: { transition: { staggerChildren: 0.12 } } };

function InView({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} variants={stagger} initial="hidden" animate={inView ? "show" : "hidden"} className={className}>
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// DESIGN SECTION
// ─────────────────────────────────────────────────────────────────
function DesignSection({ section }: { section: ProductSection }) {
  const features: {
    id: string; label: string; title: string; image: string;
    colors?: { name: string; colorCode: string; image: string; title?: string }[];
  }[] = (section.content as Record<string, unknown>)?.features as never[] ?? [];

  const [active, setActive] = useState(0);
  const [colorIdx, setColorIdx] = useState(0);
  const feat = features[active];

  const displayImage =
    feat?.id === "colors" && feat.colors?.length ? feat.colors[colorIdx].image : feat?.image;

  return (
    <section className="mt-16" dir="rtl">
      <InView>
        <motion.div variants={fadeUp} className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-10 rounded-full bg-gradient-to-b from-[#0B43FD] to-[#0B43FD]/30" />
            <div>
              <p className="text-[10px] font-black tracking-[0.22em] uppercase text-[#0B43FD] mb-0.5">التصميم</p>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">{section.title}</h2>
            </div>
          </div>
        </motion.div>
      </InView>

      {/* Full-bleed image with overlay content */}
      <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden" style={{ minHeight: "clamp(360px, 60vw, 560px)" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={displayImage}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="absolute inset-0"
          >
            {displayImage && (
              <Image src={displayImage} alt={feat?.label ?? ""} fill className="object-cover" sizes="100vw" priority />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />

        {/* Content on image */}
        <div className="relative z-10 flex flex-col justify-end h-full p-4 sm:p-10" style={{ minHeight: "clamp(360px, 60vw, 560px)" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="mb-4 max-w-lg"
            >
              <p className="text-[10px] font-black tracking-widest uppercase text-white/50 mb-1.5">{feat?.label}</p>
              <AnimatePresence mode="wait">
                <motion.p
                  key={feat?.id === "colors" ? colorIdx : active}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="text-base sm:text-2xl font-black text-white leading-snug sm:leading-relaxed"
                >
                  {feat?.id === "colors" && feat.colors?.[colorIdx]?.title
                    ? feat.colors[colorIdx].title
                    : feat?.title}
                </motion.p>
              </AnimatePresence>

              {feat?.id === "colors" && feat.colors && (
                <div className="flex gap-2.5 mt-3">
                  {feat.colors.map((c, ci) => (
                    <button
                      key={ci}
                      title={c.name}
                      onClick={() => setColorIdx(ci)}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 transition-all duration-200 cursor-pointer ${
                        colorIdx === ci ? "border-white scale-110 shadow-lg" : "border-white/40"
                      }`}
                      style={{ backgroundColor: c.colorCode }}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Feature pills – scrollable on mobile */}
          <div className="flex gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible scrollbar-hide">
            {features.map((f, i) => (
              <button
                key={f.id}
                onClick={() => { setActive(i); setColorIdx(0); }}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-[11px] sm:text-xs font-black whitespace-nowrap transition-all duration-200 cursor-pointer backdrop-blur-sm shrink-0 ${
                  active === i
                    ? "bg-white text-gray-900 shadow-lg"
                    : "bg-white/15 text-white hover:bg-white/25 border border-white/20"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// CAMERA SECTION
// ─────────────────────────────────────────────────────────────────
function CameraSection({ section }: { section: ProductSection }) {
  const content = section.content as Record<string, unknown>;
  const hero = content?.hero as { stats: { value: string; label: string }[]; description: string } | undefined;
  const zoomLevels = content?.zoomLevels as { label: string; image: string }[] ?? [];
  const zoomFooter = content?.zoomFooter as { text: string } | undefined;
  const lenses = content?.lenses as { name: string; model: string; specs: string[] }[] ?? [];
  const proPhotos = content?.proPhotos as { title: string; items: { image: string; label: string }[] } | undefined;

  const [activeZoom, setActiveZoom] = useState(0);

  return (
    <section className="mt-16" dir="rtl">
      <InView>
        <motion.div variants={fadeUp} className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-10 rounded-full bg-gradient-to-b from-[#0B43FD] to-[#0B43FD]/30" />
            <div>
              <p className="text-[10px] font-black tracking-[0.22em] uppercase text-[#0B43FD] mb-0.5">الكاميرا</p>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">{section.title}</h2>
            </div>
          </div>
          {section.subtitle && <p className="text-gray-400 text-sm sm:mr-auto">{section.subtitle}</p>}
        </motion.div>
      </InView>

      {/* Hero – full bleed with stats */}
      {section.media?.[0]?.url && hero && (
        <InView>
          <motion.div variants={fadeUp} className="relative rounded-3xl overflow-hidden mb-4" style={{ minHeight: 480 }}>
            <Image
              src={section.media[0].url}
              alt={section.media[0].alt ?? ""}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />

            <div className="relative z-10 flex flex-col justify-end h-full p-6 sm:p-10" style={{ minHeight: 480 }}>
              {/* Stats row */}
              <div className="flex gap-8 sm:gap-14 mb-5 justify-center sm:justify-start">
                {hero.stats.map((s, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="text-center sm:text-right"
                  >
                    <p className="text-4xl sm:text-5xl font-black text-white">{s.value}</p>
                    <p className="text-[10px] sm:text-xs text-white/50 mt-1 max-w-[90px] leading-snug">{s.label}</p>
                  </motion.div>
                ))}
              </div>
              <p className="text-sm text-white/70 leading-loose max-w-2xl">{hero.description}</p>
            </div>
          </motion.div>
        </InView>
      )}

      {/* Zoom interactive */}
      {zoomLevels.length > 0 && (
        <InView>
          <motion.div variants={fadeUp} className="relative rounded-3xl overflow-hidden mb-4" style={{ minHeight: 400 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeZoom}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Image src={zoomLevels[activeZoom].image} alt={zoomLevels[activeZoom].label} fill className="object-cover" sizes="100vw" />
              </motion.div>
            </AnimatePresence>

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

            {/* Zoom badge */}
            <div className="absolute top-5 right-5 z-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeZoom}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-black/60 backdrop-blur-md text-white text-2xl font-black px-5 py-2.5 rounded-2xl border border-white/10"
                >
                  {zoomLevels[activeZoom].label}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Zoom pills at bottom */}
            <div className="absolute bottom-0 inset-x-0 z-10 p-5">
              {zoomFooter && (
                <p className="text-white/60 text-xs text-center mb-3">{zoomFooter.text}</p>
              )}
              <div className="flex gap-2 justify-center flex-wrap">
                {zoomLevels.map((z, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveZoom(i)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all duration-200 cursor-pointer backdrop-blur-sm ${
                      activeZoom === i
                        ? "bg-white text-gray-900 shadow-lg"
                        : "bg-white/15 text-white hover:bg-white/25 border border-white/20"
                    }`}
                  >
                    {z.label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </InView>
      )}

      {/* Lenses */}
      {lenses.length > 0 && (
        <InView className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {lenses.map((lens, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              className="bg-gray-900 rounded-2xl p-5 text-white"
            >
              <p className="text-[10px] font-black text-[#60a5fa] uppercase tracking-wider mb-1">{lens.model}</p>
              <p className="text-sm font-black mb-3">{lens.name}</p>
              <ul className="space-y-2">
                {lens.specs.map((s, si) => (
                  <li key={si} className="flex items-start gap-2 text-xs text-white/60">
                    <span className="text-[#60a5fa] font-black shrink-0 mt-0.5">·</span>
                    {s}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </InView>
      )}

      {/* Pro Photos grid */}
      {proPhotos && (
        <InView>
          <motion.div variants={fadeUp} className="rounded-3xl overflow-hidden">
            <div className="bg-gray-900 px-6 py-5">
              <p className="text-xl font-black text-white">{proPhotos.title}</p>
            </div>
            <div className="grid grid-cols-2 gap-0.5">
              {proPhotos.items.slice(0, 4).map((item, i) => (
                <div key={i} className="relative group overflow-hidden" style={{ aspectRatio: "1/1" }}>
                  <Image src={item.image} alt={item.label} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="50vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-4">
                    <p className="text-white text-xs font-semibold leading-snug">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </InView>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// PERFORMANCE SECTION
// ─────────────────────────────────────────────────────────────────
function PerformanceSection({ section }: { section: ProductSection }) {
  const content = section.content as Record<string, unknown>;
  const description = content?.description as string | undefined;
  const chips = content?.chips as { name: string; description: string; image: string }[] ?? [];
  const [active, setActive] = useState(0);

  return (
    <section className="mt-16" dir="rtl">
      <InView>
        <motion.div variants={fadeUp} className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-10 rounded-full bg-gradient-to-b from-[#0B43FD] to-[#0B43FD]/30" />
            <div>
              <p className="text-[10px] font-black tracking-[0.22em] uppercase text-[#0B43FD] mb-0.5">الأداء</p>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">{section.title}</h2>
            </div>
          </div>
          {section.subtitle && <p className="text-gray-400 text-sm sm:mr-auto">{section.subtitle}</p>}
        </motion.div>
      </InView>

      {/* Full-bleed dark card */}
      <InView>
        <motion.div variants={fadeUp} className="relative rounded-3xl overflow-hidden bg-gray-950">
          {/* Decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#0B43FD]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 p-6 sm:p-10">
            {description && (
              <p className="text-sm sm:text-base text-white/60 leading-loose max-w-2xl mb-8">{description}</p>
            )}

            {/* Chip tabs */}
            {chips.length > 0 && (
              <>
                <div className="flex gap-2 mb-6 flex-wrap">
                  {chips.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`px-4 py-2 rounded-full text-xs font-black transition-all duration-200 cursor-pointer ${
                        active === i
                          ? "bg-[#0B43FD] text-white shadow-lg shadow-[#0B43FD]/30"
                          : "bg-white/8 text-white/60 hover:bg-white/15 border border-white/10"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                    className="bg-white/5 rounded-2xl p-5 border border-white/8"
                  >
                    <p className="text-base font-black text-white mb-2">{chips[active].name}</p>
                    <p className="text-sm text-white/60 leading-loose">{chips[active].description}</p>
                  </motion.div>
                </AnimatePresence>
              </>
            )}
          </div>
        </motion.div>
      </InView>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// BATTERY SECTION
// ─────────────────────────────────────────────────────────────────
function BatterySection({ section }: { section: ProductSection }) {
  const content = section.content as Record<string, unknown>;
  const description = content?.description as string | undefined;
  const stats = content?.stats as { value: string; unit: string; label: string }[] ?? [];

  return (
    <section className="mt-16" dir="rtl">
      <InView>
        <motion.div variants={fadeUp} className="mb-8 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-10 rounded-full bg-gradient-to-b from-[#0B43FD] to-[#0B43FD]/30" />
            <div>
              <p className="text-[10px] font-black tracking-[0.22em] uppercase text-[#0B43FD] mb-0.5">البطارية</p>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">{section.title}</h2>
            </div>
          </div>
          {section.subtitle && <p className="text-gray-400 text-sm sm:mr-auto">{section.subtitle}</p>}
        </motion.div>
      </InView>

      {/* Stats full-bleed */}
      <InView>
        <motion.div
          variants={fadeUp}
          className="relative rounded-3xl overflow-hidden bg-gray-950 p-6 sm:p-10"
        >
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {stats.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                {stats.map((s, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    className="text-center border-b sm:border-b-0 sm:border-l border-white/8 last:border-0 pb-6 sm:pb-0 sm:pl-6 last:pl-0"
                  >
                    <div className="flex items-end justify-center gap-1.5 mb-2">
                      <span className="text-5xl sm:text-6xl font-black text-white">{s.value}</span>
                      <span className="text-base font-bold text-[#34d399] mb-2">{s.unit}</span>
                    </div>
                    <p className="text-xs text-white/40 leading-snug max-w-[140px] mx-auto">{s.label}</p>
                  </motion.div>
                ))}
              </div>
            )}

            {description && (
              <p className="text-sm text-white/50 leading-loose text-center max-w-2xl mx-auto">{description}</p>
            )}
          </div>
        </motion.div>
      </InView>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────
export default function ProductSections({ sections }: { sections?: ProductSection[] }) {
  if (!sections?.length) return null;

  const active = sections
    .filter((s) => s.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="pb-10">
      {active.map((s) => {
        if (s.type === "design")      return <DesignSection      key={s._id ?? s.type} section={s} />;
        if (s.type === "camera")      return <CameraSection      key={s._id ?? s.type} section={s} />;
        if (s.type === "performance") return <PerformanceSection key={s._id ?? s.type} section={s} />;
        if (s.type === "battery")     return <BatterySection     key={s._id ?? s.type} section={s} />;
        return null;
      })}
    </div>
  );
}
