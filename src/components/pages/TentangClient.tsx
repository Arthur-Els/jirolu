"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { HeroVideoBackground } from "@/components/ui/HeroVideoBackground";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

const YOUTUBE_EXAMPLE_LINKS = [
  { label: "Bonang", href: "https://www.youtube.com/watch?v=lvlemJk0SxQ" },
  { label: "Saron", href: "https://www.youtube.com/watch?v=PRUnAA8gxK8" },
  { label: "Kendang", href: "https://www.youtube.com/watch?v=OM347CwgNTE" },
  { label: "Gong", href: "https://www.youtube.com/watch?v=iut_hK_Xdlg" },
] as const;

const externalLinkClassName =
  "text-accent hover:text-accent-2 underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2";

export const TentangClient: React.FC = () => {
  const { locale } = useLanguage();
  const isEn = locale === "en";

  return (
    <div className="relative w-full min-h-dvh bg-paper text-ink">
      {/* Background Video Fixed */}
      <HeroVideoBackground src="/background/bg-home.mp4" isFixed={true} />

      <main className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-24 space-y-24 sm:space-y-32">
        {/* 1. HERO EDITORIAL SPLIT: Judul & Foto Panggung Pendopo */}
        <header className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-ink tracking-tight">
              {isEn ? "About Jirolu" : "Tentang Jirolu"}
            </h1>
            <p className="font-serif text-lg sm:text-xl text-accent italic leading-snug">
              {isEn
                ? "A gamelan museum you can play."
                : "Museum gamelan yang bisa kamu mainkan."}
            </p>
            <p className="font-sans text-base sm:text-lg text-ink-2 leading-relaxed max-w-xl">
              {isEn
                ? "Discover the sounds of Javanese gamelan, learn its rhythms, and play directly from your browser."
                : "Kenali suara gamelan Jawa, pelajari ketukannya, dan mainkan langsung dari browsermu."}
            </p>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[16/10] w-full rounded-3xl overflow-hidden border border-rule bg-paper-2 shadow-card">
              <Image
                src="/background/stage-bg.jpg"
                alt={
                  isEn
                    ? "Javanese gamelan stage arrangement in a pendopo pavilion"
                    : "Susunan panggung gamelan Jawa di pendopo"
                }
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-paper/75 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-xs text-ink-2">
                <span>{isEn ? "Gamelan Stage" : "Panggung Gamelan"}</span>
                <span className="text-accent">
                  {isEn ? "Central Java" : "Jawa Tengah"}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* 2. LATAR BELAKANG PEMBUATAN: Inset Foto Saron di Kiri, Cerita di Kanan */}
        <section className="bg-paper-2 border border-rule rounded-3xl p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] w-full max-w-[400px] mx-auto rounded-2xl overflow-hidden border border-rule bg-paper-3">
              <Image
                src="/images/instrumen/saron.jpg"
                alt={
                  isEn
                    ? "Bronze keys of the Javanese gamelan Saron instrument"
                    : "Bilah perunggu instrumen Saron gamelan Jawa"
                }
                fill
                sizes="(max-width: 1024px) 100vw, 35vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-paper/80 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2 border-b border-rule pb-5">
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-ink leading-tight">
                {isEn ? "Why This Website Was Created" : "Mengapa Web Ini Dibuat"}
              </h2>
              <p className="font-sans text-sm text-accent">
                {isEn
                  ? "Bringing gamelan closer to everyday life"
                  : "Membawa gamelan lebih dekat ke keseharian kita"}
              </p>
            </div>

            <div className="space-y-4 font-sans text-base text-ink-2 leading-relaxed">
              <p>
                {isEn
                  ? "Javanese gamelan is a rich cultural heritage, yet an authentic ensemble is not easy to encounter every day. Its instruments are large, require specialized care, and are usually found only in cultural studios or traditional pendopo pavilions."
                  : "Gamelan Jawa adalah warisan budaya yang kaya, tapi perangkat aslinya tidak mudah ditemui sehari-hari. Ukurannya besar, perawatannya khusus, dan biasanya hanya ada di sanggar atau pendopo."}
              </p>
              <blockquote className="border-l-2 border-accent pl-5 py-1 font-serif text-lg text-ink italic">
                {isEn
                  ? "“Simply open your browser, listen to the tones, and strike them yourself right from your screen.”"
                  : "“Cukup buka browser, dengar bunyinya, dan tabuh sendiri langsung dari layar.”"}
              </blockquote>
              <p>
                {isEn ? (
                  <>
                    That is how <strong>Jirolu</strong> came to be. We wanted
                    anyone to be able to try playing the saron, bonang, gong,
                    and kendang without needing physical instruments first.
                  </>
                ) : (
                  <>
                    Dari situ <strong>Jirolu</strong> dibuat. Kami ingin siapa
                    saja bisa mencoba menabuh saron, bonang, gong, dan kendang
                    tanpa harus punya alat fisiknya terlebih dulu.
                  </>
                )}
              </p>
            </div>
          </div>
        </section>

        {/* 3. MAKNA NAMA: 3 Pilar Monumental dengan Aksen Aksara Jawa */}
        <section className="space-y-10">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-ink tracking-tight">
              {isEn
                ? "The Meaning Behind the Name Jirolu"
                : "Makna di Balik Nama Jirolu"}
            </h2>
            <div className="w-[25%] h-0.5 bg-accent mx-auto rounded-full my-3" />
            <p className="font-sans text-sm sm:text-base text-ink-2 leading-relaxed max-w-2xl mx-auto font-light">
              {isEn
                ? "Inspired by the Javanese Ji-Ro-Lu counting of the first three gamelan notes: ji, ro, and lu."
                : "Diambil dari hitungan tiga nada pertama gamelan: ji, ro, dan lu."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-paper/40 backdrop-blur-md border border-rule rounded-2xl p-8 space-y-4">
              <div className="flex items-baseline justify-between border-b border-rule pb-4">
                <span className="font-serif text-5xl text-accent font-normal">
                  1
                </span>
                <span className="font-serif text-2xl text-ink">Ji (Siji)</span>
              </div>
              <p className="font-sans text-sm text-ink-2 leading-relaxed">
                {isEn
                  ? "Siji (one) — the first note. The starting point for learning to recognize each instrument’s tonal character."
                  : "Nada pertama. Awal mula belajar mengenal karakter bunyi tiap instrumen."}
              </p>
            </div>

            <div className="bg-paper/40 backdrop-blur-md border border-rule rounded-2xl p-8 space-y-4">
              <div className="flex items-baseline justify-between border-b border-rule pb-4">
                <span className="font-serif text-5xl text-accent font-normal">
                  2
                </span>
                <span className="font-serif text-2xl text-ink">Ro (Loro)</span>
              </div>
              <p className="font-sans text-sm text-ink-2 leading-relaxed">
                {isEn
                  ? "Loro (two) — the second note. Beginning to connect melodic phrases and keep a steady beat."
                  : "Nada kedua. Mulai menyambung irama dan belajar menjaga ketukan."}
              </p>
            </div>

            <div className="bg-paper/40 backdrop-blur-md border border-rule rounded-2xl p-8 space-y-4">
              <div className="flex items-baseline justify-between border-b border-rule pb-4">
                <span className="font-serif text-5xl text-accent font-normal">
                  3
                </span>
                <span className="font-serif text-2xl text-ink">Lu (Telu)</span>
              </div>
              <p className="font-sans text-sm text-ink-2 leading-relaxed">
                {isEn
                  ? "Telu (three) — the third note. Melodic patterns start taking shape until you are ready to play a full piece."
                  : "Nada ketiga. Pola melodi mulai terbentuk hingga siap memainkan lagu utuh."}
              </p>
            </div>
          </div>
        </section>

        {/* 5. SUMBER AUDIO & LISENSI: Inset Foto Gong + Detail Atribusi Freesound */}
        <section className="bg-paper-2 border border-rule rounded-3xl p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-12 space-y-6">
            <div className="space-y-3">
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight">
                {isEn ? "Audio Sources & Licensing" : "Sumber Audio & Lisensi"}
              </h2>
              <div className="w-16 h-0.5 bg-accent rounded-full" />
              <p className="font-sans text-sm sm:text-base text-ink-2 leading-relaxed">
                {isEn
                  ? "The gamelan sound recordings in Jirolu are sourced from open audio collections on "
                  : "Rekaman suara gamelan di Jirolu diambil dari koleksi audio terbuka di "}
                <a
                  href="https://freesound.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={externalLinkClassName}
                >
                  Freesound.org
                </a>
                <br />
                {isEn
                  ? "Instrument performance audio examples are sourced from YouTube: "
                  : "Audio contoh permainan alat musik diambil dari YouTube: "}
                {YOUTUBE_EXAMPLE_LINKS.map((item, idx) => (
                  <React.Fragment key={item.label}>
                    {idx > 0 &&
                      (idx === YOUTUBE_EXAMPLE_LINKS.length - 1
                        ? isEn
                          ? ", and "
                          : ", dan "
                        : ", ")}
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={externalLinkClassName}
                    >
                      {item.label}
                    </a>
                  </React.Fragment>
                ))}
              </p>
            </div>

            <div className="divide-y divide-rule border-y border-rule font-sans text-sm">
              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-muted">
                  {isEn ? "Recording source" : "Sumber rekaman"}
                </span>
                <span className="text-ink font-medium text-right">
                  Freesound.org
                </span>
              </div>
              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-muted">
                  {isEn ? "License" : "Lisensi"}
                </span>
                <span className="text-ink font-medium text-right">
                  Creative Commons (CC0 &amp; CC-BY)
                </span>
              </div>
              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-muted">
                  {isEn ? "Audio engine" : "Pemutar audio"}
                </span>
                <span className="text-ink font-medium text-right">
                  Web Audio API
                </span>
              </div>
              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-muted">
                  {isEn ? "File formats" : "Format berkas"}
                </span>
                <span className="text-ink font-medium text-right">
                  .WAV .webm .m4a
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 6. PENUTUP: Balanced Action Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/instrumen/saron"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-accent hover:bg-accent-2 text-accent-ink font-semibold text-[15px] motion-safe:transition-colors duration-150 flex items-center justify-center min-h-[48px] focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 motion-safe:active:scale-95"
          >
            {isEn ? "Start Playing Saron" : "Mulai Mainkan Saron"}
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-paper-2 hover:bg-paper-3 text-ink border border-rule font-medium text-[15px] motion-safe:transition-colors duration-150 flex items-center justify-center min-h-[48px] focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 motion-safe:active:scale-95"
          >
            {isEn ? "Back to Home" : "Kembali ke Beranda"}
          </Link>
        </div>
      </main>
    </div>
  );
};
