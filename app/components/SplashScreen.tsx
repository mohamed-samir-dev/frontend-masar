"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function SplashScreen() {
  const [visible, setVisible] = useState(false);
  const [hiding, setHiding] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("splashShown")) return;
    sessionStorage.setItem("splashShown", "1");
    setVisible(true);
    const t1 = setTimeout(() => setHiding(true), 1600);
    const t2 = setTimeout(() => setVisible(false), 2100);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(145deg, #0a3540 0%, #155E6F 55%, #0d4a58 100%)",
        opacity: hiding ? 0 : 1,
        transition: "opacity 0.5s ease",
        pointerEvents: hiding ? "none" : "auto",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          opacity: hiding ? 0 : 1,
          transform: hiding ? "scale(0.95)" : "scale(1)",
          transition: "opacity 0.4s ease, transform 0.4s ease",
        }}
      >
        {/* Logo */}
        <div
          style={{
            position: "relative",
            width: 110,
            height: 110,
            background: "white",
            borderRadius: 24,
            boxShadow: "0 16px 48px rgba(0,0,0,0.3)",
            marginBottom: 24,
            overflow: "hidden",
          }}
        >
          <Image src="/logo.webp" alt="البلاد" fill style={{ objectFit: "contain", padding: 10 }} />
        </div>

        {/* Name */}
        <p
          style={{
            color: "#fff",
            fontSize: "1.4rem",
            fontWeight: 800,
            margin: "0 0 4px",
            fontFamily: "Almarai, sans-serif",
          }}
        >
          مؤسسة البلاد الحديثة
        </p>
        <p
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: "0.9rem",
            margin: 0,
            fontFamily: "Almarai, sans-serif",
          }}
        >
          للإلكترونيات
        </p>
      </div>
    </div>
  );
}
