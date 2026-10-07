"use client";

import React, { useState, useCallback } from "react";
import { ItemSuara } from "@/types/instrumen";

interface KendangPadProps {
  daftarSuara: ItemSuara[];
  activeKeyId?: string | null;
  onPlay: (item: ItemSuara) => void;
}

export const KendangPad: React.FC<KendangPadProps> = ({
  daftarSuara,
  activeKeyId,
  onPlay,
}) => {
  const [pointerArea, setPointerArea] = useState<string | null>(null);
  const activeArea = activeKeyId || pointerArea;

  const handlePointerDown = useCallback(
    (item: ItemSuara, e: React.PointerEvent) => {
      e.currentTarget.setPointerCapture?.(e.pointerId);
      setPointerArea(item.id);
      onPlay(item);
      setTimeout(() => setPointerArea(null), 180);
    },
    [onPlay]
  );

  const getSuaraById = (id: string) => daftarSuara.find((s) => s.id === id);
  const dahItem = getSuaraById("dah");
  const dungItem = getSuaraById("dung");
  const takItem = getSuaraById("tak");
  const tungItem = getSuaraById("tung");

  return (
    <div className="w-full flex flex-col items-center py-6 px-2 space-y-8 select-none">
      {/* Ilustrasi Visual Kendang Interaktif SVG & CSS Pad */}
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#21150c] via-[#160e08] to-[#0d0804] border-2 border-[#472e1c] rounded-2xl p-4 sm:p-8 shadow-2xl overflow-hidden">
        {/* Ornamen Tali Janget Kulit Latar */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
          {/* SISI BESAR (TEBOKAN BEM / KIRI) */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs uppercase font-serif tracking-widest text-emas font-bold">
              Tebokan Besar (Kiri)
            </span>
            <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-[#2c1d12] border-4 border-[#523722] shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),0_8px_16px_rgba(0,0,0,0.7)] flex items-center justify-center p-3">
              {/* Area 1: DAH (Lingkaran Luar Tebokan Besar) */}
              {dahItem && (
                <button
                  type="button"
                  onPointerDown={(e) => handlePointerDown(dahItem, e)}
                  style={{ touchAction: "none" }}
                  aria-label="Pukulan Dah (tombol V)"
                  className={`absolute inset-1 rounded-full flex flex-col items-center justify-start pt-2 cursor-pointer transition-all duration-100 ${
                    activeArea === "dah"
                      ? "bg-emas/50 shadow-[0_0_25px_rgba(212,175,55,0.8)] scale-98"
                      : "bg-[#d9c5a3] hover:bg-[#e4d4b8]"
                  }`}
                >
                  <span className="text-xs font-bold text-[#3d2716] tracking-wider uppercase mt-1">
                    Dah [Z]
                  </span>
                  <span className="text-[10px] text-[#5c3e26]">Pukulan Terbuka</span>
                </button>
              )}

              {/* Area 2: DUNG (Lingkaran Dalam Tebokan Besar) */}
              {dungItem && (
                <button
                  type="button"
                  onPointerDown={(e) => handlePointerDown(dungItem, e)}
                  style={{ touchAction: "none" }}
                  aria-label="Pukulan Dung (tombol Z)"
                  className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-[#825c34] flex flex-col items-center justify-center cursor-pointer transition-all duration-100 shadow-md ${
                    activeArea === "dung"
                      ? "bg-emas text-tinta shadow-[0_0_30px_rgba(212,175,55,0.9)] scale-95"
                      : "bg-[#714d2e] hover:bg-[#855c37] text-gading"
                  }`}
                >
                  <span className="font-serif text-lg font-bold">Dung</span>
                  <span className="text-[10px] text-emas-muda font-mono">[X]</span>
                </button>
              )}
            </div>
          </div>

          {/* BADAN KAYU KENDANG (TENGAH) */}
          <div className="flex flex-col items-center justify-center py-2 px-4 text-center">
            <div className="w-16 sm:w-24 h-2 rounded-full bg-emas/40 mb-2" />
            <span className="font-serif text-xl sm:text-2xl font-bold text-gading">
              ꦏꦼꦤ꧀ꦝꦁ
            </span>
            <span className="text-xs text-gading/60 italic mt-0.5">Pamurba Wirama</span>
            <div className="w-16 sm:w-24 h-2 rounded-full bg-emas/40 mt-2" />
          </div>

          {/* SISI KECIL (TEBOKAN KEMPYANG / KANAN) */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs uppercase font-serif tracking-widest text-emas font-bold">
              Tebokan Kecil (Kanan)
            </span>
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-[#2c1d12] border-4 border-[#523722] shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),0_8px_16px_rgba(0,0,0,0.7)] flex items-center justify-center p-3">
              {/* Area 3: TUNG / TAK-TAK (Lingkaran Tepi Sisi Kecil) */}
              {tungItem && (
                <button
                  type="button"
                  onPointerDown={(e) => handlePointerDown(tungItem, e)}
                  style={{ touchAction: "none" }}
                  aria-label="Pukulan Tung (tombol M)"
                  className={`absolute inset-1 rounded-full flex flex-col items-center justify-start pt-1.5 cursor-pointer transition-all duration-100 ${
                    activeArea === "tung"
                      ? "bg-emas/60 shadow-[0_0_25px_rgba(212,175,55,0.8)] scale-98"
                      : "bg-[#e2d0b3] hover:bg-[#ecdcc2]"
                  }`}
                >
                  <span className="text-[11px] font-bold text-[#3d2716] uppercase mt-0.5">
                    Tung [M]
                  </span>
                  <span className="text-[9px] text-[#5c3e26]">Sentuh Tepi</span>
                </button>
              )}

              {/* Area 4: TAK (Lingkaran Tengah Sisi Kecil) */}
              {takItem && (
                <button
                  type="button"
                  onPointerDown={(e) => handlePointerDown(takItem, e)}
                  style={{ touchAction: "none" }}
                  aria-label="Pukulan Tak (tombol N)"
                  className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-[#825c34] flex flex-col items-center justify-center cursor-pointer transition-all duration-100 shadow-md ${
                    activeArea === "tak"
                      ? "bg-emas text-tinta shadow-[0_0_25px_rgba(212,175,55,0.9)] scale-95"
                      : "bg-[#5a3a20] hover:bg-[#6c4728] text-gading"
                  }`}
                >
                  <span className="font-serif text-base font-bold">Tak</span>
                  <span className="text-[10px] text-emas-muda font-mono">[N]</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Penjelasan Singkat Tiap Suara di Bawah Soundboard */}
      <div className="w-full max-w-2xl bg-tinta/80 border border-perunggu/25 rounded-xl p-4 sm:p-5 space-y-3">
        <h4 className="font-serif text-sm uppercase tracking-wider text-emas font-bold flex items-center gap-2">
          <span>Karakteristik Ragam Pukulan Kendang:</span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gading/80">
          <div className="p-2.5 rounded-lg bg-arang/70 border border-perunggu/20">
            <strong className="text-emas">Dah :</strong> Pukulan telapak tangan terbuka sisi besar, dentum bass mantap.
          </div>
          <div className="p-2.5 rounded-lg bg-arang/70 border border-perunggu/20">
            <strong className="text-emas">Tak :</strong> Pukulan telapak ditepuk redam di sisi kecil, suara kering tegas.
          </div>
          <div className="p-2.5 rounded-lg bg-arang/70 border border-perunggu/20">
            <strong className="text-emas">Tung :</strong> Sentuhan lentik jari di tepi kulit sisi kecil, suara tinggi nyaring.
          </div>
          <div className="p-2.5 rounded-lg bg-arang/70 border border-perunggu/20">
            <strong className="text-emas">Dung :</strong> Pukulan jari bagian dalam sisi besar, bergaung bulat & dalam.
          </div>
        </div>
      </div>
    </div>
  );
};
