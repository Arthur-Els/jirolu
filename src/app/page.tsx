import React from "react";
import Link from "next/link";
import { getAllInstruments } from "@/lib/content";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { HeroVideoBackground } from "@/components/ui/HeroVideoBackground";
import { FeaturesShowcase } from "@/components/home/FeaturesShowcase";

export default function HomePage() {
  const instruments = getAllInstruments();

  return (
    <div className="flex flex-col items-center w-full">
      {/* Bagian Pembuka (Hero Section) */}
      <section className="relative w-full min-h-[92vh] flex items-center justify-center px-4 sm:px-6 pt-[120px] pb-20 overflow-hidden">
        {/* Background Video Looping */}
        <HeroVideoBackground src="/background/bg-home.mp4" />

        {/* Hero Body Layout */}
        <div className="relative max-w-[860px] mx-auto text-center flex flex-col items-center z-10 w-full">
          {/* Eyebrow Badge */}
          <div className="font-mono text-[13px] tracking-[0.08em] text-white/60 mb-6 select-none">
            [ Pengalaman Museum Interaktif ]
          </div>

          {/* Headline */}
          <h1 className="text-[clamp(36px,6vw,68px)] leading-[1.15] text-white text-center mb-6 tracking-tight">
            <span className="font-sans font-bold block sm:inline">
              Warisan suara gamelan klasik,{" "}
            </span>
            <span className="font-serif italic font-normal block sm:inline">
              berdenyut lebih dekat.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-[16px] leading-[1.6] text-white/70 text-center max-w-[540px] mb-10 font-sans">
            Sentuh bilah saron, dengungkan bonang, dan rasakan vibrasi tradisi Jawa langsung dari peramban tanpa jeda nada.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              id="btn-primary"
              href="#galeri"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-emas hover:bg-emas-muda text-tinta font-semibold text-[15px] border-none transition-all duration-200 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center min-h-[48px] shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:shadow-[0_0_35px_rgba(212,175,55,0.6)]"
            >
              Jelajahi Pameran
            </a>
            <Link
              id="btn-secondary"
              href="/instrumen/saron"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/25 hover:border-emas/60 backdrop-blur-[8px] text-white hover:text-emas-muda font-medium text-[15px] transition-all duration-200 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center min-h-[48px]"
            >
              Mainkan Soundboard
            </Link>
          </div>

          {/* Statistik Koleksi Jirolu */}
          <div className="grid grid-cols-3 gap-6 pt-16 border-t border-white/10 max-w-lg mx-auto text-center mt-12 w-full">
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-white">4 Alat</div>
              <div className="text-[11px] sm:text-xs text-white/50 uppercase tracking-wider mt-1">
                Saron, Bonang, Gong, Kendang
              </div>
            </div>
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-white">2 Laras</div>
              <div className="text-[11px] sm:text-xs text-white/50 uppercase tracking-wider mt-1">
                Pelog & Slendro
              </div>
            </div>
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-white">0 ms</div>
              <div className="text-[11px] sm:text-xs text-white/50 uppercase tracking-wider mt-1">
                Latensi Suara
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bagian: Fitur Utama Museum (Features Showcase) */}
      <FeaturesShowcase />

      {/* Bagian Galeri Koleksi Pameran */}
      <GalleryGrid instruments={instruments} />

      {/* Bagian Sekilas Filosofi Karawitan */}
      <section className="w-full py-16 px-4 sm:px-6 bg-arang/40 border-y border-perunggu/20">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <span className="text-xs uppercase tracking-widest text-emas font-medium">
            Nilai Adiluhung Jawa
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gading">
            &ldquo;Laras, Raras, Rancak&rdquo;
          </h2>
          <p className="text-sm sm:text-base text-gading/75 leading-relaxed max-w-2xl mx-auto">
            Nama <strong>Jirolu</strong> mengingatkan kita bahwa musik gamelan bermula dari kesederhanaan langkah awal:
            <strong> ji (1), ro (2), dan lu (3)</strong>. Dari keselarasan nada dasar ini, lahirlah jalinan irama agung
            yang menyatukan rasa, cipta, dan budi pekerti manusia.
          </p>
        </div>
      </section>
    </div>
  );
}
