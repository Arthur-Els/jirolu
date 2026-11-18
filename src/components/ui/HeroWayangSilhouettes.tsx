"use client";

import React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export const HeroWayangSilhouettes: React.FC = () => {
  const { scrollY } = useScroll();

  // Opacity & parallax transform saat pengguna scroll ke bawah
  // Memudar dari opacity 1 ke 0 saat scroll 0 -> 400px
  const scrollOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const scrollYParallax = useTransform(scrollY, [0, 400], [0, -70]);

  // Gaya visual gradient mask agar bagian bawah tubuh wayang melebur lembut ke dasar layar
  const bottomFadeMaskStyle: React.CSSProperties = {
    WebkitMaskImage:
      "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.3) 10%, rgba(0,0,0,0.85) 24%, black 36%, black 100%)",
    maskImage:
      "linear-gradient(to top, transparent 0%, rgba(0,0,0,0.3) 10%, rgba(0,0,0,0.85) 24%, black 36%, black 100%)",
  };

  return (
    <motion.div
      style={{ opacity: scrollOpacity, y: scrollYParallax }}
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
      aria-hidden="true"
    >
      {/* Kontainer Siluet Wayang 1 (Sisi Kiri - Menjulang dari Dasar Layar sebagai Penyambut) */}
      <motion.div
        initial={{ opacity: 0, y: 90 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1.4,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.15,
        }}
        className="absolute bottom-0 left-[-22%] sm:left-[-8%] md:left-[0%] lg:left-[2%] xl:left-[5%] h-[68vh] sm:h-[82vh] md:h-[90vh] lg:h-[95vh] max-h-[920px] aspect-[598/1080]"
      >
        <div
          className="relative w-full h-full"
          style={bottomFadeMaskStyle}
        >
          <Image
            src="/background/wayang 1.png"
            alt="Siluet Wayang Penyambut Kiri"
            fill
            priority
            sizes="(max-width: 640px) 70vw, (max-width: 1024px) 50vw, 40vw"
            className="object-contain object-bottom brightness-0 opacity-30 sm:opacity-50 md:opacity-60 transition-opacity duration-300"
          />
        </div>
      </motion.div>

      {/* Kontainer Siluet Wayang 2 (Sisi Kanan - Menjulang dari Dasar Layar sebagai Penyambut) */}
      <motion.div
        initial={{ opacity: 0, y: 90 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1.4,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.28,
        }}
        className="absolute bottom-0 right-[-22%] sm:right-[-8%] md:right-[0%] lg:right-[2%] xl:right-[5%] h-[68vh] sm:h-[82vh] md:h-[90vh] lg:h-[95vh] max-h-[920px] aspect-[487/1080]"
      >
        <div
          className="relative w-full h-full"
          style={bottomFadeMaskStyle}
        >
          <Image
            src="/background/wayang 2.png"
            alt="Siluet Wayang Penyambut Kanan"
            fill
            priority
            sizes="(max-width: 640px) 70vw, (max-width: 1024px) 50vw, 40vw"
            className="object-contain object-bottom brightness-0 opacity-30 sm:opacity-50 md:opacity-60 transition-opacity duration-300"
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HeroWayangSilhouettes;
