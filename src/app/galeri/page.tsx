"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export default function GaleriPage() {
  const router = useRouter();
  const { locale } = useLanguage();

  useEffect(() => {
    router.replace("/#galeri");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0c0a] text-emas font-mono text-sm">
      {locale === "en"
        ? "Redirecting to Exhibition Gallery..."
        : "Mengalihkan ke Galeri Pameran..."}
    </div>
  );
}
