"use client";

import React from "react";
import Link from "next/link";

interface FeatureCard {
  index: string;
  title: string;
  description: string;
  cta: {
    text: string;
    action_url: string;
  };
}

const FEATURE_CARDS: FeatureCard[] = [
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
];

export const FeaturesShowcase: React.FC = () => {
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
      className="relative w-full py-20 sm:py-28 px-4 sm:px-6 bg-paper"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* Header Section */}
        <header className="mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl text-ink font-serif font-normal mb-3">
            Cara Menikmati Jirolu
          </h2>
          <p className="font-sans text-sm sm:text-base text-ink-2 max-w-xl">
            Dari sekadar mendengarkan alunan nada sampai belajar memainkan tembang sendiri.
          </p>
        </header>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full">
          {FEATURE_CARDS.map((card) => (
            <div
              key={card.index}
              className="bg-paper-2 border border-rule hover:border-accent/40 rounded-2xl p-7 sm:p-9 flex flex-col justify-between w-full motion-safe:transition-colors duration-200"
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
    </section>
  );
};

export default FeaturesShowcase;
