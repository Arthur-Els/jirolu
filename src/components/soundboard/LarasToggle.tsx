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
    <div className="flex flex-row items-center justify-between sm:justify-start gap-2 sm:gap-3 w-full sm:w-auto">
      <span className="text-[11px] sm:text-xs uppercase tracking-widest text-gading/60 font-medium shrink-0">
        Laras:
      </span>
      <div className="inline-flex rounded-2xl p-1 bg-tinta border border-perunggu/40 shadow-inner">
        {/* Tombol Pelog */}
        <button
          type="button"
          onClick={() => {
            if (!disabled) onLarasChange("pelog");
          }}
          disabled={disabled}
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-semibold tracking-wider transition-colors duration-200 min-h-[40px] sm:min-h-[44px] sm:min-w-[80px] ${
            currentLaras === "pelog"
              ? "bg-emas text-tinta font-bold"
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
          className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-semibold tracking-wider transition-colors duration-200 min-h-[40px] sm:min-h-[44px] sm:min-w-[80px] ${
            currentLaras === "slendro"
              ? "bg-emas text-tinta"
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
