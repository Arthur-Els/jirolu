import React from "react";
import { Laras } from "@/types/instrumen";

interface LarasToggleProps {
  currentLaras: Laras;
  onLarasChange: (laras: Laras) => void;
  hasSlendro?: boolean;
  disabled?: boolean;
  disabledMessage?: string;
}

export const LarasToggle: React.FC<LarasToggleProps> = ({
  currentLaras,
  onLarasChange,
  hasSlendro = false,
  disabled = false,
  disabledMessage,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-3">
      <span className="text-xs uppercase tracking-widest text-gading/60 font-medium">
        Pilihan Laras:
      </span>
      <div className="inline-flex rounded-xl p-1 bg-tinta border border-perunggu/40 shadow-inner">
        {/* Tombol Pelog */}
        <button
          type="button"
          onClick={() => {
            if (!disabled) onLarasChange("pelog");
          }}
          disabled={disabled}
          className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 min-h-[44px] min-w-[80px] ${
            currentLaras === "pelog"
              ? "bg-emas text-tinta shadow-[0_0_15px_rgba(212,175,55,0.4)] font-bold"
              : "text-gading/70 hover:text-emas hover:bg-arang cursor-pointer"
          } ${disabled ? "cursor-default" : "cursor-pointer"}`}
          title={disabled ? (disabledMessage || "Laras dikunci ke Pelog") : "Pilih laras Pelog"}
        >
          Pelog {disabled && "🔒"}
        </button>

        {/* Tombol Slendro */}
        <button
          type="button"
          onClick={() => {
            if (hasSlendro && !disabled) {
              onLarasChange("slendro");
            }
          }}
          disabled={!hasSlendro || disabled}
          className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 min-h-[44px] min-w-[80px] ${
            currentLaras === "slendro"
              ? "bg-emas text-tinta shadow-[0_0_15px_rgba(212,175,55,0.4)]"
              : hasSlendro && !disabled
              ? "text-gading/70 hover:text-emas hover:bg-arang cursor-pointer"
              : "text-gading/30 cursor-not-allowed opacity-40"
          }`}
          title={
            disabled
              ? (disabledMessage || "Laras Slendro dinonaktifkan pada Mode Belajar")
              : hasSlendro
              ? "Beralih ke laras Slendro"
              : "Laras Slendro akan diaktifkan pada Fase 2"
          }
        >
          Slendro {!hasSlendro && "(Fase 2)"}
        </button>
      </div>
    </div>
  );
};
