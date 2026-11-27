"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function TutorialPage() {
  const router = useRouter();
  const { locale } = useLanguage();

  useEffect(() => {
    router.replace("/cara-bermain");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0c0a] text-emas font-mono text-sm">
      {locale === "en"
        ? "Redirecting to How to Play Guide..."
        : "Mengalihkan ke Panduan Bermain..."}
    </div>
  );
}
