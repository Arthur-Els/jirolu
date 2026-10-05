import React from "react";
import Link from "next/link";
import { getAllInstruments } from "@/lib/content";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export default function HomePage() {
  const instruments = getAllInstruments();

  return (
    <div className="flex flex-col items-center w-full">
      {/* Bagian Pembuka (Hero Section) */}
      <section className="relative w-full min-h-[82vh] flex items-center justify-center px-4 sm:px-6 py-20 overflow-hidden">
        {/* Pendaran Cahaya Emas di Latar Belakang */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[600px] h-[340px] sm:h-[600px] bg-emas/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-8 z-10">
          {/* Badge Etnik Jawa */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-arang/90 border border-perunggu/40 text-emas text-xs uppercase tracking-widest font-medium shadow-md">
            <span>ꦩꦸꦱꦶꦪꦸꦩ꧀ꦒꦩꦼꦭꦤ꧀</span>
            <span>•</span>
            <span>Pameran Seni Suara Tradisi</span>
          </div>

          {/* Judul Besar Utama */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-gading leading-[1.15]">
            Denting Keheningan, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emas via-emas-muda to-perunggu">
              Harmoni Jiwa Jawa
            </span>
          </h1>

          {/* Kalimat Pengantar Singkat */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-gading/80 leading-relaxed font-sans font-light">
            Selamat datang di Museum Digital Gamelan Jawa Tengah. Selami kedalaman filosofis
            tiap instrumen dan rasakan langsung getaran bilah logam perunggu melalui soundboard
            virtual tanpa jeda suara.
          </p>

          {/* Aksi Tombol */}
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
              Mainkan Saron Virtual
            </Link>
          </div>

          {/* Statistik / Ringkasan Singkat Pameran */}
          <div className="grid grid-cols-3 gap-4 pt-12 border-t border-perunggu/20 max-w-lg mx-auto text-center">
            <div>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-emas">4+</div>
              <div className="text-[11px] sm:text-xs text-gading/60 uppercase tracking-wider mt-1">
                Alat Musik
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
            Nilai Adiluhung
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-gading">
            &ldquo;Aja Kagetan, Aja Gumunan, Aja Dumeh&rdquo;
          </h2>
          <p className="text-sm sm:text-base text-gading/75 leading-relaxed max-w-2xl mx-auto">
            Gamelan bukan sekadar deretan instrumen musik, melainkan cerminan tata hidup masyarakat
            Jawa yang mengedepankan keselarasan, tenggang rasa, dan pengendalian ego demi
            terciptanya irama kehidupan yang tenteram dan seimbang.
          </p>
        </div>
      </section>
    </div>
  );
}
