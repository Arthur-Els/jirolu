import React from "react";
import Link from "next/link";
import { getAllInstruments } from "@/lib/content";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { HeroVideoBackground } from "@/components/ui/HeroVideoBackground";
import { FeaturesShowcase } from "@/components/home/FeaturesShowcase";
import { HeroWayangSilhouettes } from "@/components/ui/HeroWayangSilhouettes";

export default function HomePage() {
  const instruments = getAllInstruments();

  return (
    <div className="relative w-full min-h-dvh bg-paper text-ink">
      {/* Background Video Fixed */}
      <HeroVideoBackground src="/background/bg-home.mp4" isFixed={true} />

      {/* Seluruh Konten Halaman Beranda */}
      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Area Batas Gerak Wayang (Bagian Pembuka s.d. Batas Atas Denah Panggung) */}
        <div className="relative w-full overflow-hidden">
          {/* Siluet Wayang Kulit Intro (di desktop dapat digeser bebas di area ini) */}
          <HeroWayangSilhouettes />

          {/* Bagian Pembuka (Hero Section) */}
          <section className="relative z-10 w-full min-h-dvh flex flex-col items-center justify-center px-4 sm:px-6 pt-[120px] pb-20 pointer-events-none">
            {/* Hero Content */}
            <div className="relative max-w-3xl mx-auto text-center flex flex-col items-center z-10 w-full pointer-events-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-emas text-lg font-mono font-medium mb-1">
                <span>ꦱꦸꦒꦼꦁꦫꦮꦸꦃ</span>
              </div>
              <h1 className="text-[clamp(2.5rem,5.5vw,4.5rem)] leading-[1.08] text-ink text-center mb-6 tracking-tight font-serif font-normal">
                Mainkan gamelan Jawa dari layarmu.
              </h1>

              <p className="text-[17px] sm:text-[19px] leading-[1.55] text-ink-2 text-center max-w-xl mb-10 font-sans">
                Eksplorasi gamelan Jawa secara langsung. Dengarkan suaranya, pelajari ketukannya, dan mainkan sendiri.
              </p>

              {/* CTA Group */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
                <Link
                  id="btn-primary"
                  href="/instrumen/saron"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-accent hover:bg-accent-2 text-accent-ink font-semibold text-[15px] motion-safe:transition-colors duration-150 flex items-center justify-center min-h-[48px] focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 motion-safe:active:scale-95"
                >
                  Mulai Bermain
                </Link>
                <a
                  id="btn-secondary"
                  href="#galeri"
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-paper-2 hover:bg-paper-3 text-ink border border-rule font-medium text-[15px] motion-safe:transition-colors duration-150 flex items-center justify-center min-h-[48px] focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 motion-safe:active:scale-95"
                >
                  Jelajahi Instrumen
                </a>
              </div>
            </div>
          </section>

          {/* Bagian: Fitur Utama (Features Showcase) */}
          <FeaturesShowcase />
        </div>

        {/* Bagian Galeri Koleksi Pameran (Tampilan Rombak Total Bersih & Nyaman) */}
        <div id="koleksi-alat" className="scroll-mt-20" />
        <GalleryGrid instruments={instruments} />

        {/* Bagian Sekilas Filosofi Karawitan */}
        <section className="relative w-full py-24 sm:py-32 px-4 sm:px-6 bg-paper-2 border-t border-rule overflow-hidden">
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-4">
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-ink tracking-tight">
              Tentang Jirolu
            </h2>
            <div className="w-[25%] h-0.5 bg-accent mx-auto rounded-full my-3" />
            <p className="text-sm sm:text-base text-ink-2 leading-relaxed max-w-2xl mx-auto font-light">
              Nama <strong>Jirolu</strong> diambil dari hitungan dasar tabuhan gamelan: <strong>ji (1), ro (2), dan lu (3)</strong>. Kami membangun ruang digital ini agar siapa pun dapat dengan mudah bersentuhan dengan musik gamelan Jawa langsung dari peramban.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
