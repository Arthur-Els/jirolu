import React from "react";
import Link from "next/link";
import Image from "next/image";

export const Footer: React.FC = () => {
  return (
    <footer id="kontak" className="relative z-10 w-full bg-arang/90 border-t border-perunggu/25 text-gading/70 py-12 px-4 sm:px-6 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          {/* Kolom Kiri: Identitas Jirolu */}
          <div className="text-center md:text-left space-y-3">
            <div className="flex items-center justify-center md:justify-start">
              <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
                <Image
                  src="/jirolu-logo.png"
                  alt="Jirolu Logo"
                  width={150}
                  height={84}
                  className="h-10 sm:h-12 w-auto object-contain"
                />
              </Link>
            </div>
            <p className="text-xs text-emas-muda font-serif italic">
              &ldquo;Museum gamelan yang bisa kamu mainkan.&rdquo;
            </p>
            <p className="text-xs text-gading/60 max-w-md leading-relaxed">
              Menjembatani keagungan seni karawitan Jawa Tengah dengan generasi muda melalui
              eksplorasi soundboard interaktif dan penghayatan nilai budaya adiluhung.
            </p>
          </div>

          {/* Kolom Tengah: Tiga Nada Filosofis */}
          <div className="text-center border-y md:border-y-0 md:border-x border-perunggu/20 py-3 md:py-0 md:px-8 space-y-1">
            <span className="text-[11px] tracking-widest uppercase text-emas font-medium">
              Tiga Nada Kehidupan
            </span>
            <p className="text-xs italic text-gading/80">
              &ldquo;Ji (1) - Ro (2) - Lu (3)&rdquo;
            </p>
            <p className="text-[10px] text-gading/50">
              Laras, Raras, Rancak
            </p>
          </div>

          {/* Kolom Kanan: Navigasi Cepat (2 Kolom Vertikal) */}
          <div className="flex items-start justify-center md:justify-end gap-8 sm:gap-12 text-xs tracking-wider">
            {/* Kolom 1 (Kiri): Navigasi Utama */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[10px] font-semibold text-emas uppercase tracking-widest pb-1 border-b border-perunggu/20">
                Navigasi
              </span>
              <Link href="/" className="hover:text-white transition-colors">
                Beranda
              </Link>
              <Link href="/tentang" className="hover:text-white transition-colors">
                Tentang
              </Link>
              <Link href="/cara-bermain" className="hover:text-white transition-colors">
                Cara Bermain
              </Link>
            </div>

            {/* Kolom 2 (Kanan): Alat Musik */}
            <div className="flex flex-col gap-2.5">
              <span className="text-[10px] font-semibold text-emas uppercase tracking-widest pb-1 border-b border-perunggu/20">
                Alat Musik
              </span>
              <Link href="/instrumen/saron" className="hover:text-white transition-colors">
                Saron
              </Link>
              <Link href="/instrumen/bonang" className="hover:text-white transition-colors">
                Bonang
              </Link>
              <Link href="/instrumen/gong" className="hover:text-white transition-colors">
                Gong
              </Link>
              <Link href="/instrumen/kendang" className="hover:text-white transition-colors">
                Kendang
              </Link>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-perunggu/15 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gading/40 gap-3">
          <p>© {new Date().getFullYear()} Jirolu. Dipersembahkan sebagai produk pameran alat musik tradisional Jawa.</p>
          <p className="tracking-wide">By PPLG Website Development Team</p>
        </div>
    </footer>
  );
};
