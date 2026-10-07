"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Instrumen } from "@/types/instrumen";
import {
  playInstrumentPreview,
  playInstrumentMelodySample,
} from "@/lib/audio/audioEngine";

interface GalleryGridProps {
  instruments: Instrumen[];
}

// Data metadata penempatan spasial tiap instrumen di panggung Pendopo Karawitan
interface PosisiPanggungInfo {
  zona: string;
  peranSpasial: string;
  alasanPenempatan: string;
  posisiLabel: string;
  gridArea: string;
}

const METADATA_PANGGUNG: Record<string, PosisiPanggungInfo> = {
  gong: {
    zona: "Baris Belakang • Pusat Kosmik",
    peranSpasial: "Penutup Siklus & Pamungkas Gongan",
    alasanPenempatan:
      "Diletakkan paling belakang karena ukurannya yang agung dan rentang gelombang suaranya yang sangat dalam, membungkus seluruh getaran nada instrumen di depannya.",
    posisiLabel: "Belakang Tengah",
    gridArea: "sm:col-start-2 sm:row-start-1",
  },
  kendang: {
    zona: "Tengah Panggung • Pamurba Wirama",
    peranSpasial: "Konduktor Irama & Denyut Tempo",
    alasanPenempatan:
      "Berada tepat di titik pusat agar pengendang dapat mendengar seluruh kelompok instrumen dan memberi aba-aba pergantian tempo secara visual maupun audio ke seluruh pengrawit.",
    posisiLabel: "Pusat Panggung",
    gridArea: "sm:col-start-2 sm:row-start-2",
  },
  bonang: {
    zona: "Baris Depan Sisi Kiri • Pengembang Melodi",
    peranSpasial: "Pembuka Gending & Pola Jalinan Mipil",
    alasanPenempatan:
      "Ditempatkan di baris depan mendatar agar jalinan melodi lincah dari sepasang tabuh bindi terdengar jernih menyatu dengan kerangka dasar balungan.",
    posisiLabel: "Depan Kiri",
    gridArea: "sm:col-start-1 sm:row-start-2",
  },
  saron: {
    zona: "Baris Depan Sisi Kanan • Kerangka Melodi",
    peranSpasial: "Pembawa Kerangka Pokok (Balungan)",
    alasanPenempatan:
      "Berada sejajar di baris depan agar denting lugas bilah perunggu dapat disimak jelas oleh semua penabuh sebagai patokan harmoni lagu.",
    posisiLabel: "Depan Kanan",
    gridArea: "sm:col-start-3 sm:row-start-2",
  },
};

export const GalleryGrid: React.FC<GalleryGridProps> = ({ instruments }) => {
  // Instrumen aktif yang sedang disorot di panggung (bawaan: Saron)
  const [selectedSlug, setSelectedSlug] = useState<string>("saron");
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  // State audio player contoh lagu
  const [isPlayingSong, setIsPlayingSong] = useState<boolean>(false);
  const [songNotice, setSongNotice] = useState<string | null>(null);
  const audioSongRef = useRef<HTMLAudioElement | null>(null);

  const selectedInstrument =
    instruments.find((item) => item.slug === selectedSlug) || instruments[0];

  const infoPanggung =
    METADATA_PANGGUNG[selectedInstrument.slug] || {
      zona: "Panggung Ansambel",
      peranSpasial: "Instrumen Karawitan",
      alasanPenempatan: selectedInstrument.fungsi,
      posisiLabel: "Panggung Gamelan",
      gridArea: "",
    };

  // Hentikan audio lagu saat instrumen berganti
  useEffect(() => {
    if (audioSongRef.current) {
      audioSongRef.current.pause();
      audioSongRef.current.currentTime = 0;
    }
    setIsPlayingSong(false);
    setSongNotice(null);
  }, [selectedSlug]);

  // Fungsi saat memilih alat musik di denah panggung
  const handleSelectInstrument = (slug: string) => {
    setSelectedSlug(slug);
    playInstrumentPreview(slug);
  };

  // Fungsi toggle pemutar contoh permainan lagu
  const handleToggleSongAudio = () => {
    if (isPlayingSong) {
      if (audioSongRef.current) {
        audioSongRef.current.pause();
      }
      setIsPlayingSong(false);
      return;
    }

    const audioUrl = `/audio/sampel/${selectedInstrument.slug}-lagu.mp3`;
    const audio = new Audio(audioUrl);
    audioSongRef.current = audio;

    audio.onended = () => {
      setIsPlayingSong(false);
    };

    audio.onerror = () => {
      // Jika file mp3 belum diunggah oleh pengguna, putar simulasi frasa melodi
      setIsPlayingSong(true);
      setSongNotice(
        `File "${selectedInstrument.slug}-lagu.mp3" belum tersedia di /public/audio/sampel/. Memainkan simulasi melodi karawitan.`
      );
      playInstrumentMelodySample(selectedInstrument.slug, () => {
        setIsPlayingSong(false);
      });
      setTimeout(() => setSongNotice(null), 7000);
    };

    audio
      .play()
      .then(() => {
        setIsPlayingSong(true);
        setSongNotice(null);
      })
      .catch((_err) => {
        setIsPlayingSong(true);
        setSongNotice(
          `File audio di /public/audio/sampel/${selectedInstrument.slug}-lagu.mp3 belum tersedia. Memainkan simulasi melodi karawitan.`
        );
        playInstrumentMelodySample(selectedInstrument.slug, () => {
          setIsPlayingSong(false);
        });
        setTimeout(() => setSongNotice(null), 7000);
      });
  };

  return (
    <section id="galeri" className="w-full py-16 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Header Galeri */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-emas text-xs uppercase tracking-widest font-medium">
            <span>ꦮꦶꦭꦸꦗꦼꦁꦫꦮꦸꦃ</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gading">
            Denah Panggung Karawitan
          </h2>
          <div className="w-1/2 h-0.25 bg-emas mx-auto rounded-full" />
          <p className="text-sm sm:text-base text-gading/75 leading-relaxed pt-1">
            Lihat tata ruang gamelan Jawa dari sudut pandang atas pendopo. Sentuh atau arahkan kursor ke alat musik di atas panggung untuk menyingkap peran musikal dan mendengarkan alunan permainannya.
          </p>
        </div>

        {/* 1. ARENA PANGGUNG PENDOPO TAMPANG ATAS (OVERHEAD STAGE CANVAS) */}
        <div className="relative w-full rounded-3xl bg-gradient-to-b from-[#24170e] via-[#180f08] to-[#0c0704] border-2 border-emas/40 p-5 sm:p-8 md:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.8)] overflow-hidden">
          {/* Latar Belakang Tekstur Tikar Anyaman & Lantai Kayu Jati */}
          <div className="absolute inset-0 bg-batik-pattern opacity-25 pointer-events-none" />

          {/* Pencahayaan Lembut dari Langit-Langit Pendopo */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at 50% 20%, rgba(212,175,55,0.18) 0%, rgba(11,10,9,0) 70%)",
            }}
          />

          {/* 4 Penanda Umpak Tiang Joglo (Saka Guru) di 4 Sudut Panggung */}
          <div className="absolute top-4 left-4 w-7 h-7 rounded-lg border border-emas/30 bg-tinta/80 flex items-center justify-center text-[10px] text-emas font-serif select-none pointer-events-none">
            ꦱ
          </div>
          <div className="absolute top-4 right-4 w-7 h-7 rounded-lg border border-emas/30 bg-tinta/80 flex items-center justify-center text-[10px] text-emas font-serif select-none pointer-events-none">
            ꦏ
          </div>
          <div className="absolute bottom-4 left-4 w-7 h-7 rounded-lg border border-emas/30 bg-tinta/80 flex items-center justify-center text-[10px] text-emas font-serif select-none pointer-events-none">
            ꦒꦸ
          </div>
          <div className="absolute bottom-4 right-4 w-7 h-7 rounded-lg border border-emas/30 bg-tinta/80 flex items-center justify-center text-[10px] text-emas font-serif select-none pointer-events-none">
            ꦫꦸ
          </div>

          {/* Penanda Zona Visual Panggung */}
          <div className="relative z-10 flex items-center justify-center text-[11px] font-mono uppercase tracking-widest text-emas/65 pb-4 border-b border-perunggu/25 select-none">
            <span className="text-center text-emas font-serif font-bold tracking-wider text-xs sm:text-sm">
              Panggung Kehormatan Pendopo (Tampak Atas)
            </span>
          </div>

          {/* Panduan Arah Panggung */}
          <div className="text-center pt-2 pb-4 text-[10px] sm:text-xs text-gading/40 font-mono select-none tracking-widest">
            ▲ BARIS BELAKANG ▲
          </div>

          {/* Penanda Kanan Kiri */}
          <div className="relative z-10 flex items-center justify-between text-[11px] font-mono uppercase tracking-widest text-gading/65">
            <span>← Sayap Kiri</span>
            <span>Sayap Kanan →</span>
          </div>

          {/* Grid Spasial 4 Alat Musik di Panggung */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 md:gap-8 py-4 sm:py-6 items-center">
            {/* 1. Baris Belakang Tengah: GONG AGENG */}
            <div className="sm:col-start-2 sm:row-start-1 flex justify-center">
              {renderStageInstrumentStation(
                instruments.find((i) => i.slug === "gong")!,
                selectedSlug === "gong",
                hoveredSlug === "gong",
                () => handleSelectInstrument("gong"),
                () => setHoveredSlug("gong"),
                () => setHoveredSlug(null)
              )}
            </div>

            {/* 2. Baris Depan Sisi Kiri: BONANG */}
            <div className="sm:col-start-1 sm:row-start-2 flex justify-center">
              {renderStageInstrumentStation(
                instruments.find((i) => i.slug === "bonang")!,
                selectedSlug === "bonang",
                hoveredSlug === "bonang",
                () => handleSelectInstrument("bonang"),
                () => setHoveredSlug("bonang"),
                () => setHoveredSlug(null)
              )}
            </div>

            {/* 3. Pusat Panggung (Tengah): KENDANG */}
            <div className="sm:col-start-2 sm:row-start-2 flex justify-center">
              {renderStageInstrumentStation(
                instruments.find((i) => i.slug === "kendang")!,
                selectedSlug === "kendang",
                hoveredSlug === "kendang",
                () => handleSelectInstrument("kendang"),
                () => setHoveredSlug("kendang"),
                () => setHoveredSlug(null)
              )}
            </div>

            {/* 4. Baris Depan Sisi Kanan: SARON */}
            <div className="sm:col-start-3 sm:row-start-2 flex justify-center">
              {renderStageInstrumentStation(
                instruments.find((i) => i.slug === "saron")!,
                selectedSlug === "saron",
                hoveredSlug === "saron",
                () => handleSelectInstrument("saron"),
                () => setHoveredSlug("saron"),
                () => setHoveredSlug(null)
              )}
            </div>
          </div>

          {/* Panduan Arah Panggung */}
          <div className="text-center pt-2 pb-2 text-[10px] sm:text-xs text-gading/40 font-mono border-b border-perunggu/25 select-none tracking-widest">
            ▼ BARIS DEPAN ▼
          </div>

          {/* Petunjuk Aksi Pengunjung */}
          <div className="text-center pt-6 text-xs text-gading/50 select-none flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emas animate-ping" />
            <span>
              Arahkan kursor atau ketuk alat musik di atas untuk menyorot detailnya di bawah ↓
            </span>
          </div>
        </div>

        {/* 2. PANEL DETAIL SOROTAN PANGGUNG (STAGE SPOTLIGHT SHOWCASE) */}
        <div className="w-full bg-arang/95 border-2 border-emas/40 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-md transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Kolom Kiri: Visual Gambar Beresolusi Tinggi & Penanda Spasial */}
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

            {/* Kolom Kanan: Narasi Kurasi, Fungsi Gamelan, dan Tombol Interaktif */}
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

              {/* Kotak Fungsi Utama dalam Gamelan (Fokus Permintaan User) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-tinta/80 border border-emas/35 space-y-2 shadow-inner">
                <div className="flex items-center gap-2 text-emas font-semibold text-xs sm:text-sm uppercase tracking-wider">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                  <span>Fungsi dalam Gamelan</span>
                </div>
                <p className="text-xs sm:text-sm text-gading/90 leading-relaxed font-light">
                  {selectedInstrument.fungsi}
                </p>
              </div>

              {/* Alasan Penempatan di Denah Panggung */}
              <div className="p-3.5 rounded-xl bg-arang/60 border border-perunggu/25 space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-emas/80 font-medium">
                  Alasan Penempatan di Panggung:
                </span>
                <p className="text-xs text-gading/75 leading-relaxed font-light">
                  {infoPanggung.alasanPenempatan}
                </p>
              </div>

              {/* Deskripsi Singkat */}
              <p className="text-xs sm:text-sm text-gading/70 leading-relaxed">
                {selectedInstrument.deskripsiSingkat}
              </p>

              {/* Area Aksi Tombol: Tombol Khusus Audio Lagu & CTA Mainkan */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* Tombol Khusus: Putar Audio Contoh Permainan Lagu */}
                  <button
                    type="button"
                    onClick={handleToggleSongAudio}
                    aria-label={`Putar contoh lagu permainan ${selectedInstrument.nama}`}
                    className={`w-full sm:w-auto px-5 py-3 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-3 min-h-[46px] cursor-pointer shadow-lg ${
                      isPlayingSong
                        ? "bg-emas text-tinta border-emas shadow-[0_0_25px_rgba(212,175,55,0.6)]"
                        : "bg-tinta border-emas/40 text-gading hover:text-emas hover:border-emas hover:bg-arang"
                    }`}
                  >
                    {isPlayingSong ? (
                      <>
                        {/* Batang equalizer yang bergerak dinamis */}
                        <div className="flex items-end gap-1 h-4">
                          <span className="w-1 bg-tinta rounded-full animate-eq-1" />
                          <span className="w-1 bg-tinta rounded-full animate-eq-2" />
                          <span className="w-1 bg-tinta rounded-full animate-eq-3" />
                          <span className="w-1 bg-tinta rounded-full animate-eq-4" />
                        </div>
                        <span>Jeda Contoh Lagu</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 text-emas" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        <div className="text-left">
                          <span className="block leading-tight font-semibold">Dengarkan Contoh Lagu</span>
                          <span className="text-[10px] text-gading/60 block leading-tight font-normal">
                            Permainan {selectedInstrument.nama}
                          </span>
                        </div>
                      </>
                    )}
                  </button>

                  {/* Tombol CTA: Mulai Memainkan Alat Musik di Soundboard */}
                  <Link
                    href={`/instrumen/${selectedInstrument.slug}`}
                    className="w-full sm:w-auto px-7 py-3 rounded-xl bg-emas text-tinta font-semibold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:shadow-[0_0_28px_rgba(212,175,55,0.55)] hover:bg-emas-muda transition-all flex items-center justify-center gap-2 min-h-[46px]"
                  >
                    <span>Mulai Mainkan {selectedInstrument.nama}</span>
                    <span>→</span>
                  </Link>
                </div>

                {/* Notifikasi info status audio */}
                {songNotice && (
                  <div className="p-3 rounded-xl bg-tinta/90 border border-emas/40 text-xs text-gading/85 flex items-start gap-2.5 animate-in fade-in duration-200">
                    <span className="text-emas text-sm">ℹ</span>
                    <p className="leading-relaxed">{songNotice}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/**
 * Render satu stasiun podium alat musik fisik di atas panggung tampak atas (Overhead Stage Station)
 */
function renderStageInstrumentStation(
  instrumen: Instrumen,
  isActive: boolean,
  isHovered: boolean,
  onSelect: () => void,
  onMouseEnter: () => void,
  onMouseLeave: () => void
) {
  if (!instrumen) return null;
  const meta = METADATA_PANGGUNG[instrumen.slug];

  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      aria-label={`Sorot ${instrumen.nama} di ${meta?.posisiLabel || "panggung"}`}
      className="relative group w-full max-w-[270px] flex flex-col items-center cursor-pointer select-none transition-all duration-300 focus:outline-none"
    >

      {/* 2. Visual Alat Musik di Atas Panggung dengan Efek Mengambang 3D */}
      <div
        className={`relative z-10 w-36 h-28 sm:w-44 sm:h-32 md:w-52 md:h-36 rounded-2xl p-1.5 transition-all duration-300 transform ${
          isActive
            ? "-translate-y-3 scale-105 shadow-[0_15px_30px_rgba(212,175,55,0.45)] ring-2 ring-emas bg-gradient-to-b from-arang/90 to-tinta/95"
            : isHovered
            ? "-translate-y-2 scale-105 shadow-[0_10px_25px_rgba(212,175,55,0.3)] ring-1 ring-emas/60 bg-arang/80"
            : "translate-y-0 scale-100 bg-arang/60 border border-perunggu/35 hover:border-emas/50"
        }`}
      >
        <div className="relative w-full h-full rounded-xl overflow-hidden bg-tinta">
          <Image
            src={instrumen.gambar}
            alt={instrumen.nama}
            fill
            sizes="(max-width: 640px) 160px, 220px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />

          {/* Gradien gelap halus di tepi gambar */}
          <div className="absolute inset-0 bg-gradient-to-t from-tinta/80 via-transparent to-transparent pointer-events-none" />

          {/* Aksara Jawa di Sudut Bawah */}
          {instrumen.namaJawa && (
            <div className="absolute bottom-1.5 left-2 px-1.5 py-0.5 rounded bg-arang/90 text-emas text-[11px] font-serif border border-emas/30 pointer-events-none">
              {instrumen.namaJawa}
            </div>
          )}
        </div>
      </div>

      {/* 3. Alas Karpet Panggung / Medallion Pedestal Melingkar di Lantai */}
      <div className="relative -mt-3 flex items-center justify-center pointer-events-none">
        <div
          className={`w-36 sm:w-44 h-8 rounded-[100%] transition-all duration-300 border ${
            isActive
              ? "bg-gradient-to-r from-emas/30 via-emas/60 to-emas/30 border-emas shadow-[0_0_25px_rgba(212,175,55,0.8)] scale-110"
              : isHovered
              ? "bg-gradient-to-r from-emas/20 via-emas/40 to-emas/20 border-emas/70 scale-105"
              : "bg-gradient-to-r from-perunggu/10 via-perunggu/30 to-perunggu/10 border-perunggu/40"
          }`}
        />
      </div>

      {/* 4. Label Nama & Peran Spasial Alat Musik */}
      <div className="pt-2 text-center flex flex-col items-center">
        <span
          className={`font-serif text-sm sm:text-base font-bold transition-colors ${
            isActive ? "text-emas" : "text-gading group-hover:text-emas"
          }`}
        >
          {instrumen.nama}
        </span>
        <span className="text-[10px] sm:text-[11px] text-gading/60 font-light truncate max-w-[200px]">
          {meta?.posisiLabel} &bull; {meta?.peranSpasial}
        </span>
      </div>
    </button>
  );
}
