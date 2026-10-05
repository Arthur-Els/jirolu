import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getAllInstruments, getInstrumentBySlug, getNextInstrument } from "@/lib/content";
import { InfoPanel } from "@/components/instrument/InfoPanel";
import { Soundboard } from "@/components/soundboard/Soundboard";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * Wajib untuk Next.js dengan mode static export (output: 'export').
 * Menghasilkan daftar seluruh halaman instrumen saat build time.
 */
export async function generateStaticParams() {
  const instruments = getAllInstruments();
  return instruments.map((item) => ({
    slug: item.slug,
  }));
}

/**
 * Menghasilkan metadata SEO unik untuk masing-masing halaman instrumen
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const instrumen = getInstrumentBySlug(slug);

  if (!instrumen) {
    return {
      title: "Instrumen Tidak Ditemukan | Museum Gamelan Jawa",
    };
  }

  return {
    title: `${instrumen.nama} - Museum Digital Gamelan Jawa Tengah`,
    description: `${instrumen.deskripsiSingkat} Pelajari fungsi dan filosofi, serta mainkan soundboard virtualnya.`,
    openGraph: {
      title: `${instrumen.nama} | Museum Digital Gamelan Jawa Tengah`,
      description: instrumen.deskripsiSingkat,
      images: [instrumen.gambar],
    },
  };
}

export default async function InstrumentDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const instrumen = getInstrumentBySlug(slug);

  if (!instrumen) {
    notFound();
  }

  const nextInstrument = getNextInstrument(slug);
  const isPlayable = instrumen.tersediaDiFase === 1;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-16 space-y-12">
      {/* Bar Navigasi Atas Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-perunggu/25">
        <Link
          href="/#galeri"
          className="inline-flex items-center gap-2 text-sm text-gading/70 hover:text-emas transition-colors min-h-[44px]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Kembali ke Galeri Pameran</span>
        </Link>

        {/* Tautan Alat Musik Berikutnya */}
        <Link
          href={`/instrumen/${nextInstrument.slug}`}
          className="inline-flex items-center gap-2 text-sm text-emas hover:text-emas-muda transition-colors group min-h-[44px]"
        >
          <span>Alat Musik Selanjutnya: <strong>{nextInstrument.nama}</strong></span>
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Bagian 1: Soundboard Interaktif (Diutamakan untuk Saron pada Fase 1) */}
      {isPlayable ? (
        <section aria-label={`Soundboard Virtual ${instrumen.nama}`} className="space-y-4">
          <Soundboard instrumen={instrumen} />
        </section>
      ) : (
        <section className="p-8 rounded-2xl bg-arang border border-perunggu/30 text-center space-y-4 shadow-xl">
          <div className="inline-flex p-3 rounded-full bg-tinta border border-emas/40 text-emas">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="space-y-2 max-w-lg mx-auto">
            <h3 className="font-serif text-2xl font-bold text-gading">
              Soundboard {instrumen.nama} (Dipersiapkan untuk Fase 2)
            </h3>
            <p className="text-sm text-gading/70 leading-relaxed">
              Saat ini di Fase 1, Soundboard Virtual yang aktif penuh adalah <strong>Saron (Laras Pelog)</strong>.
              Soundboard untuk {instrumen.nama} akan segera diaktifkan pada pengembangan Fase 2 berikutnya.
            </p>
          </div>
          <div className="pt-2">
            <Link
              href="/instrumen/saron"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emas text-tinta font-semibold text-sm shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:bg-emas-muda transition-all"
            >
              Coba Mainkan Saron Virtual
            </Link>
          </div>
        </section>
      )}

      {/* Bagian 2: Panel Penjelasan Fungsi & Cerita Filosofi */}
      <section aria-label={`Informasi dan Filosofi ${instrumen.nama}`}>
        <InfoPanel instrumen={instrumen} />
      </section>

      {/* Bar Navigasi Bawah */}
      <div className="pt-6 border-t border-perunggu/25 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/#galeri"
          className="text-sm text-gading/70 hover:text-emas transition-colors"
        >
          ← Kembali ke Galeri
        </Link>
        <Link
          href={`/instrumen/${nextInstrument.slug}`}
          className="text-sm text-emas hover:text-emas-muda font-semibold transition-colors"
        >
          Lanjut ke {nextInstrument.nama} →
        </Link>
      </div>
    </div>
  );
}
