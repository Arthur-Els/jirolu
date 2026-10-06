import React from "react";
import Link from "next/link";
import { getAllInstruments } from "@/lib/content";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { HeroVideoBackground } from "@/components/ui/HeroVideoBackground";

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

      {/* Bagian: Yang Bisa Kamu Lakukan di Jirolu */}
      <section className="w-full py-12 px-4 sm:px-6 bg-arang/30 border-y border-perunggu/20">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest text-emas font-semibold">
              Fitur Utama Museum
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-gading">
              Yang Bisa Kamu Lakukan di Jirolu
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Kartu 1: Jelajahi Pameran */}
            <div className="p-6 rounded-2xl bg-arang/80 border border-perunggu/30 space-y-3 shadow-lg flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emas/15 border border-emas/40 flex items-center justify-center text-emas font-serif font-bold text-lg">
                  1
                </div>
                <h3 className="font-serif text-xl font-bold text-gading">
                  Jelajahi Pameran
                </h3>
                <p className="text-sm text-gading/70 leading-relaxed font-light">
                  Pelajari anatomi fisik, fungsi ansambel, dan makna filosofis adiluhung Jawa di balik tiap alat musik karawitan.
                </p>
              </div>
              <a
                href="#galeri"
                className="text-xs font-semibold text-emas hover:text-emas-muda pt-2 inline-flex items-center gap-1.5"
              >
                <span>Lihat Koleksi Galeri</span>
                <span>→</span>
              </a>
            </div>

            {/* Kartu 2: Mainkan Gamelan */}
            <div className="p-6 rounded-2xl bg-arang/80 border border-perunggu/30 space-y-3 shadow-lg flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emas/15 border border-emas/40 flex items-center justify-center text-emas font-serif font-bold text-lg">
                  2
                </div>
                <h3 className="font-serif text-xl font-bold text-gading">
                  Mainkan Gamelan
                </h3>
                <p className="text-sm text-gading/70 leading-relaxed font-light">
                  Tabuh bilah perunggu, pencon, gong, dan kendang secara bebas tanpa delay lewat sentuhan layar atau tuts keyboard komputer.
                </p>
              </div>
              <Link
                href="/instrumen/saron"
                className="text-xs font-semibold text-emas hover:text-emas-muda pt-2 inline-flex items-center gap-1.5"
              >
                <span>Mulai Main Bebas</span>
                <span>→</span>
              </Link>
            </div>

            {/* Kartu 3: Belajar Lagu & Rekam */}
            <div className="p-6 rounded-2xl bg-arang/80 border border-perunggu/30 space-y-3 shadow-lg flex flex-col justify-between">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emas/15 border border-emas/40 flex items-center justify-center text-emas font-serif font-bold text-lg">
                  3
                </div>
                <h3 className="font-serif text-xl font-bold text-gading">
                  Belajar Lagu & Rekam
                </h3>
                <p className="text-sm text-gading/70 leading-relaxed font-light">
                  Ikuti panduan tuts berdenyut emas untuk memainkan lagu tradisional, serta rekam permainanmu dan putar kembali kreasimu.
                </p>
              </div>
              <Link
                href="/cara-bermain"
                className="text-xs font-semibold text-emas hover:text-emas-muda pt-2 inline-flex items-center gap-1.5"
              >
                <span>Baca Panduan Lengkap</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

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
