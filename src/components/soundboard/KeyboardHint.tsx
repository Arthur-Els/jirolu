"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

interface KeyboardHintProps {
  shortcutKey: string;
}

/**
 * Komponen penunjuk tombol keyboard fisik komputer.
 * Ditampilkan di desktop/laptop, dan secara otomatis disembunyikan di layar HP
 * untuk menjaga kebersihan visual bilah pada perangkat sentuh.
 */
export const KeyboardHint: React.FC<KeyboardHintProps> = ({ shortcutKey }) => {
  const { locale } = useLanguage();
  const keyLabel = shortcutKey.toUpperCase();

  return (
    <span
      className="hidden sm:inline-flex items-center justify-center min-w-[26px] h-6 px-1.5 rounded-md bg-tinta/80 border border-perunggu/40 text-[11px] font-mono font-bold text-emas tracking-wider shadow-inner uppercase select-none pointer-events-none"
      title={
        locale === "en"
          ? `Press the ${keyLabel} key on your keyboard`
          : `Tekan tombol ${keyLabel} pada keyboard`
      }
    >
      {shortcutKey}
    </span>
  );
};
