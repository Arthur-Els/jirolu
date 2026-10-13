"use client";

import React from "react";
import Link from "next/link";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface FeatureCard {
  index: string;
  title: string;
  description: string;
  cta: {
    text: string;
    icon: string;
    action_url: string;
  };
}

const FEATURE_CARDS: FeatureCard[] = [
  {
    index: "[1]",
    title: "Jelajahi Alat Musik",
    description:
      "Pelajari anatomi fisik, fungsi ansambel, dan makna filosofis adiluhung Jawa di balik instrumen karawitan.",
    cta: {
      text: "Lihat Galeri",
      icon: "arrow-right",
      action_url: "/galeri",
    },
  },
  {
    index: "[2]",
    title: "Mainkan Gamelan",
    description:
      "Tabuh bilah perunggu, pencon, gong, dan kendang secara bebas tanpa jeda nada langsung di peramban web.",
    cta: {
      text: "Mulai Bermain",
      icon: "arrow-right",
      action_url: "/soundboard",
    },
  },
  {
    index: "[3]",
    title: "Belajar Lagu dan Rekam",
    description:
      "Ikuti panduan tuts berdenyut emas untuk melagukan tembang tradisional dan simpan rekaman kreasimu.",
    cta: {
      text: "Baca Panduan",
      icon: "arrow-right",
      action_url: "/tutorial",
    },
  },
];

export const FeaturesShowcase: React.FC = () => {
  const handleCtaClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    url: string
  ) => {
    if (url === "/galeri") {
      const galleryElement = document.getElementById("galeri");
      if (galleryElement) {
        e.preventDefault();
        galleryElement.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", "/#galeri");
      }
    }
  };

  return (
    <section
      id="features_showcase"
      className="relative w-full py-[100px] px-[24px] overflow-hidden"
    >
      {/* Background layer dengan gradasi lembut di tepi atas & bawah agar membaur menyatu dengan background video */}
      <div
        className="absolute inset-0 pointer-events-none select-none"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(13, 12, 10, 0.4) 40px, rgba(13, 12, 10, 0.85) 90px, #0d0c0a 150px, #0d0c0a calc(100% - 150px), rgba(13, 12, 10, 0.85) calc(100% - 90px), rgba(13, 12, 10, 0.4) calc(100% - 40px), transparent 100%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[1200px] mx-auto w-full">
        {/* Header Section */}
        <ScrollReveal direction="up" distance={28} duration={0.65} scale={0.96}>
          <header className="flex flex-col items-center text-center">
            {/* Eyebrow */}
            <div
              className="font-mono text-[13px] tracking-[0.12em] text-[#D4AF37] mb-[16px] text-center select-none"
              style={{
                fontFamily: "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                letterSpacing: "0.12em",
              }}
            >
              [ FITUR UTAMA MUSEUM ]
            </div>

            {/* Headline */}
            <h2
              className="text-[clamp(32px,4vw,48px)] text-[#F3E5AB] text-center mb-[64px] leading-tight"
              style={{ color: "#F3E5AB" }}
            >
              <span
                className="font-sans font-bold"
                style={{
                  fontFamily:
                    "var(--font-plus-jakarta), 'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                }}
              >
                Yang Bisa Kamu Lakukan di Jirolu
              </span>
            </h2>
          </header>
        </ScrollReveal>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[32px] w-full">
          {FEATURE_CARDS.map((card, idx) => (
            <ScrollReveal
              key={card.index}
              direction="up"
              distance={36}
              scale={0.93}
              delay={idx * 0.15}
              duration={0.7}
              className="h-full flex"
            >
              <div
                className="group rounded-[20px] p-[40px_32px] flex flex-col justify-between w-full transition-all duration-300 ease-out hover:-translate-y-[4px]"
                style={{
                  backgroundColor: "rgba(28, 25, 20, 0.6)",
                  border: "1px solid rgba(212, 175, 55, 0.2)",
                  borderRadius: "20px",
                  padding: "40px 32px",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#D4AF37";
                  e.currentTarget.style.boxShadow =
                    "0 8px 30px rgba(212, 175, 55, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.2)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {/* Bagian Atas Kartu */}
                <div>
                  {/* Index Typography */}
                  <div
                    className="font-mono text-[15px] text-[#D4AF37] mb-[28px] select-none"
                    style={{
                      fontFamily:
                        "var(--font-jetbrains-mono), 'JetBrains Mono', monospace",
                      color: "#D4AF37",
                      fontSize: "15px",
                      marginBottom: "28px",
                    }}
                  >
                    {card.index}
                  </div>

                  {/* Title Typography */}
                  <h3
                    className="font-serif text-[24px] font-semibold text-[#FFF9E6] mb-[14px] leading-snug"
                    style={{
                      fontFamily:
                        "var(--font-playfair), 'Playfair Display', serif",
                      fontSize: "24px",
                      fontWeight: 600,
                      color: "#FFF9E6",
                      marginBottom: "14px",
                    }}
                  >
                    {card.title}
                  </h3>

                  {/* Description Typography */}
                  <p
                    className="font-sans text-[14px] leading-[1.7] text-[rgba(255,249,230,0.7)] mb-[36px]"
                    style={{
                      fontFamily:
                        "var(--font-plus-jakarta), 'Plus Jakarta Sans', sans-serif",
                      fontSize: "14px",
                      lineHeight: 1.7,
                      color: "rgba(255, 249, 230, 0.7)",
                      marginBottom: "36px",
                    }}
                  >
                    {card.description}
                  </p>
                </div>

                {/* Bagian Bawah Kartu (CTA Link) */}
                <div>
                  <Link
                    href={card.cta.action_url}
                    onClick={(e) => handleCtaClick(e, card.cta.action_url)}
                    className="inline-flex items-center gap-[8px] text-[14px] font-semibold text-[#E5C158] hover:text-[#FFF9E6] transition-colors"
                    style={{
                      fontFamily:
                        "var(--font-plus-jakarta), 'Plus Jakarta Sans', sans-serif",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#E5C158",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <span>{card.cta.text}</span>
                    <svg
                      className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-200"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
