import React from "react";
import Link from "next/link";
import { getAllInstruments } from "@/lib/content";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export default function HomePage() {
  const instruments = getAllInstruments();

  return (
    <div className="flex flex-col items-center w-full">
      {/* Bagian Pembuka (Hero Section) */}
      <section className="relative w-full min-h-[84vh] flex items-center justify-center px-4 sm:px-6 py-20 overflow-hidden">
        {/* Pendaran Cahaya Emas di Latar Belakang */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[620px] h-[340px] sm:h-[620px] bg-emas/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-8 z-10">
          {/* Badge Jirolu */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-arang/90 border border-perunggu/40 text-emas text-xs uppercase tracking-widest font-medium shadow-md">
            <span>ꦗꦶꦫꦺꦴꦭꦸ</span>
            <span>•</span>
            <span>Museum Gamelan Interaktif</span>
          </div>

          {/* Judul Besar Jirolu & Tagline */}
          <div className="space-y-4">
            <h1 className="font-serif text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-gading">
              Jirolu
            </h1>
            <p className="font-serif text-2xl sm:text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-emas via-emas-muda to-perunggu italic font-medium">
              &ldquo;Museum gamelan yang bisa kamu mainkan.&rdquo;
            </p>
          </div>

          {/* Kalimat Pengantar Singkat */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gading/80 leading-relaxed font-sans font-light">
            Eksplorasi warisan seni suara gamelan Jawa Tengah di ujung jarimu.
            Sentuh bilah Saron, dengungkan Bonang dan Gong, atau mainkan denyut irama Kendang
            secara virtual langsung di peramban web tanpa jeda suara.
          </p>

          {/* Tombol Aksi */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <a
              href="#galeri"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emas text-tinta font-semibold text-sm sm:text-base tracking-wide shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:shadow-[0_0_35px_rgba(212,175,55,0.6)] hover:bg-emas-muda transition-all duration-200 transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center min-h-[44px]"
            >
              Jelajahi Pameran
            </a>
            <Link
              href="/instrumen/saron"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-arang/80 border border-perunggu/50 text-gading hover:text-emas hover:border-emas text-sm sm:text-base tracking-wide transition-all duration-200 flex items-center justify-center min-h-[44px]"
            >
              Coba Mainkan Soundboard
            </Link>
          </div>

          {/* Statistik Koleksi Jirolu */}
          <div className="grid grid-cols-3 gap-4 pt-12 border-t border-perunggu/20 max-w-lg mx-auto text-center">
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-emas">4 Alat</div>
              <div className="text-[11px] sm:text-xs text-gading/60 uppercase tracking-wider mt-1">
                Saron, Bonang, Gong, Kendang
              </div>
            </div>
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-emas">2 Laras</div>
              <div className="text-[11px] sm:text-xs text-gading/60 uppercase tracking-wider mt-1">
                Pelog & Slendro
              </div>
            </div>
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-emas">0 ms</div>
              <div className="text-[11px] sm:text-xs text-gading/60 uppercase tracking-wider mt-1">
                Latensi Suara
              </div>
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
