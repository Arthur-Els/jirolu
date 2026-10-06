"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SoundboardPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/instrumen/saron");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0c0a] text-emas font-mono text-sm">
      Mengalihkan ke Soundboard Virtual...
    </div>
  );
}
