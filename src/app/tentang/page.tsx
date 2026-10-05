import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Jirolu | Museum Gamelan yang Bisa Kamu Mainkan",
  description:
    "Mengenal asal usul nama Jirolu, tujuan pelestarian karawitan, ucapan terima kasih, dan lisensi sumber daya Museum Digital Gamelan Jawa Tengah.",
};

export default function TentangPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-12">
      {/* Header Halaman Tentang */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-arang border border-perunggu/40 text-emas text-xs uppercase tracking-widest font-medium">
          <span>ꦗꦶꦫꦺꦴꦭꦸ</span>
          <span>•</span>
          <span>Tentang Museum</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-gading">
          Tentang Jirolu
        </h1>
        <p className="font-serif text-lg sm:text-xl text-emas italic">
          &ldquo;Museum gamelan yang bisa kamu mainkan.&rdquo;
        </p>
        <div className="w-20 h-0.5 bg-emas mx-auto rounded-full" />
      </div>

      {/* Bagian Asal-Usul Nama Jirolu */}
      <section className="bg-arang/80 border border-emas/40 rounded-2xl p-6 sm:p-8 space-y-3 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emas/20 border border-emas/50 flex items-center justify-center text-emas font-serif font-bold text-lg">
            ꦗꦶ
          </div>
          <h2 className="font-serif text-2xl font-bold text-gading">Makna Nama Jirolu</h2>
        </div>
        <p className="text-sm sm:text-base text-gading/85 leading-relaxed font-light">
          Nama <strong>Jirolu</strong> diambil dari tiga nada pertama dalam tangga nada gamelan Jawa, yaitu{" "}
          <strong className="text-emas">ji</strong> (nada 1), <strong className="text-emas">ro</strong> (nada 2), dan{" "}
          <strong className="text-emas">lu</strong> (nada 3). Ketiga nada dasar ini melambangkan langkah awal dalam belajar
          dan menghayati keindahan seni karawitan, di mana setiap orang memulai dari ketukan pertama yang sederhana sebelum
          menemukan keharmonisan dalam gending yang agung.
        </p>
      </section>

      {/* Bagian 1: Tujuan Jirolu */}
      <section className="bg-arang/80 border border-perunggu/30 rounded-2xl p-6 sm:p-8 space-y-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emas/15 border border-emas/40 flex items-center justify-center text-emas">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl font-bold text-gading">Tujuan Website</h2>
        </div>
        <div className="space-y-3 text-sm sm:text-base text-gading/80 leading-relaxed font-light">
          <p>
            Gamelan Jawa Tengah adalah salah satu mahakarya agung warisan dunia (UNESCO Intangible Cultural Heritage)
            yang menyimpan keindahan musikal sekaligus filsafat hidup luhur. Namun, akses terhadap perangkat fisik
            gamelan yang lengkap sering kali terbatas bagi generasi muda dan masyarakat luas.
          </p>
          <p>
            Jirolu hadir dengan visi:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2 text-gading/85">
            <li>
              <strong className="text-emas">Edukasi Terbuka:</strong> Mengenalkan nama, anatomi, laras (Pelog & Slendro), dan peran masing-masing instrumen (Saron, Bonang, Gong, Kendang) dalam format visual yang elegan.
            </li>
            <li>
              <strong className="text-emas">Interaktivitas Nyata:</strong> Memberikan pengalaman menabuh langsung instrumen gamelan melalui peramban web tanpa delay (Web Audio API murni).
            </li>
            <li>
              <strong className="text-emas">Penghayatan Filosofis:</strong> Membuka wawasan anak muda bahwa tiap ketukan bilah perunggu mengandung ajaran kesabaran, kerendahan hati, dan harmoni sosial.
            </li>
          </ul>
        </div>
      </section>

      {/* Bagian 2: Ucapan Terima Kasih */}
      <section className="bg-arang/80 border border-perunggu/30 rounded-2xl p-6 sm:p-8 space-y-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-perunggu/20 border border-perunggu/50 flex items-center justify-center text-emas">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl font-bold text-gading">Ucapan Terima Kasih</h2>
        </div>
        <p className="text-sm sm:text-base text-gading/80 leading-relaxed font-light">
          Apresiasi dan rasa hormat yang mendalam kami haturkan kepada:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-tinta/50 border border-perunggu/20 space-y-1">
            <h3 className="font-serif text-lg font-bold text-emas">Para Empu & Pengrajin Gamelan</h3>
            <p className="text-xs text-gading/70 leading-relaxed">
              Pusat kerajinan gamelan Besalen di Wirun Sukoharjo dan Klaten yang terus melestarikan teknik pengecoran perunggu leluhur.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-tinta/50 border border-perunggu/20 space-y-1">
            <h3 className="font-serif text-lg font-bold text-emas">Institusi Karawitan & Seniman</h3>
            <p className="text-xs text-gading/70 leading-relaxed">
              Institut Seni Indonesia (ISI) Surakarta, ISI Yogyakarta, dan para abdi dalem pengrawit Kraton Surakarta & Mangkunegaran.
            </p>
          </div>
        </div>
      </section>

      {/* Bagian 3: Sumber & Lisensi Aset */}
      <section className="bg-arang/80 border border-perunggu/30 rounded-2xl p-6 sm:p-8 space-y-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emas/15 border border-emas/40 flex items-center justify-center text-emas">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="font-serif text-2xl font-bold text-gading">Sumber & Lisensi</h2>
        </div>
        <div className="space-y-3 text-sm text-gading/80 leading-relaxed">
          <div className="p-4 rounded-xl bg-tinta/60 border border-perunggu/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gading">Audio Sampel Gamelan</span>
              <span className="text-xs text-emas bg-arang px-2 py-0.5 rounded border border-perunggu/30">Web Audio API / Domain Publik</span>
            </div>
            <p className="text-xs text-gading/65">
              Format audio didesain untuk file terkompresi berkualitas tinggi <code className="text-emas">.webm</code> dengan latensi 0 ms. Jirolu dilengkapi synthesizer perunggu dan membran drum otomatis bila rekaman offline belum dimuat.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-tinta/60 border border-perunggu/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gading">Dokumentasi Visual & Tipografi</span>
              <span className="text-xs text-emas bg-arang px-2 py-0.5 rounded border border-perunggu/30">Lisensi Terbuka / OFL</span>
            </div>
            <p className="text-xs text-gading/65">
              Tipografi judul menggunakan <strong>Cormorant Garamond</strong> karya Christian Thalmann dan teks menggunakan <strong>Inter</strong> karya Rasmus Andersson di bawah Lisensi SIL Open Font.
            </p>
          </div>
        </div>
      </section>

      {/* Tautan Kembali */}
      <div className="text-center pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emas text-tinta font-semibold text-sm hover:bg-emas-muda transition-all shadow-[0_0_20px_rgba(212,175,55,0.25)] min-h-[44px]"
        >
          ← Kembali ke Beranda Jirolu
        </Link>
      </div>
    </div>
  );
}
