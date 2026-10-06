import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer id="kontak" className="relative z-10 w-full bg-arang/90 border-t border-perunggu/25 text-gading/70 py-12 px-4 sm:px-6 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Kolom Kiri: Identitas Jirolu */}
        <div className="text-center md:text-left space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="text-emas font-serif text-xl font-bold">ꦗꦶ</span>
            <span className="font-serif text-xl font-bold text-gading tracking-wide">
              Jirolu
            </span>
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

        {/* Kolom Kanan: Navigasi Cepat */}
        <div className="flex flex-wrap justify-center md:justify-end gap-5 text-xs tracking-wider">
          <Link href="/" className="hover:text-emas transition-colors">
            Beranda
          </Link>
          <Link href="/instrumen/saron" className="hover:text-emas transition-colors">
            Saron
          </Link>
          <Link href="/instrumen/bonang" className="hover:text-emas transition-colors">
            Bonang
          </Link>
          <Link href="/instrumen/gong" className="hover:text-emas transition-colors">
            Gong
          </Link>
          <Link href="/instrumen/kendang" className="hover:text-emas transition-colors">
            Kendang
          </Link>
          <Link href="/cara-bermain" className="hover:text-emas transition-colors">
            Cara Bermain
          </Link>
          <Link href="/tentang" className="hover:text-emas transition-colors">
            Tentang Jirolu
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-perunggu/15 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gading/40 gap-3">
        <p>© {new Date().getFullYear()} Jirolu. Dipersembahkan untuk pelestarian budaya gamelan Jawa.</p>
        <p className="tracking-wide">Format Statis Interaktif • Web Audio API murni</p>
      </div>
    </footer>
  );
};
