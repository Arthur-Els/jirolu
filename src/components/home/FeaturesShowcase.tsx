"use client";

import React from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { Locale } from "@/lib/i18n/types";

interface FeatureCard {
  index: string;
  title: string;
  description: string;
  cta: {
    text: string;
    action_url: string;
  };
}

const FEATURE_CARDS_BY_LOCALE: Record<Locale, FeatureCard[]> = {
  id: [
    {
      index: "01",
      title: "Kenali ragam instrumen",
      description:
        "Dengar sampel audio dan pelajari peran gong, kendang, bonang, serta saron dalam gending Jawa.",
      cta: {
        text: "Lihat instrumen",
        action_url: "#galeri",
      },
    },
    {
      index: "02",
      title: "Tabuh nada langsung",
      description:
        "Simulasi interaktif bilah gamelan menggunakan keyboard komputer atau sentuhan layar ponsel.",
      cta: {
        text: "Mulai tabuh",
        action_url: "/instrumen/saron",
      },
    },
    {
      index: "03",
      title: "Belajar lagu daerah",
      description:
        "Ikuti panduan ketukan visual untuk melagukan tembang tradisional seperti Gundul Pacul dan Lir-Ilir.",
      cta: {
        text: "Buka panduan",
        action_url: "/tutorial",
      },
    },
  ],
  en: [
    {
      index: "01",
      title: "Discover each instrument",
      description:
        "Listen to audio samples and learn the roles of Gong, Kendang, Bonang, and Saron in Javanese Karawitan.",
      cta: {
        text: "View instruments",
        action_url: "#galeri",
      },
    },
    {
      index: "02",
      title: "Strike the notes live",
      description:
        "Interactive gamelan bars and kettle simulation played with your computer keyboard or mobile touch screen.",
      cta: {
        text: "Start playing",
        action_url: "/instrumen/saron",
      },
    },
    {
      index: "03",
      title: "Learn traditional songs",
      description:
        "Follow visual beat guides to perform classic Javanese melodies such as Gundul-Gundul Pacul and Lir-Ilir.",
      cta: {
        text: "Open guide",
        action_url: "/tutorial",
      },
    },
  ],
};

export const FeaturesShowcase: React.FC = () => {
  const { locale } = useLanguage();
  const featureCards = FEATURE_CARDS_BY_LOCALE[locale];

  const handleCtaClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    url: string
  ) => {
    if (url === "#galeri") {
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
      id="fitur"
      className="relative z-10 w-full pt-20 sm:pt-28 pb-36 sm:pb-48 px-4 sm:px-6 overflow-hidden pointer-events-none"
    >
      <div className="relative z-10 max-w-6xl mx-auto w-full pointer-events-none">
        {/* Header Section */}
        <header className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4 mb-12 sm:mb-16 pointer-events-auto">
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-ink tracking-tight">
            {locale === "en" ? "How to Experience Jirolu" : "Cara Menikmati Jirolu"}
          </h2>
          <div className="w-[25%] h-0.5 bg-accent mx-auto rounded-full my-3" />
          <p className="text-sm sm:text-base text-ink-2 leading-relaxed max-w-2xl mx-auto font-light">
            {locale === "en"
              ? "From simply listening to melodic resonance to learning how to play traditional songs yourself."
              : "Dari sekadar mendengarkan alunan nada sampai belajar memainkan tembang sendiri."}
          </p>
        </header>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full pointer-events-auto">
          {featureCards.map((card) => (
            <div
              key={card.index}
              className="bg-paper-2/85 border border-rule hover:border-accent/50 rounded-2xl p-7 sm:p-9 flex flex-col justify-between w-full motion-safe:transition-colors duration-200"
            >
              <div>
                <span className="font-mono text-xs text-muted mb-4 block">
                  {card.index}
                </span>

                <h3 className="font-serif text-xl sm:text-2xl font-normal text-ink mb-3 leading-snug">
                  {card.title}
                </h3>

                <p className="font-sans text-sm leading-relaxed text-ink-2 mb-8">
                  {card.description}
                </p>
              </div>

              <div>
                <Link
                  href={card.cta.action_url}
                  onClick={(e) => handleCtaClick(e, card.cta.action_url)}
                  className="inline-flex items-center text-sm font-semibold text-accent hover:text-accent-2 motion-safe:transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2"
                >
                  <span>{card.cta.text}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transisi Fade Out Halus di Bawah Seksi Fitur Menuju Warna Solid Panggung */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 sm:h-52 pointer-events-none select-none z-0 bg-gradient-to-b from-transparent via-tinta/75 to-tinta"
        aria-hidden="true"
      />
    </section>
  );
};

export default FeaturesShowcase;
