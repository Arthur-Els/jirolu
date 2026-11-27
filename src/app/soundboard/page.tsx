"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function SoundboardPage() {
  const router = useRouter();
  const { locale } = useLanguage();

  useEffect(() => {
    router.replace("/instrumen/saron");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0c0a] text-emas font-mono text-sm">
      {locale === "en"
        ? "Redirecting to Virtual Soundboard..."
        : "Mengalihkan ke Soundboard Virtual..."}
    </div>
  );
}
