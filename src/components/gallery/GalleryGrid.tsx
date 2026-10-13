"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Instrumen } from "@/types/instrumen";
import {
  playInstrumentPreview,
  playInstrumentMelodySample,
} from "@/lib/audio/audioEngine";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

interface GalleryGridProps {
  instruments: Instrumen[];
}

// Data metadata penempatan spasial tiap instrumen di panggung Pendopo Karawitan
interface PosisiPanggungInfo {
  zona: string;
  peranSpasial: string;
  alasanPenempatan: string;
  posisiLabel: string;
}

const METADATA_PANGGUNG: Record<string, PosisiPanggungInfo> = {
  gong: {
    zona: "Baris Belakang • Pusat Kosmik",
    peranSpasial: "Penutup Siklus Gendhing & Pemangku Irama",
    alasanPenempatan:
      "Diletakkan paling belakang karena ukurannya yang agung dan rentang gelombang suaranya yang sangat dalam, membungkus seluruh getaran nada instrumen di depannya.",
    posisiLabel: "Belakang Tengah",
  },
  kendang: {
    zona: "Tengah Panggung • Pamurba Wirama",
    peranSpasial: "Konduktor Irama & Denyut Tempo",
    alasanPenempatan:
      "Berada tepat di titik pusat agar pengendang dapat mendengar seluruh kelompok instrumen dan memberi aba-aba pergantian tempo secara visual maupun audio ke seluruh pengrawit.",
    posisiLabel: "Pusat Panggung",
  },
  bonang: {
    zona: "Baris Depan Sisi Kiri • Pengembang Melodi",
    peranSpasial: "Pembuka Gending & Pola Jalinan Mipil",
    alasanPenempatan:
      "Ditempatkan di baris depan mendatar agar jalinan melodi lincah dari sepasang tabuh bindi terdengar jernih menyatu dengan kerangka dasar balungan.",
    posisiLabel: "Depan Kiri",
  },
  saron: {
    zona: "Baris Depan Sisi Kanan • Kerangka Melodi",
    peranSpasial: "Pembawa Kerangka Pokok (Balungan)",
    alasanPenempatan:
      "Berada sejajar di baris depan agar denting lugas bilah perunggu dapat disimak jelas oleh semua penabuh sebagai patokan harmoni lagu.",
    posisiLabel: "Depan Kanan",
  },
};

// Konfigurasi polygon koordinat SVG presisi di atas gambar asli stage-bg.jpg (1531x704)
interface InstrumentPolygonArea {
  slug: string;
  points: string;
  center: { x: number; y: number };
}

const INSTRUMENT_AREAS: InstrumentPolygonArea[] = [
  {
    slug: "gong",
    points:
      "600,185 620,150 665,138 715,158 765,123 815,158 865,138 910,150 930,185 910,200 900,335 915,348 865,348 875,325 850,305 765,310 680,305 655,325 665,348 615,348 630,335 620,200",
    center: { x: 765, y: 235 },
  },
  {
    slug: "kendang",
    points:
      "685,395 765,370 840,395 850,435 830,475 810,495 790,495 795,465 735,465 730,495 710,495 705,475 680,440",
    center: { x: 765, y: 435 },
  },
  {
    slug: "bonang",
    points:
      "465,320 545,320 560,360 525,465 645,465 655,525 645,550 370,550 365,505 365,470 415,450 455,350",
    center: { x: 495, y: 450 },
  },
  {
    slug: "saron",
    points:
      "920,375 990,380 995,435 1050,485 1130,485 1180,525 1180,555 1140,565 935,565 920,535 950,495 915,435",
    center: { x: 1045, y: 495 },
  },
];

export const GalleryGrid: React.FC<GalleryGridProps> = ({ instruments }) => {
  // State instrumen aktif dan hover
  const [selectedSlug, setSelectedSlug] = useState<string>("saron");
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  // State posisi kursor mouse relatif terhadap panggung untuk mouse-following card
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isMouseInsideStage, setIsMouseInsideStage] = useState<boolean>(false);
  const stageRef = useRef<HTMLDivElement | null>(null);

  // Ref untuk auto-scroll ke bagian card penjelasan di bawah
  const explanationCardRef = useRef<HTMLDivElement | null>(null);

  // State pemutar audio contoh lagu
  const [isPlayingSong, setIsPlayingSong] = useState<boolean>(false);
  const [songNotice, setSongNotice] = useState<string | null>(null);
  const audioSongRef = useRef<HTMLAudioElement | null>(null);

  // Bersihkan pemutaran audio saat unmount
  useEffect(() => {
    return () => {
      if (audioSongRef.current) {
        audioSongRef.current.pause();
      }
    };
  }, []);

  const selectedInstrument =
    instruments.find((item) => item.slug === selectedSlug) || instruments[0];

  const hoveredInstrument = hoveredSlug
    ? instruments.find((item) => item.slug === hoveredSlug)
    : null;

  // Konten card penjelasan di bawah HANYA berubah saat alat musik diklik (selectedInstrument)
  const infoPanggung =
    METADATA_PANGGUNG[selectedInstrument.slug] || {
      zona: "Panggung Ansambel",
      peranSpasial: "Instrumen Karawitan",
      alasanPenempatan: selectedInstrument.fungsi,
      posisiLabel: "Panggung Gamelan",
    };

  // Fungsi memutar audio preview instrumen (mendukung file mp3 atau fallback synthesizer)
  const playAudioPreview = useCallback((slug: string) => {
    const directAudio1 = `/audio/sampel/${slug}.mp3`;
    const directAudio2 = `/audio/sampel/${slug}-lagu.mp3`;

    const audio = new Audio(directAudio1);
    audioSongRef.current = audio;

    audio
      .play()
      .then(() => {
        // Berhasil memutar file sampel pengguna
      })
      .catch(() => {
        // Coba format alternatif
        const audio2 = new Audio(directAudio2);
        audioSongRef.current = audio2;
        audio2
          .play()
          .then(() => {
            // Berhasil memutar file -lagu.mp3
          })
          .catch(() => {
            // Fallback sintetis real-time menggunakan Web Audio API tanpa delay
            playInstrumentPreview(slug);
          });
      });
  }, []);

  // Handler interaksi pergerakan mouse pada panggung
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
    setIsMouseInsideStage(true);
  };

  const handleMouseLeave = () => {
    setIsMouseInsideStage(false);
    setHoveredSlug(null);
  };

  // Handler klik pada area alat musik: ganti instrumen terpilih, putar suara preview, dan scroll ke card penjelasan
  const handleInstrumentClick = (slug: string) => {
    const instrumen = instruments.find((i) => i.slug === slug);
    if (!instrumen) return;

    setSelectedSlug(slug);

    // Mainkan audio sampel instrumen
    playAudioPreview(slug);

    // Otomatis scroll halus ke card penjelasan di bawah
    explanationCardRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // Handler toggle audio contoh lagu di panel detail
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
      .catch(() => {
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

  // Kalkulasi posisi transform tooltip agar tidak keluar tepi panggung
  const getTooltipTransform = () => {
    if (!stageRef.current) return "translate(16px, 16px)";
    const { offsetWidth, offsetHeight } = stageRef.current;
    const isNearRight = mousePos.x > offsetWidth - 280;
    const isNearBottom = mousePos.y > offsetHeight - 160;

    const translateX = isNearRight ? "-105%" : "16px";
    const translateY = isNearBottom ? "-105%" : "16px";

    return `translate(${translateX}, ${translateY})`;
  };

  return (
    <section id="galeri" className="w-full py-16 px-4 sm:px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Galeri */}
        <ScrollReveal direction="up" distance={24} duration={0.65} scale={0.96}>
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gading">
              Denah Panggung Karawitan
            </h2>
            <div className="w-24 h-0.5 bg-emas mx-auto rounded-full" />
            <p className="text-sm sm:text-base text-gading/75 leading-relaxed pt-1">
              Arahkan kursor atau sentuh alat musik di atas panggung pendopo untuk melihat perannya dalam karawitan dan mendengarkan alunan bunyinya.
            </p>
          </div>
        </ScrollReveal>

        {/* 1. ARENA PANGGUNG PENDOPO INTERAKTIF (STAGE-BG FULL DENGAN DARK OVERLAY & SVG MAP) */}
        <ScrollReveal direction="up" distance={32} duration={0.75} scale={0.96} delay={0.1}>
          <div
            ref={stageRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative w-full aspect-[1531/704] min-h-[290px] sm:min-h-[420px] md:min-h-[500px] rounded-3xl overflow-hidden border-2 border-emas/40 shadow-[0_25px_60px_rgba(0,0,0,0.85)] bg-black select-none group"
          >
            {/* Background Penuh Gambar Panggung Pendopo */}
            <Image
              src="/background/stage-bg.jpg"
              alt="Panggung Pendopo Karawitan Jawa"
              fill
              priority
              sizes="(max-width: 1280px) 100vw, 1200px"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.01]"
            />

            {/* Dark Overlay Suasana Panggung Pendopo Redup */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A09]/90 via-[#0B0A09]/45 to-[#0B0A09]/60 pointer-events-none" />

            {/* Pencahayaan Lembut Emas Khas Pendopo */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 30%, rgba(212,175,55,0.18) 0%, rgba(11,10,9,0) 70%)",
              }}
            />

            {/* Penanda Visual Sisi Panggung */}
            <div className="absolute top-4 left-6 z-10 flex items-center gap-2 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-emas animate-ping" />
              <span className="text-[11px] font-mono tracking-widest text-emas/80 uppercase font-semibold">
                Panggung Pendopo
              </span>
            </div>

            {/* SVG OVERLAY MAP PRESISI SESUAI BENTUK ALAT MUSIK */}
            <svg
              viewBox="0 0 1531 704"
              preserveAspectRatio="xMidYMid meet"
              className="absolute inset-0 w-full h-full z-20 overflow-visible"
            >
              <defs>
                {/* Filter Pijar Emas Glowing untuk Highlight Hover */}
                <filter id="golden-glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="9" result="blur1" />
                  <feGaussianBlur stdDeviation="18" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur2" />
                    <feMergeNode in="blur1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Pola Arsiran Lembut Emas */}
                <pattern id="gold-grid" width="16" height="16" patternUnits="userSpaceOnUse">
                  <path d="M 16 0 L 0 16 M 0 0 L 16 16" fill="none" stroke="rgba(212,175,55,0.15)" strokeWidth="0.8" />
                </pattern>
              </defs>

              {INSTRUMENT_AREAS.map((area) => {
                const isHovered = hoveredSlug === area.slug;
                const isSelected = selectedSlug === area.slug;
                const isDimmed = hoveredSlug !== null && !isHovered;
                const instrumen = instruments.find((i) => i.slug === area.slug);

                return (
                  <g key={area.slug} className="cursor-pointer">
                    {/* Area Polygon Alat Musik */}
                    <polygon
                      points={area.points}
                      onClick={() => handleInstrumentClick(area.slug)}
                      onMouseEnter={() => setHoveredSlug(area.slug)}
                      onMouseLeave={() => setHoveredSlug(null)}
                      className="transition-all duration-300 ease-out"
                      fill={
                        isHovered
                          ? "rgba(212, 175, 55, 0.35)"
                          : isSelected
                          ? "rgba(212, 175, 55, 0.22)"
                          : "rgba(212, 175, 55, 0.05)"
                      }
                      stroke={
                        isHovered
                          ? "#FFF2B2"
                          : isSelected
                          ? "rgba(212, 175, 55, 0.9)"
                          : "rgba(212, 175, 55, 0.35)"
                      }
                      strokeWidth={isHovered ? 4 : isSelected ? 2.5 : 1.5}
                      strokeDasharray={isHovered || isSelected ? "none" : "4 4"}
                      filter={isHovered ? "url(#golden-glow)" : undefined}
                      style={{
                        opacity: isDimmed ? 0.3 : 1,
                        transition: "all 0.25s ease-out",
                      }}
                    />

                    {/* Titik Penanda / Pulsing Beacon Emas di Titik Pusat Alat Musik */}
                    <g
                      transform={`translate(${area.center.x}, ${area.center.y})`}
                      className="pointer-events-none transition-opacity duration-300"
                      style={{ opacity: isDimmed ? 0.2 : 1 }}
                    >
                      {/* Cincin Luar Berdenyut */}
                      <circle
                        r="14"
                        fill="none"
                        stroke="#D4AF37"
                        strokeWidth="1.5"
                        className="animate-ping opacity-60"
                      />
                      {/* Lingkaran Pijar Tengah */}
                      <circle
                        r="8"
                        fill={isHovered ? "#FFF2B2" : "#D4AF37"}
                        className="transition-colors duration-200"
                      />
                      <circle r="3" fill="#0B0A09" />

                      {/* Label Mini Singkat saat Tidak Dihover */}
                      {!isHovered && (
                        <text
                          y="26"
                          textAnchor="middle"
                          fill="#F3E5AB"
                          fontSize="13"
                          fontFamily="sans-serif"
                          fontWeight="bold"
                          className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] select-none opacity-90"
                        >
                          {instrumen?.nama}
                        </text>
                      )}
                    </g>
                  </g>
                );
              })}
            </svg>

            {/* 2. FLOATING CARD TOOLTIP (MENGIKUTI PERGERAKAN KURSOR MOUSE SECARA HALUS) */}
            {isMouseInsideStage && hoveredInstrument && (
              <div
                className="absolute z-30 pointer-events-none hidden md:block transition-transform duration-75 ease-out"
                style={{
                  left: `${mousePos.x}px`,
                  top: `${mousePos.y}px`,
                  transform: getTooltipTransform(),
                }}
              >
                <div className="w-[280px] p-4 rounded-2xl bg-[#0B0A09]/92 backdrop-blur-xl border border-emas/60 shadow-[0_16px_36px_rgba(0,0,0,0.85),0_0_24px_rgba(212,175,55,0.3)] space-y-2 text-left animate-in fade-in zoom-in-95 duration-150">
                  {/* Header Tooltip: Aksara Jawa & Nama */}
                  <div className="flex items-center justify-between gap-2 border-b border-perunggu/30 pb-2">
                    <div className="flex items-center gap-2">
                      {hoveredInstrument.namaJawa && (
                        <span className="text-emas font-serif text-lg leading-none font-bold">
                          {hoveredInstrument.namaJawa}
                        </span>
                      )}
                      <h4 className="font-serif font-bold text-white text-base">
                        {hoveredInstrument.nama}
                      </h4>
                    </div>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emas/15 text-emas-muda border border-emas/30 whitespace-nowrap">
                      {METADATA_PANGGUNG[hoveredInstrument.slug]?.posisiLabel || "Panggung"}
                    </span>
                  </div>

                  {/* Peran Singkat */}
                  <p className="text-xs text-gading/85 leading-snug font-light italic">
                    &ldquo;{METADATA_PANGGUNG[hoveredInstrument.slug]?.peranSpasial}&rdquo;
                  </p>

                  {/* Petunjuk Aksi Klik */}
                  <div className="pt-1.5 flex items-center justify-between text-[11px] font-semibold text-emas">
                    <span className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emas animate-ping" />
                      Klik untuk melihat
                    </span>
                    <span>↓</span>
                  </div>
                </div>
              </div>
            )}

            {/* Fallback Informasi Mobile (Bottom Floating Bar di Layar Sentuh) */}
            <div className="absolute bottom-3 left-3 right-3 z-20 md:hidden p-3 rounded-xl bg-[#0B0A09]/90 backdrop-blur-md border border-emas/40 shadow-xl flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {selectedInstrument.namaJawa && (
                    <span className="text-emas font-serif text-sm font-bold">
                      {selectedInstrument.namaJawa}
                    </span>
                  )}
                  <span className="text-white text-xs font-semibold truncate">
                    {selectedInstrument.nama}
                  </span>
                </div>
                <p className="text-[10px] text-gading/70 truncate">
                  {METADATA_PANGGUNG[selectedInstrument.slug]?.posisiLabel} &bull;{" "}
                  {METADATA_PANGGUNG[selectedInstrument.slug]?.peranSpasial}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleInstrumentClick(selectedInstrument.slug)}
                className="shrink-0 px-3 py-1.5 rounded-lg bg-emas text-tinta text-xs font-bold shadow-[0_0_12px_rgba(212,175,55,0.4)] cursor-pointer"
              >
                Lihat Detail ↓
              </button>
            </div>
          </div>
        </ScrollReveal>

        {/* Quick Selector Chips (Memudahkan Navigasi Cepat Pengguna Mobile / Tablet) */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
          {instruments.map((inst) => {
            const isSelected = selectedSlug === inst.slug;
            return (
              <button
                key={inst.slug}
                type="button"
                onClick={() => handleInstrumentClick(inst.slug)}
                onMouseEnter={() => setHoveredSlug(inst.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? "bg-emas text-tinta shadow-[0_0_20px_rgba(212,175,55,0.4)] scale-105"
                    : "bg-arang/80 text-gading/80 border border-perunggu/40 hover:border-emas/60 hover:text-white"
                }`}
              >
                {inst.namaJawa && (
                  <span className="font-serif text-sm opacity-90">{inst.namaJawa}</span>
                )}
                <span>{inst.nama}</span>
                <span className="text-[10px] opacity-60">
                  ({METADATA_PANGGUNG[inst.slug]?.posisiLabel})
                </span>
              </button>
            );
          })}
        </div>

        {/* 2. PANEL DETAIL SOROTAN PANGGUNG (SPOTLIGHT SHOWCASE) */}
        <ScrollReveal direction="up" distance={32} duration={0.75} scale={0.96} delay={0.15}>
          <div
            ref={explanationCardRef}
            id="penjelasan-instrumen"
            className="scroll-mt-24 w-full bg-arang/95 border-2 border-emas/40 rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl backdrop-blur-md transition-all duration-300"
          >
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

                {/* Kotak Fungsi Utama dalam Gamelan */}
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
                          ? "text-emas border-emas shadow-[0_0_25px_rgba(212,175,55,0.6)]"
                          : "bg-tinta border-emas/40 text-gading hover:text-emas hover:border-emas hover:bg-arang"
                      }`}
                    >
                      {isPlayingSong ? (
                        <>
                          <div className="flex items-end gap-1 h-4">
                            <span className="w-1 bg-emas rounded-full animate-eq-1" />
                            <span className="w-1 bg-emas rounded-full animate-eq-2" />
                            <span className="w-1 bg-emas rounded-full animate-eq-3" />
                            <span className="w-1 bg-emas rounded-full animate-eq-4" />
                          </div>
                          <span>Jeda Contoh Permainan</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 text-emas" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          <div className="text-left">
                            <span className="block leading-tight font-semibold">Contoh Permainan Lagu</span>
                            <span className="text-[10px] text-gading/60 block leading-tight font-normal">
                              Permainan {selectedInstrument.nama}
                            </span>
                          </div>
                        </>
                      )}
                    </button>

                    {/* Tombol CTA: Buka Modal / Masuk Simulator */}
                    <button
                      type="button"
                      onClick={() => handleInstrumentClick(selectedInstrument.slug)}
                      className="w-full sm:w-auto px-7 py-3 rounded-xl bg-emas text-tinta font-semibold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:shadow-[0_0_28px_rgba(212,175,55,0.55)] hover:bg-emas-muda transition-all flex items-center justify-center gap-2 min-h-[46px] cursor-pointer"
                    >
                      <span>Mulai Mainkan {selectedInstrument.nama}</span>
                      <span>→</span>
                    </button>
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
        </ScrollReveal>
      </div>
    </section>
  );
};
