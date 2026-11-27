import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getAllInstruments,
  getInstrumentBySlug,
  getNextInstrument,
  getSongsByInstrument,
} from "@/lib/content";
import { InstrumentDetailClient } from "@/components/instrument/InstrumentDetailClient";

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
    <InstrumentDetailClient
      instrumen={instrumen}
      nextInstrumen={nextInstrument}
      otherInstruments={allInstruments}
      songs={availableSongs}
    />
  );
}
