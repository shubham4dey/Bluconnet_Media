import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Preloader = ({ setIsLoading }) => {
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    /* Speed-optimized deterministic progress stages — one new percentage
       every 180 ms so it feels snappy:
       0 → 10 → 25 → 40 → 60 → 75 → 90 → 100 (≈1.26 s). The reveal effect
       below then holds briefly and opens the website. */
    const STAGES = [10, 25, 40, 60, 75, 90, 100];
    let index = 0;

    const timer = setInterval(() => {
      setLoadingProgress(STAGES[index]);
      index += 1;
      if (index >= STAGES.length) clearInterval(timer);
    }, 180); // ⚡ reduced from 400ms → 180ms

    return () => clearInterval(timer);
  }, []);

  /* Once progress reaches 100%, hold briefly, then reveal the website. */
  useEffect(() => {
    if (loadingProgress < 100) return undefined;
    const hideTimer = setTimeout(() => setIsLoading(false), 200); // ⚡ reduced from 400ms → 200ms
    return () => clearTimeout(hideTimer);
  }, [loadingProgress, setIsLoading]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[9999] bg-[#0a0e27] flex flex-col items-center justify-center"
        exit={{ opacity: 0, scale: 1.05, filter: "blur(6px)" }}
        transition={{ duration: 0.45, ease: "easeInOut" }} // ⚡ exit transition slightly faster
      >
        {/* ===== 3D RINGS WITH BRAND COLORS ===== */}
        <div className="relative w-48 h-48 flex items-center justify-center">
          {/* Ring 1 – Yellow */}
          <div
            className="absolute w-48 h-48 rounded-full border-b-8"
            style={{
              borderBottomColor: "#d4e157",
              animation: "rotate1 1.2s linear infinite", // ⚡ 2s → 1.2s
            }}
          />
          {/* Ring 2 – Cyan */}
          <div
            className="absolute w-48 h-48 rounded-full border-b-8"
            style={{
              borderBottomColor: "#06b6d4",
              animation: "rotate2 1.2s linear infinite", // ⚡ 2s → 1.2s
            }}
          />
          {/* Ring 3 – Lighter Yellow */}
          <div
            className="absolute w-48 h-48 rounded-full border-b-8"
            style={{
              borderBottomColor: "#c4d94b",
              animation: "rotate3 1.2s linear infinite", // ⚡ 2s → 1.2s
            }}
          />
          {/* Ring 4 – Lighter Cyan */}
          <div
            className="absolute w-48 h-48 rounded-full border-b-8"
            style={{
              borderBottomColor: "#2db4d4",
              animation: "rotate4 1.2s linear infinite", // ⚡ 2s → 1.2s
            }}
          />

          {/* Center Text */}
          <span className="text-white text-xs font-bold uppercase tracking-wider z-10">
            Loading
          </span>
        </div>

        {/* ===== BRAND NAME ===== */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }} // ⚡ delay 0.3 → 0.15
          className="text-white text-lg font-bold mt-6 tracking-tight"
        >
          Blu<span className="text-[#d4e157]">Connet</span>
          <span className="text-[#06b6d4]"> Media</span>
        </motion.h1>

        {/* ===== PROGRESS PERCENTAGE ===== */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }} // ⚡ delay 0.5 → 0.25
          data-i18n-skip=""
          className="mt-2 text-[#d4e157] font-mono font-bold text-sm tabular-nums"
        >
          {loadingProgress}%
        </motion.div>

        {/* ===== INLINE KEYFRAMES ===== */}
        <style>{`
          @keyframes rotate1 {
            from { transform: rotateX(50deg) rotateZ(110deg); }
            to { transform: rotateX(50deg) rotateZ(470deg); }
          }
          @keyframes rotate2 {
            from { transform: rotateX(20deg) rotateY(50deg) rotateZ(20deg); }
            to { transform: rotateX(20deg) rotateY(50deg) rotateZ(380deg); }
          }
          @keyframes rotate3 {
            from { transform: rotateX(40deg) rotateY(130deg) rotateZ(450deg); }
            to { transform: rotateX(40deg) rotateY(130deg) rotateZ(90deg); }
          }
          @keyframes rotate4 {
            from { transform: rotateX(70deg) rotateZ(270deg); }
            to { transform: rotateX(70deg) rotateZ(630deg); }
          }
        `}</style>
      </motion.div>
    </AnimatePresence>
  );
};

export default Preloader;