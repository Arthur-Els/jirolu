"use client";

import React, { useEffect, useRef } from "react";

interface HeroVideoBackgroundProps {
  src: string;
  isFixed?: boolean;
}

export const HeroVideoBackground: React.FC<HeroVideoBackgroundProps> = ({
  src,
  isFixed = true,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Memastikan atribut muted dan loop aktif di level DOM untuk melewati restriksi autoplay browser
    video.defaultMuted = true;
    video.muted = true;
    video.loop = true;

    const playVideo = () => {
      video.play().catch((err) => {
        console.warn("Autoplay tertunda oleh kebijakan peramban:", err);
      });
    };

    // Jalankan segera jika sudah siap atau dengarkan event kesiapan video
    if (video.readyState >= 2) {
      playVideo();
    } else {
      video.addEventListener("loadeddata", playVideo, { once: true });
      video.addEventListener("canplay", playVideo, { once: true });
    }

    // Penanganan cadangan jika peramban membutuhkan interaksi awal
    const handleFirstInteraction = () => {
      if (video && video.paused) {
        playVideo();
      }
    };

    window.addEventListener("click", handleFirstInteraction, { once: true });
    window.addEventListener("touchstart", handleFirstInteraction, { once: true });
    window.addEventListener("scroll", handleFirstInteraction, { once: true });

    return () => {
      window.removeEventListener("click", handleFirstInteraction);
      window.removeEventListener("touchstart", handleFirstInteraction);
      window.removeEventListener("scroll", handleFirstInteraction);
    };
  }, []);

  return (
    <div
      className={`${
        isFixed ? "fixed inset-0 z-0" : "absolute inset-0"
      } w-full h-full overflow-hidden pointer-events-none select-none`}
      aria-hidden="true"
    >
      {/* Elemen Video Asli dari folder public/background yang di-loop terus menerus */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
      >
        <source src={src} type="video/mp4" />
        Peramban Anda tidak mendukung pemutaran video.
      </video>

      {/* Lapisan 1: Dimming sinematik gelap agar teks tetap kontras */}
      <div className="absolute inset-0 bg-tinta/60 pointer-events-none" />

      {/* Lapisan 2: Gradien radial lembut untuk kedalaman visual */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(11,10,9,0.2) 0%, rgba(11,10,9,0.75) 100%)",
        }}
      />

      {/* Lapisan 3: Tekstur pola batik halus di atas video */}
      <div className="absolute inset-0 bg-batik-pattern opacity-40 pointer-events-none" />
    </div>
  );
};
