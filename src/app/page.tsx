import React from "react";
import Link from "next/link";
import { getAllInstruments } from "@/lib/content";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export default function HomePage() {
  const instruments = getAllInstruments();

  return (
    <div className="flex flex-col items-center w-full">
      {/* Bagian Pembuka (Hero Section) dengan Background Video */}
      <section className="relative w-full min-h-[85vh] sm:min-h-[88vh] flex items-center justify-center px-4 sm:px-6 py-20 overflow-hidden">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
            className="w-full h-full object-cover opacity-60 scale-105"
          >
            <source src="/background/bg-home.mp4" type="video/mp4" />
          </video>
          {/* Overlay Gelap & Gradien Halus agar teks kontras dan transisi ke bawah mulus */}
          <div className="absolute inset-0 bg-tinta/60 backdrop-blur-[0.5px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-tinta/85 via-tinta/40 to-tinta" />
        </div>

        {/* Pendaran Cahaya Emas di Latar Belakang */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[620px] h-[340px] sm:h-[620px] bg-emas/15 rounded-full blur-[130px] pointer-events-none" />

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
