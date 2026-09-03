"use client";
import { motion } from "framer-motion";

const blobs = [
  { size: 600, x: ["10%", "25%", "8%"], y: ["5%", "18%", "5%"], color: "#c7d7ff", duration: 18 },
  { size: 500, x: ["70%", "55%", "72%"], y: ["2%", "15%", "2%"], color: "#dce8ff", duration: 22 },
  { size: 400, x: ["40%", "55%", "38%"], y: ["60%", "72%", "60%"], color: "#e8f0ff", duration: 20 },
  { size: 350, x: ["80%", "68%", "82%"], y: ["55%", "68%", "55%"], color: "#d4e4ff", duration: 25 },
];

export default function HomeBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-[#eef2ff] via-[#f5f7ff] to-white" />
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-[80px] opacity-60"
          style={{
            width: b.size,
            height: b.size,
            background: b.color,
            left: b.x[0],
            top: b.y[0],
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{ left: b.x, top: b.y }}
          transition={{ duration: b.duration, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}
