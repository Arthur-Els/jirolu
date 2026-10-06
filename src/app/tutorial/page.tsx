"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TutorialPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/cara-bermain");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0c0a] text-emas font-mono text-sm">
      Mengalihkan ke Panduan Bermain...
    </div>
  );
}
