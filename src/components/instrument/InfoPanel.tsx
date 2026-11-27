"use client";

import React, { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Instrumen } from "@/types/instrumen";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { getLocalizedInstrument } from "@/lib/i18n/instrumentDict";

interface InfoPanelProps {
  instrumen: Instrumen;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({ instrumen }) => {
  const [isOpen, setIsOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const { locale } = useLanguage();
  const isEn = locale === "en";
  const localizedInstrumen = getLocalizedInstrument(instrumen, locale);

  return (
    <div className="w-full bg-arang/60 border border-perunggu/25 rounded-2xl overflow-hidden backdrop-blur-sm transition-colors duration-200">
      {/* Tombol Accordion Minimalis */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`panel-detail-${instrumen.slug}`}
        className="w-full px-5 sm:px-7 py-4.5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors focus-visible:outline-2 focus-visible:outline-focus cursor-pointer select-none"
      >
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-emas/70" />
          <span className="font-serif text-base sm:text-lg text-gading font-medium">
            {isEn ? `About ${localizedInstrumen.nama}` : `Tentang ${localizedInstrumen.nama}`}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-gading/60 font-medium">
          <span>
            {isOpen ? (isEn ? "Close" : "Tutup") : isEn ? "Read Details" : "Baca Detail"}
          </span>
          <motion.svg
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { duration: 0.22, ease: "easeOut" }
            }
            className="w-4 h-4 text-emas"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </motion.svg>
        </div>
      </button>

      {/* Konten Accordion dengan Animasi Smooth Slide & Fade */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`panel-detail-${instrumen.slug}`}
            key="accordion-content"
            initial={
              shouldReduceMotion
                ? { opacity: 0 }
                : { height: 0, opacity: 0 }
            }
            animate={
              shouldReduceMotion
                ? { opacity: 1 }
                : { height: "auto", opacity: 1 }
            }
            exit={
              shouldReduceMotion
                ? { opacity: 0 }
                : { height: 0, opacity: 0 }
            }
            transition={
              shouldReduceMotion
                ? { duration: 0.12 }
                : { duration: 0.3, ease: [0.16, 1, 0.3, 1] }
            }
            className="overflow-hidden border-t border-perunggu/20"
          >
            <div className="px-5 sm:px-8 py-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Panel Fungsi */}
                <div className="space-y-2 bg-tinta/40 p-4 sm:p-5 rounded-xl border border-perunggu/15">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emas flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emas" />
                    {isEn ? "Role in the Gamelan" : "Fungsi dalam Gamelan"}
                  </span>
                  <p className="text-xs sm:text-sm text-gading/80 leading-relaxed font-light">
                    {localizedInstrumen.fungsi}
                  </p>
                </div>

                {/* Panel Filosofi */}
                <div className="space-y-2 bg-tinta/40 p-4 sm:p-5 rounded-xl border border-perunggu/15">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emas flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emas" />
                    {isEn ? "Javanese Meaning & Philosophy" : "Makna & Filosofi Jawa"}
                  </span>
                  <p className="text-xs sm:text-sm text-gading/80 leading-relaxed font-light">
                    {localizedInstrumen.filosofi}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
