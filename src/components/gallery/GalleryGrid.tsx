"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Instrumen } from "@/types/instrumen";
import { playInstrumentPreview } from "@/lib/audio/audioEngine";

interface GalleryGridProps {
  instruments: Instrumen[];
}

// Data metadata penempatan spasial tiap instrumen di panggung Pendopo Karawitan
interface PosisiPanggungInfo {
  zona: string;
  peranSpasial: string;
  alasanPenempatan: string;
  posisiDesktopGrid: string;
  posisiLabel: string;
}

const METADATA_PANGGUNG: Record<string, PosisiPanggungInfo> = {
  gong: {
    zona: "Baris Belakang • Pusat Kosmik",
    peranSpasial: "Penutup Siklus & Pamungkas Gongan",
    alasanPenempatan:
      "Diletakkan paling belakang karena ukurannya yang agung dan rentang gelombang suaranya yang sangat dalam, membungkus seluruh getaran nada instrumen di depannya.",
    posisiDesktopGrid: "col-start-2 row-start-1",
    posisiLabel: "Belakang Tengah",
  },
  kendang: {
    zona: "Tengah Panggung • Pamurba Wirama",
    peranSpasial: "Konduktor Irama & Denyut Tempo",
    alasanPenempatan:
      "Berada tepat di titik pusat agar pengendang dapat mendengar seluruh kelompok instrumen dan memberi aba-aba pergantian tempo secara visual maupun audio ke seluruh pengrawit.",
    posisiDesktopGrid: "col-start-2 row-start-2",
    posisiLabel: "Pusat Panggung",
  },
  bonang: {
    zona: "Baris Depan Sisi Kiri • Pengembang Melodi",
    peranSpasial: "Pembuka Gending & Pola Jalinan Mipil",
    alasanPenempatan:
      "Ditempatkan di baris depan mendatar agar jalinan melodi lincah dari sepasang tabuh bindi terdengar jernih menyatu dengan kerangka dasar balungan.",
    posisiDesktopGrid: "col-start-1 row-start-2",
    posisiLabel: "Depan Kiri",
  },
  saron: {
    zona: "Baris Depan Sisi Kanan • Kerangka Melodi",
    peranSpasial: "Pembawa Kerangka Pokok (Balungan)",
    alasanPenempatan:
      "Berada sejajar di baris depan agar denting lugas bilah perunggu dapat disimak jelas oleh semua penabuh sebagai patokan harmoni lagu.",
    posisiDesktopGrid: "col-start-3 row-start-2",
    posisiLabel: "Depan Kanan",
  },
};

export const GalleryGrid: React.FC<GalleryGridProps> = ({ instruments }) => {
  // Instrumen aktif yang sedang dipilih di panggung (bawaan: Saron)
  const [selectedSlug, setSelectedSlug] = useState<string>("saron");
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);

  const selectedInstrument =
    instruments.find((item) => item.slug === selectedSlug) || instruments[0];

  const infoPanggung =
    METADATA_PANGGUNG[selectedInstrument.slug] || {
      zona: "Panggung Ansambel",
      peranSpasial: "Instrumen Karawitan",
      alasanPenempatan: selectedInstrument.fungsi,
      posisiDesktopGrid: "",
      posisiLabel: "Panggung Gamelan",
    };

  // Fungsi membunyikan cuplikan denting suara instrumen langsung di panggung
  const handlePlayPreview = (slug: string) => {
    setIsPlayingPreview(true);
    playInstrumentPreview(slug);
    setTimeout(() => setIsPlayingPreview(false), 600);
  };

  return (
    <section id="galeri" className="w-full py-16 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Galeri */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-arang border border-perunggu/30 text-emas text-xs uppercase tracking-widest font-medium">
            <span>ꦮꦶꦭꦸꦗꦼꦁꦫꦮꦸꦃ</span>
            <span>•</span>
            <span>Tata Ruang Ansambel Pendopo</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gading">
            Denah Panggung Karawitan
          </h2>
          <div className="w-20 h-0.5 bg-emas mx-auto rounded-full" />
          <p className="text-sm sm:text-base text-gading/75 leading-relaxed pt-1">
            Gamelan Jawa memiliki tata letak sakral di atas panggung pendopo. Ketuk salah satu
            posisi alat musik di denah panggung untuk menyingkap peran musikal dan mendengarkan
            denting suaranya.
          </p>
        </div>

        {/* 1. DENAH PANGGUNG PENDOPO INTERAKTIF (SPATIAL STAGE MAP) */}
        <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#25180f] via-[#1a110a] to-[#0f0905] border-2 border-perunggu/40 p-5 sm:p-8 md:p-10 shadow-2xl overflow-hidden">
          {/* Ornamen Motif Tikar / Lantai Pendopo Transparan */}
          <div className="absolute inset-0 bg-batik-pattern opacity-25 pointer-events-none" />

          {/* Garis Pembatas Panggung Depan & Belakang */}
          <div className="absolute top-1/2 left-4 right-4 h-px bg-gradient-to-r from-transparent via-perunggu/30 to-transparent pointer-events-none" />

          {/* Penanda Zona Visual */}
          <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-emas/60 pb-4 border-b border-perunggu/20 select-none">
            <span>← Sisi Kiri (Pengiring)</span>
            <span className="text-center text-emas font-serif font-bold tracking-wider">
              ✦ Area Panggung Kehormatan Pendopo ✦
            </span>
            <span>Sisi Kanan (Pengiring) →</span>
          </div>

          {/* Grid Tata Letak 4 Posisi Gamelan */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 py-6 items-center">
            {/* 1. Baris Belakang Tengah: GONG AGENG */}
            <div className="sm:col-start-2 sm:row-start-1 flex justify-center">
              {renderHotspotCard(
                instruments.find((i) => i.slug === "gong")!,
                selectedSlug === "gong",
                () => {
                  setSelectedSlug("gong");
                  handlePlayPreview("gong");
                }
              )}
            </div>

            {/* 2. Baris Depan Sisi Kiri: BONANG */}
            <div className="sm:col-start-1 sm:row-start-2 flex justify-center">
              {renderHotspotCard(
                instruments.find((i) => i.slug === "bonang")!,
                selectedSlug === "bonang",
                () => {
                  setSelectedSlug("bonang");
                  handlePlayPreview("bonang");
                }
              )}
            </div>

            {/* 3. Pusat Panggung (Tengah): KENDANG */}
            <div className="sm:col-start-2 sm:row-start-2 flex justify-center">
              {renderHotspotCard(
                instruments.find((i) => i.slug === "kendang")!,
                selectedSlug === "kendang",
                () => {
                  setSelectedSlug("kendang");
                  handlePlayPreview("kendang");
                }
              )}
            </div>

            {/* 4. Baris Depan Sisi Kanan: SARON */}
            <div className="sm:col-start-3 sm:row-start-2 flex justify-center">
              {renderHotspotCard(
                instruments.find((i) => i.slug === "saron")!,
                selectedSlug === "saron",
                () => {
                  setSelectedSlug("saron");
                  handlePlayPreview("saron");
                }
              )}
            </div>
          </div>

          {/* Petunjuk Interaksi Bawah Panggung */}
          <div className="text-center pt-2 text-xs text-gading/50 select-none">
            <span>
              Ketuk podium posisi di atas untuk menyorot alat musik terpilih di bawah ↓
            </span>
          </div>
        </div>

        {/* 2. PANEL DETAIL EKSBISI TERPILIH (STAGE SPOTLIGHT SHOWCASE) */}
        <div className="w-full bg-arang/95 border-2 border-emas/40 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-md transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Kolom Kiri: Visual Gambar Beresolusi Tinggi */}
            <div className="lg:col-span-5 relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-perunggu/50 shadow-2xl bg-tinta">
              <Image
                src={selectedInstrument.gambar}
                alt={`Alat musik gamelan ${selectedInstrument.nama}`}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-tinta/90 via-transparent to-transparent" />

              {/* Badge Posisi Spasial */}
              <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-tinta/85 border border-emas/50 backdrop-blur-sm">
                <span className="text-xs font-semibold text-emas">
                  {infoPanggung.posisiLabel}
                </span>
              </div>

              {/* Aksara Jawa Timbul */}
              {selectedInstrument.namaJawa && (
                <div className="absolute bottom-4 left-4 px-3 py-1 rounded-lg bg-arang/90 border border-perunggu/40 backdrop-blur-sm">
                  <span className="text-emas font-serif text-lg tracking-wider">
                    {selectedInstrument.namaJawa}
                  </span>
                </div>
              )}
            </div>

            {/* Kolom Kanan: Narasi Kurasi & Aksi Suara */}
            <div className="lg:col-span-7 space-y-5">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-tinta border border-perunggu/35 text-[11px] text-emas-muda font-mono">
                  <span>{infoPanggung.zona}</span>
                </div>
                <h3 className="font-serif text-3xl sm:text-4xl font-bold text-gading">
                  {selectedInstrument.nama}
                </h3>
                <p className="font-serif text-base sm:text-lg text-emas italic">
                  &ldquo;{infoPanggung.peranSpasial}&rdquo;
                </p>
              </div>

              {/* Penjelasan Mengapa Berada di Posisi Ini */}
              <div className="p-4 rounded-xl bg-tinta/60 border border-perunggu/25 space-y-1">
                <span className="text-xs uppercase tracking-wider text-emas font-semibold">
                  Alasan Penempatan di Panggung:
                </span>
                <p className="text-xs sm:text-sm text-gading/80 leading-relaxed font-light">
                  {infoPanggung.alasanPenempatan}
                </p>
              </div>

              {/* Deskripsi Singkat */}
              <p className="text-xs sm:text-sm text-gading/70 leading-relaxed">
                {selectedInstrument.deskripsiSingkat}
              </p>

              {/* Tombol Aksi: Uji Suara Cepat & Buka Soundboard Penuh */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                {/* Tombol Uji Denting Suara Instan */}
                <button
                  type="button"
                  onClick={() => handlePlayPreview(selectedInstrument.slug)}
                  aria-label={`Dengarkan cuplikan suara ${selectedInstrument.nama}`}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-tinta border border-perunggu/40 text-gading hover:text-emas hover:border-emas text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 min-h-[44px] cursor-pointer shadow-md"
                >
                  <svg
                    className={`w-4 h-4 text-emas ${
                      isPlayingPreview ? "animate-spin" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                    />
                  </svg>
                  <span>Coba Bunyikan Suara</span>
                </button>

                {/* Tombol Menuju Soundboard Penuh */}
                <Link
                  href={`/instrumen/${selectedInstrument.slug}`}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emas text-tinta font-semibold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:shadow-[0_0_25px_rgba(212,175,55,0.55)] hover:bg-emas-muda transition-all flex items-center justify-center gap-2 min-h-[44px]"
                >
                  <span>Buka Soundboard & Filosofi</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * Render satu kartu podium interaktif di atas denah panggung
 */
function renderHotspotCard(
  instrumen: Instrumen,
  isActive: boolean,
  onSelect: () => void
) {
  if (!instrumen) return null;
  const meta = METADATA_PANGGUNG[instrumen.slug];

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={`Pilih ${instrumen.nama} di ${meta?.posisiLabel || "panggung"}`}
      className={`group w-full max-w-[240px] p-3 rounded-2xl transition-all duration-200 cursor-pointer text-left flex items-center gap-3 min-h-[64px] border ${
        isActive
          ? "bg-arang border-emas shadow-[0_0_25px_rgba(212,175,55,0.4)] scale-105"
          : "bg-tinta/80 border-perunggu/30 hover:border-emas/60 hover:bg-arang/80"
      }`}
    >
      {/* Thumbnail Gambar Alat */}
      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-perunggu/40 bg-tinta">
        <Image
          src={instrumen.gambar}
          alt={instrumen.nama}
          fill
          sizes="48px"
          className="object-cover"
        />
        {isActive && (
          <div className="absolute inset-0 bg-emas/20 animate-pulse pointer-events-none" />
        )}
      </div>

      {/* Info Teks Podium */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-serif text-sm sm:text-base font-bold truncate transition-colors ${
              isActive ? "text-emas" : "text-gading group-hover:text-emas"
            }`}
          >
            {instrumen.nama}
          </span>
          {instrumen.namaJawa && (
            <span className="text-[10px] text-perunggu font-serif">
              {instrumen.namaJawa}
            </span>
          )}
        </div>
        <span className="text-[10px] text-gading/50 truncate">
          {meta?.posisiLabel || "Panggung"}
        </span>
      </div>
    </button>
  );
}
