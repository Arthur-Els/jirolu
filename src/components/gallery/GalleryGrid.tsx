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
    zona: "Baris Belakang",
    peranSpasial: "Penanda Awal dan Akhir Lagu",
    alasanPenempatan:
      "Diletakkan paling belakang karena ukurannya yang agung dan rentang gelombang suaranya yang sangat dalam, membungkus seluruh getaran nada instrumen di depannya.",
    posisiLabel: "Belakang Tengah",
  },
  kendang: {
    zona: "Tengah",
    peranSpasial: "Pengatur Dinamika",
    alasanPenempatan:
      "Berada tepat di titik pusat agar pengendang dapat mendengar seluruh kelompok instrumen dan memberi aba-aba pergantian tempo secara visual maupun audio ke seluruh pengrawit.",
    posisiLabel: "Pusat Panggung",
  },
  bonang: {
    zona: "Baris Depan Kiri",
    peranSpasial: "Penghias Melodi",
    alasanPenempatan:
      "Ditempatkan di baris depan mendatar agar jalinan melodi lincah dari sepasang tabuh bindi terdengar jernih menyatu dengan kerangka dasar balungan.",
    posisiLabel: "Depan Kiri",
  },
  saron: {
    zona: "Baris Depan Kanan",
    peranSpasial: "Kerangka Utama Melodi",
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

  // Ref container section galeri untuk efek scroll-driven kamera masuk ke panggung (Konsep A)
  const sectionRef = useRef<HTMLElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Ref untuk auto-scroll ke bagian card penjelasan di bawah
  const explanationCardRef = useRef<HTMLDivElement | null>(null);

  // State pemutar audio contoh lagu
  const [isPlayingSong, setIsPlayingSong] = useState<boolean>(false);
  const [songNotice, setSongNotice] = useState<string | null>(null);
  const audioSongRef = useRef<HTMLAudioElement | null>(null);

  // Efek kamera melangkah masuk panggung saat scroll (Scroll-Driven Cinematic Step-In)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (sectionRef.current) {
            const rect = sectionRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            // Progress dimulai saat bagian atas panggung memasuki 90% layar sampai 10%
            const start = windowHeight * 0.9;
            const end = windowHeight * 0.1;
            const progress = Math.min(Math.max((start - rect.top) / (start - end), 0), 1);
            setScrollProgress(progress);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Parameter zoom & atmosfer kamera melangkah masuk (Konsep A)
  const cameraScale = 1 + scrollProgress * 0.08;
  const cameraShiftY = scrollProgress * 12;
  const stageAmbientWarmth = 0.16 + scrollProgress * 0.22;

  return (
    <section
      id="galeri"
      ref={sectionRef}
      className="w-full py-16 sm:py-24 relative overflow-hidden"
    >
      {/* Background Ambience Dasar Panggung Menghubungkan Secara Mengalir */}
      <div className="absolute inset-0 bg-[#0B0A09] pointer-events-none" />

      {/* Cahaya temaram lembut di bagian atas galeri menghubungkan dari Features Showcase */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-64 pointer-events-none select-none opacity-25"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(212, 175, 55, 0.22) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* 1. HEADER PENGANTAR PANGGUNG (Megah & Menyatu) */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4 mb-8 sm:mb-14">
        <ScrollReveal direction="up" distance={24} duration={0.65} scale={0.96}>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-emas text-sm font-mono font-medium mb-1">
            <span>ꦥꦁꦒꦸꦁꦏꦫꦮꦶꦠꦤ꧀</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-gading tracking-tight">
            Denah Panggung Karawitan
          </h2>
          <div className="w-[25%] h-0.5 bg-emas mx-auto rounded-full my-3" />
          <p className="text-sm sm:text-base text-gading/75 leading-relaxed max-w-2xl mx-auto font-light">
            Arahkan kursor atau sentuh alat musik pada gambar di bawah untuk melihat informasi mengenai alat musik dan mulai memainkannya.
          </p>
        </ScrollReveal>
      </div>

      {/* 2. PANGGUNG PENDOPO FULL-BLEED (EDGE-TO-EDGE SEAMLESS IMMERSION) */}
      <div className="relative w-full overflow-hidden">
        {/* Arena Panggung: Tanpa Kotak Pembatas Kaku */}
        <div
          ref={stageRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative w-full aspect-[1531/704] min-h-[340px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[680px] select-none"
        >
          {/* Layer Kamera Sinematik (Efek Zoom Masuk Saat Scroll) */}
          <div
            className="relative w-full h-full will-change-transform transition-transform duration-300 ease-out"
            style={{
              transform: `scale(${cameraScale}) translateY(${cameraShiftY}px)`,
              transformOrigin: "center 42%",
            }}
          >
            {/* Foto Panggung Pendopo Karawitan Penuh */}
            <Image
              src="/background/stage-bg.jpg"
              alt="Panggung Pendopo Karawitan Jawa"
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />

            {/* Dark Overlay Suasana Temaram Pentas */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A09]/92 via-[#0B0A09]/45 to-[#0B0A09]/65 pointer-events-none" />

            {/* Lampu Sorot Emas Hangat yang Menguat Saat Pengunjung Melangkah Masuk */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-500"
              style={{
                background: `radial-gradient(ellipse at 50% 35%, rgba(212,175,55,${stageAmbientWarmth}) 0%, rgba(11,10,9,0) 70%)`,
              }}
            />

            {/* SVG OVERLAY MAP PRESISI SESUAI BENTUK ALAT MUSIK (Ikut Ter-Zoom Tanpa Meleset) */}
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
                          ? "rgba(212, 175, 55, 0.25)"
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
          </div>

          {/* VIGNETTE GRADASI ALAMI DI SEMUA TEPI (Menghilangkan kesan 'kotak/card biasa' dengan kurva multi-stop) */}
          {/* Tepi Atas: Transisi Halus dari Latar Belakang Luar */}
          <div
            className="absolute top-0 left-0 right-0 h-36 sm:h-56 pointer-events-none z-10"
            style={{
              background:
                "linear-gradient(180deg, #0B0A09 0%, rgba(11,10,9,0.96) 20%, rgba(11,10,9,0.75) 45%, rgba(11,10,9,0.3) 75%, transparent 100%)",
            }}
          />

          {/* Tepi Bawah: Transisi Menuju Lantai Kurasi Penjelasan */}
          <div
            className="absolute bottom-0 left-0 right-0 h-44 sm:h-64 pointer-events-none z-10"
            style={{
              background:
                "linear-gradient(0deg, #0B0A09 0%, rgba(11,10,9,0.97) 22%, rgba(11,10,9,0.8) 48%, rgba(11,10,9,0.35) 78%, transparent 100%)",
            }}
          />

          {/* Sisi Kiri & Kanan: Bayangan Sayap Pendopo yang Luas */}
          <div
            className="absolute top-0 bottom-0 left-0 w-20 sm:w-48 pointer-events-none z-10"
            style={{
              background:
                "linear-gradient(90deg, #0B0A09 0%, rgba(11,10,9,0.93) 22%, rgba(11,10,9,0.6) 55%, transparent 100%)",
            }}
          />
          <div
            className="absolute top-0 bottom-0 right-0 w-20 sm:w-48 pointer-events-none z-10"
            style={{
              background:
                "linear-gradient(270deg, #0B0A09 0%, rgba(11,10,9,0.93) 22%, rgba(11,10,9,0.6) 55%, transparent 100%)",
            }}
          />

          {/* FLOATING CARD TOOLTIP (Mengikuti Kursor Mouse Secara Halus) */}
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
          <div className="absolute bottom-4 left-4 right-4 z-20 md:hidden p-3.5 rounded-2xl bg-[#0B0A09]/92 backdrop-blur-md border border-emas/40 shadow-2xl flex items-center justify-between gap-3">
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
              className="shrink-0 px-3 py-1.5 rounded-xl bg-emas text-tinta text-xs font-bold shadow-[0_0_12px_rgba(212,175,55,0.4)] cursor-pointer"
            >
              Lihat Detail ↓
            </button>
          </div>
        </div>
      </div>

      {/* 3. KURASI NAVIGASI INSTRUMEN (Minimalist Gallery Tab Bar - Zero Pill Buttons) */}
      <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 my-10 sm:my-14 flex flex-col items-center">

        {/* Tab Minimalis Bergaris Emas (Bukan Tombol Pill) */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12 border-b border-perunggu/20 pb-4 w-full">
          {instruments.map((inst) => {
            const isSelected = selectedSlug === inst.slug;
            return (
              <button
                key={inst.slug}
                type="button"
                onClick={() => handleInstrumentClick(inst.slug)}
                onMouseEnter={() => setHoveredSlug(inst.slug)}
                onMouseLeave={() => setHoveredSlug(null)}
                className={`group relative pb-2 text-sm sm:text-base font-serif tracking-wide transition-all duration-300 cursor-pointer flex items-baseline gap-2 ${
                  isSelected
                    ? "text-emas font-bold scale-105"
                    : "text-gading/60 hover:text-gading hover:scale-100"
                }`}
              >
                {inst.namaJawa && (
                  <span
                    className={`text-xs font-normal transition-colors ${
                      isSelected ? "text-emas-muda" : "text-gading/40 group-hover:text-gading/70"
                    }`}
                  >
                    {inst.namaJawa}
                  </span>
                )}
                <span>{inst.nama}</span>

                {/* Garis Bawah Pendar Emas Halus Saat Aktif */}
                {isSelected && (
                  <span className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emas to-transparent shadow-[0_0_12px_rgba(212,175,55,0.9)] animate-in fade-in duration-300" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. PANEL DETAIL PANORAMIC HERITAGE STAGE (Terbuka, Bernafas, Tanpa Kotak Card Kaku) */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 sm:px-6 mb-16 sm:mb-24">
        {/* Pendaran Latar Belakang Lampu Sorot Temaram di Belakang Artefak */}
        <div
          className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] pointer-events-none select-none opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(212, 175, 55, 0.22) 0%, transparent 65%)",
          }}
          aria-hidden="true"
        />

        <ScrollReveal direction="up" distance={32} duration={0.75} scale={0.96} delay={0.1}>
          <div
            ref={explanationCardRef}
            id="penjelasan-instrumen"
            className="scroll-mt-28 w-full transition-all duration-300"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Kolom Kiri: Visual Artefak Pameran dengan Vignette Melebur Organik (Bukan Kotak Crop Kaku) */}
              <div className="lg:col-span-5 relative">
                <div className="relative w-full aspect-[4/3] sm:aspect-[1/1] lg:aspect-[4/5] max-w-[480px] mx-auto rounded-3xl overflow-hidden bg-gradient-to-b from-[#18130E] via-[#0E0C0A] to-[#070605] shadow-[0_24px_60px_rgba(0,0,0,0.85)] border border-perunggu/30 group">
                  <Image
                    src={selectedInstrument.gambar}
                    alt={`Alat musik gamelan ${selectedInstrument.nama}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Gradasi Vignette Organik: Melebur Lembut dengan Ruang Panggung */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A09] via-transparent to-transparent opacity-90 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0B0A09]/40 via-transparent to-[#0B0A09]/40 pointer-events-none" />
                </div>

                {/* Bayangan Refleksi Lantai Pendopo */}
                <div className="w-3/4 h-5 mx-auto bg-emas/10 blur-xl rounded-full mt-2 pointer-events-none" />
              </div>

              {/* Kolom Kanan: Tipografi Narasi Kuratorial Terbuka (Tanpa Kotak Border / Card AI) */}
              <div className="lg:col-span-7 space-y-6">
                {/* 1. Header Identitas Instrumen */}
                <div className="space-y-2 border-b border-perunggu/25 pb-5">
                  <div className="flex items-baseline gap-4 flex-wrap">
                    <h3 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-gading tracking-tight">
                      {selectedInstrument.nama}
                    </h3>
                    {selectedInstrument.namaJawa && (
                      <span className="font-serif text-2xl sm:text-3xl text-emas/85 tracking-widest">
                        {selectedInstrument.namaJawa}
                      </span>
                    )}
                  </div>
                  <p className="font-serif text-lg sm:text-xl text-emas italic font-normal leading-relaxed">
                    &ldquo;{infoPanggung.peranSpasial}&rdquo;
                  </p>
                </div>

                {/* 2. Kutipan Filosofis Kuratorial (Pull-Quote Elegan) */}
                <blockquote className="border-l-2 border-emas/60 pl-5 py-1 text-sm sm:text-base text-gading/90 italic font-serif leading-relaxed">
                  &ldquo;{selectedInstrument.deskripsiSingkat}&rdquo;
                </blockquote>

                {/* 3. Dua Pilar Narasi (Tipografi Bersih & Bernafas Lapang Tanpa Nested Box) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  {/* Pilar A: Peran & Fungsi dalam Karawitan */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emas font-semibold text-xs tracking-widest uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-emas" />
                      <span>Fungsi dalam Gamelan</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gading/75 leading-relaxed font-light">
                      {selectedInstrument.fungsi}
                    </p>
                  </div>

                  {/* Pilar B: Filosofi Tata Letak Spasial */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-emas font-semibold text-xs tracking-widest uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-emas" />
                      <span>Alasan Penempatan</span>
                    </div>
                    <p className="text-xs sm:text-sm text-gading/75 leading-relaxed font-light">
                      {infoPanggung.alasanPenempatan}
                    </p>
                  </div>
                </div>

                {/* 4. Konsol Aksi Kuratorial: Pemutar Alunan & Akses Soundboard */}
                <div className="space-y-4">
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
                            <span className="block leading-tight font-semibold">Contoh Permainan {selectedInstrument.nama}</span>
                          </div>
                        </>
                      )}
                    </button>

                    {/* Tombol CTA: Mulai Memainkan Alat Musik di Soundboard */}
                    <Link
                      href={`/instrumen/${selectedInstrument.slug}`}
                      className="w-full sm:w-auto px-7 py-3 rounded-xl bg-emas text-tinta font-semibold text-xs sm:text-sm tracking-wide shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:shadow-[0_0_28px_rgba(212,175,55,0.55)] hover:bg-emas-muda transition-all flex items-center justify-center gap-2 min-h-[46px]"
                    >
                      <span>Mainkan {selectedInstrument.nama}</span>
                      <span>→</span>
                    </Link>
                  </div>

                  {/* Notifikasi info status audio jika sampel belum ada */}
                  {songNotice && (
                    <div className="p-3.5 rounded-xl bg-tinta/90 border border-emas/30 text-xs text-gading/80 flex items-start gap-2.5 animate-in fade-in duration-200">
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
