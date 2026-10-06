"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ItemSuara } from "@/types/instrumen";
import { KeyboardHint } from "./KeyboardHint";

interface GongPadProps {
  daftarSuara: ItemSuara[];
  activeKeyId?: string | null;
  onPlay: (item: ItemSuara) => void;
}

export const GongPad: React.FC<GongPadProps> = ({
  daftarSuara,
  activeKeyId,
  onPlay,
}) => {
  // Melacak efek riak gelombang emas per ID gong
  const [ripples, setRipples] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (activeKeyId) {
      const startTimer = setTimeout(() => {
        setRipples((prev) => ({ ...prev, [activeKeyId]: true }));
      }, 0);
      const endTimer = setTimeout(() => {
        setRipples((prev) => ({ ...prev, [activeKeyId]: false }));
      }, 1600);
      return () => {
        clearTimeout(startTimer);
        clearTimeout(endTimer);
      };
    }
  }, [activeKeyId]);

  const handlePointerDown = useCallback(
    (item: ItemSuara, e: React.PointerEvent<HTMLButtonElement>) => {
      e.currentTarget.setPointerCapture?.(e.pointerId);
      // Nyalakan gelombang emas
      setRipples((prev) => ({ ...prev, [item.id]: false }));
      setTimeout(() => {
        setRipples((prev) => ({ ...prev, [item.id]: true }));
      }, 10);

      onPlay(item);

      setTimeout(() => {
        setRipples((prev) => ({ ...prev, [item.id]: false }));
      }, 2000);
    },
    [onPlay]
  );

  // Ukuran visual proporsional untuk 3 jenis gong
  const ukuranGong: Record<string, { size: string; scale: string }> = {
    "gong-ageng": { size: "w-44 h-44 sm:w-56 sm:h-56", scale: "order-2 md:order-2" },
    "gong-suwukan": { size: "w-36 h-36 sm:w-44 sm:h-44", scale: "order-1 md:order-1" },
    "kempul": { size: "w-28 h-28 sm:w-36 sm:h-36", scale: "order-3 md:order-3" },
  };

  return (
    <div className="w-full flex flex-col items-center py-6 px-2 space-y-6">
      <div className="flex flex-wrap items-end justify-center gap-6 sm:gap-10 md:gap-14 w-full">
        {daftarSuara.map((gong) => {
          const config = ukuranGong[gong.id] || { size: "w-36 h-36", scale: "" };
          const isRippling = Boolean(ripples[gong.id]);

          return (
            <div
              key={gong.id}
              className={`flex flex-col items-center gap-3 ${config.scale} select-none`}
            >
              {/* Wadah Gong dengan Efek Gelombang Riak Emas */}
              <div className="relative flex items-center justify-center">
                {/* Gelombang Emas Melebar Pelan saat Dipukul */}
                {isRippling && (
                  <>
                    <span className="absolute inset-0 rounded-full border-2 border-emas animate-ping opacity-60 pointer-events-none duration-1000" />
                    <span className="absolute -inset-4 sm:-inset-6 rounded-full border border-emas/40 animate-pulse pointer-events-none" />
                  </>
                )}

                {/* Piringan Bundar Gong */}
                <button
                  type="button"
                  onPointerDown={(e) => handlePointerDown(gong, e)}
                  style={{ touchAction: "none" }}
                  aria-label={`Pukul ${gong.nama}, tombol keyboard ${gong.key}`}
                  className={`${config.size} rounded-full relative flex items-center justify-center cursor-pointer transition-transform duration-150 active:scale-95 focus:outline-none focus:ring-4 focus:ring-emas/50 shadow-[0_12px_28px_rgba(0,0,0,0.8)] ${
                    isRippling
                      ? "bg-gradient-to-br from-[#f1d072] via-[#a3792f] to-[#3a270f] shadow-[0_0_40px_rgba(212,175,55,0.7)]"
                      : "bg-gradient-to-br from-[#68491c] via-[#3d290f] to-[#1a1106] hover:from-[#7e5822] hover:to-[#271909]"
                  }`}
                >
                  {/* Lingkaran Luar Gong */}
                  <div className="absolute inset-2 sm:inset-3 rounded-full border-2 border-emas/30 pointer-events-none" />

                  {/* Pencu Tengah (Tonjolan Penabuh Gong) */}
                  <div
                    className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 border-[#825c1a] shadow-inner flex items-center justify-center transition-colors pointer-events-none ${
                      isRippling
                        ? "bg-emas text-tinta"
                        : "bg-gradient-to-br from-emas via-[#916b25] to-[#46310e] text-[#221606]"
                    }`}
                  >
                    <div className="w-3 h-3 rounded-full bg-tinta/50" />
                  </div>
                </button>
              </div>

              {/* Identitas Gong & Tombol Keyboard */}
              <div className="flex flex-col items-center gap-1 text-center">
                <span className="font-serif text-lg sm:text-xl font-bold text-gading">
                  {gong.nama}
                </span>
                <span className="text-[11px] text-gading/60 max-w-[140px] leading-tight">
                  {gong.keterangan.split("(")[0]}
                </span>
                <div className="mt-1">
                  <KeyboardHint shortcutKey={gong.key} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gading/50 italic text-center pt-2">
        Tekan tombol angka <span className="text-emas font-semibold">[1, 2, 3]</span> atau klik langsung untuk mendengarkan dengung gelombang agung gamelan.
      </p>
    </div>
  );
};
