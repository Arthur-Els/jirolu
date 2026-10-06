import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  getAllInstruments,
  getInstrumentBySlug,
  getNextInstrument,
  getSongsByInstrument,
} from "@/lib/content";
import { InfoPanel } from "@/components/instrument/InfoPanel";
import { Soundboard } from "@/components/soundboard/Soundboard";
import { OtherInstruments } from "@/components/instrument/OtherInstruments";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const instruments = getAllInstruments();
  return instruments.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const instrumen = getInstrumentBySlug(slug);

  if (!instrumen) {
    return {
      title: "Instrumen Tidak Ditemukan | Jirolu",
    };
  }

  return {
    title: `${instrumen.nama} - Jirolu`,
    description: `${instrumen.deskripsiSingkat} Mainkan ${instrumen.nama} secara virtual di Jirolu tanpa delay dan pelajari filosofinya.`,
    openGraph: {
      title: `${instrumen.nama} | Jirolu`,
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

  const allInstruments = getAllInstruments();
  const nextInstrument = getNextInstrument(slug);
  const availableSongs = getSongsByInstrument(slug);

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

      {/* Bagian 1: Soundboard Interaktif dengan Mode Belajar & Rekaman */}
      <section aria-label={`Soundboard Virtual ${instrumen.nama}`} className="space-y-4">
        <Soundboard instrumen={instrumen} availableSongs={availableSongs} />
      </section>

      {/* Bagian 2: Panel Penjelasan Fungsi & Cerita Filosofi */}
      <section aria-label={`Informasi dan Filosofi ${instrumen.nama}`}>
        <InfoPanel instrumen={instrumen} />
      </section>

      {/* Bagian 3: Alat Musik Lainnya (Fitur Rekomendasi Koleksi) */}
      <OtherInstruments
        currentSlug={instrumen.slug}
        allInstruments={allInstruments}
      />

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
