"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen() {
  const [show, setShow] = useState(false);
  const [exit, setExit] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("splashShown")) return;
    sessionStorage.setItem("splashShown", "1");

    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    setShow(true);
    const t = setTimeout(() => setExit(true), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && !exit && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%", transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] } }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(145deg, #0a3540 0%, #155E6F 55%, #0d4a58 100%)",
            overflow: "hidden",
          }}
        >
          {/* Ambient blobs */}
          <motion.div
            animate={{ x: [0, 18, 0], y: [0, 14, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              width: 420,
              height: 420,
              borderRadius: "50%",
              background: "#6DBE00",
              filter: "blur(80px)",
              opacity: 0.18,
              top: -120,
              right: -120,
            }}
          />
          <motion.div
            animate={{ x: [0, -14, 0], y: [0, -18, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{
              position: "absolute",
              width: 320,
              height: 320,
              borderRadius: "50%",
              background: "#1F7A8C",
              filter: "blur(70px)",
              opacity: 0.2,
              bottom: -100,
              left: -100,
            }}
          />

          {/* Logo + text */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0, position: "relative", zIndex: 1 }}>
            {/* Logo card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.72, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
              style={{
                position: "relative",
                width: 120,
                height: 120,
                background: "white",
                borderRadius: 28,
                padding: 12,
                boxShadow: "0 24px 64px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.1)",
                marginBottom: 28,
              }}
            >
              <Image src="/logo.webp" alt="البلاد" fill className="object-contain" />

              {/* Subtle shine sweep */}
              <motion.div
                initial={{ x: "-120%" }}
                animate={{ x: "220%" }}
                transition={{ duration: 0.9, delay: 0.5, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 28,
                  background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.55) 50%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
            </motion.div>

            {/* Divider */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.55, ease: "easeOut" }}
              style={{
                width: 52,
                height: 2,
                background: "linear-gradient(90deg, transparent, #6DBE00, transparent)",
                marginBottom: 18,
                transformOrigin: "center",
              }}
            />

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.65, ease: "easeOut" }}
              style={{
                color: "#ffffff",
                fontSize: "1.55rem",
                fontWeight: 800,
                margin: "0 0 4px",
                textShadow: "0 2px 20px rgba(0,0,0,0.4)",
                fontFamily: "Almarai, sans-serif",
              }}
            >
              مؤسسة البلاد الحديثة
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.75, ease: "easeOut" }}
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: "0.95rem",
                fontWeight: 500,
                margin: "0 0 22px",
                fontFamily: "Almarai, sans-serif",
              }}
            >
              للإلكترونيات
            </motion.p>

            {/* Tag */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.88, ease: "easeOut" }}
              style={{
                color: "#6DBE00",
                fontSize: "0.8rem",
                fontWeight: 600,
                background: "rgba(109,190,0,0.1)",
                border: "1px solid rgba(109,190,0,0.3)",
                borderRadius: 50,
                padding: "6px 20px",
                fontFamily: "Almarai, sans-serif",
              }}
            >
              ✦ أجهزة إلكترونية بالتقسيط المريح ✦
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
