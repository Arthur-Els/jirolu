"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function GaleriPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/#galeri");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0c0a] text-emas font-mono text-sm">
      Mengalihkan ke Galeri Pameran...
    </div>
  );
}
