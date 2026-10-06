"use client";

import React, { useEffect, useRef } from "react";

interface HeroVideoBackgroundProps {
  src: string;
}

export const HeroVideoBackground: React.FC<HeroVideoBackgroundProps> = ({ src }) => {
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
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      {/* Elemen Video Asli dari folder public/background yang di-loop */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
        className="w-full h-full object-cover"
      >
        <source src={src} type="video/mp4" />
        Peramban Anda tidak mendukung pemutaran video.
      </video>

      {/* Visual Effects: Dark-ambient linear gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </div>
  );
};
