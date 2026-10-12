import React from "react";
import Link from "next/link";
import { getAllInstruments } from "@/lib/content";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { HeroVideoBackground } from "@/components/ui/HeroVideoBackground";
import { FeaturesShowcase } from "@/components/home/FeaturesShowcase";

export default function HomePage() {
  const instruments = getAllInstruments();

  return (
    <div className="relative w-full min-h-screen">
      {/* Background Video Fixed (Tetap diam di posisi viewport saat halaman di-scroll) */}
      <HeroVideoBackground src="/background/bg-home.mp4" isFixed={true} />

      {/* Seluruh Konten Halaman Beranda (Scroll ke bawah di atas background video) */}
      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Bagian Pembuka (Hero Section) */}
        <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center px-4 sm:px-6 pt-[120px] pb-20">
          {/* Hero Body Layout */}
          <div className="relative max-w-[860px] mx-auto text-center flex flex-col items-center z-10 w-full">

          {/* Headline */}
          <div className="inline-flex items-center gap-2 text-emas text-s uppercase tracking-widest font-medium">
            <span>ꦮꦶꦭꦸꦗꦼꦁꦫꦮꦸꦃ</span>
          </div>
          <h1 className="text-[clamp(36px,7vw,60px)] leading-[1.15] text-white text-center mb-6 tracking-tight">
            <span className="font-sans font-bold block sm:inline">
              Jelajahi warisan suara gamelan,{" "}
            </span>
            <span className="font-serif italic font-normal block sm:inline">
              langsung dari layar anda.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-[16px] leading-[1.6] text-white/70 text-center max-w-[540px] mb-10 font-sans">
            Sentuh bilah saron, dengungkan bonang, dan rasakan getaran tradisi Jawa langsung di layar anda tanpa jeda sedikitpun.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              id="btn-primary"
              href="#galeri"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/25 hover:border-white/60 backdrop-blur-[8px] text-white hover:text-emas-muda font-medium text-[15px] transition-all duration-200 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center min-h-[48px]"
            >
              Jelajahi Galeri
            </a>
            <Link
              id="btn-secondary"
              href="/instrumen/saron"
              className="
              w-full sm:w-auto px-8 py-3.5 rounded-full bg-emas hover:bg-emas-muda text-tinta font-semibold text-[15px] border-none transition-all duration-200 transform hover:scale-[1.02] active:scale-95 flex items-center justify-center min-h-[48px] shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:shadow-[0_0_35px_rgba(212,175,55,0.6)]"
            >
              Mulai Bermain
            </Link>
          </div>
        </div>
      </section>

        {/* Bagian: Fitur Utama Museum (Features Showcase) */}
        <FeaturesShowcase />

        {/* Bagian Galeri Koleksi Pameran */}
        <div id="koleksi-alat" className="scroll-mt-20" />
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
  </div>
);
}
