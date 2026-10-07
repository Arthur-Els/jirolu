import React from "react";
import { Laras } from "@/types/instrumen";

interface LarasToggleProps {
  currentLaras: Laras;
  onLarasChange: (laras: Laras) => void;
  hasSlendro?: boolean;
}

export const LarasToggle: React.FC<LarasToggleProps> = ({
  currentLaras,
  onLarasChange,
  hasSlendro = false,
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
          onClick={() => onLarasChange("pelog")}
          className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer min-h-[44px] min-w-[80px] ${
            currentLaras === "pelog"
              ? "bg-emas text-tinta shadow-[0_0_15px_rgba(212,175,55,0.4)]"
              : "text-gading/70 hover:text-emas hover:bg-arang"
          }`}
        >
          Pelog
        </button>

        {/* Tombol Slendro */}
        <button
          type="button"
          onClick={() => {
            if (hasSlendro) {
              onLarasChange("slendro");
            }
          }}
          disabled={!hasSlendro}
          className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wider transition-all duration-200 min-h-[44px] min-w-[80px] ${
            currentLaras === "slendro"
              ? "bg-emas text-tinta shadow-[0_0_15px_rgba(212,175,55,0.4)]"
              : hasSlendro
              ? "text-gading/70 hover:text-emas hover:bg-arang cursor-pointer"
              : "text-gading/30 cursor-not-allowed"
          }`}
          title={hasSlendro ? "Beralih ke laras Slendro" : "Laras Slendro akan diaktifkan pada Fase 2"}
        >
          Slendro {!hasSlendro && "(Fase 2)"}
        </button>
      </div>
    </div>
  );
};
