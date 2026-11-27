"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { Locale } from "@/lib/i18n/types";

interface LanguageToggleProps {
  variant?: "header" | "mobile";
  onSelect?: (locale: Locale) => void;
  className?: string;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  variant = "header",
  onSelect,
  className = "",
}) => {
  const { locale, toggleLocale } = useLanguage();

  const handleToggle = () => {
    const next: Locale = locale === "id" ? "en" : "id";
    toggleLocale();
    onSelect?.(next);
  };

  const label =
    locale === "en"
      ? "Switch language to Indonesian"
      : "Ganti bahasa ke Inggris";
  const buttonSizeClass =
    variant === "mobile"
      ? "px-2.5 py-1.5 text-[13px]"
      : "px-2 py-1 text-[12px]";

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={label}
      className={`inline-flex items-center gap-1.5 font-mono font-medium tracking-wider cursor-pointer select-none rounded-sm focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 ${buttonSizeClass} ${className}`}
    >
      <span className={locale === "id" ? "text-white" : "text-white/40"}>
        ID
      </span>
      <span className="text-white/25 text-[11px]" aria-hidden="true">
        /
      </span>
      <span className={locale === "en" ? "text-white" : "text-white/40"}>
        EN
      </span>
    </button>
  );
};
