import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-arang/90 border-t border-perunggu/25 text-gading/70 py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Kolom Kiri: Identitas Museum */}
        <div className="text-center md:text-left space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="text-emas font-serif text-xl font-bold">ꦒ</span>
            <span className="font-serif text-lg font-semibold text-gading tracking-wide">
              Museum Digital Gamelan Jawa Tengah
            </span>
          </div>
          <p className="text-xs text-gading/60 max-w-md leading-relaxed">
            Menjaga keluhuran seni karawitan Nusantara melalui eksplorasi digital
            interaktif dan pelestarian nilai filosofis adiluhung Jawa.
          </p>
        </div>

        {/* Kolom Tengah: Filosofi Tri Prasetya Karawitan */}
        <div className="text-center border-y md:border-y-0 md:border-x border-perunggu/20 py-3 md:py-0 md:px-8 space-y-1">
          <span className="text-[11px] tracking-widest uppercase text-emas font-medium">
            Nilai Kehidupan
          </span>
          <p className="text-xs italic text-gading/80">
            &ldquo;Laras (Harmoni), Raras (Rasa Indah), Rancak (Keteraturan)&rdquo;
          </p>
        </div>

        {/* Kolom Kanan: Navigasi Cepat */}
        <div className="flex items-center gap-6 text-xs tracking-wider">
          <Link href="/" className="hover:text-emas transition-colors">
            Beranda
          </Link>
          <Link href="/instrumen/saron" className="hover:text-emas transition-colors">
            Saron Virtual
          </Link>
          <Link href="/tentang" className="hover:text-emas transition-colors">
            Tentang Kami
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-perunggu/15 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gading/40 gap-3">
        <p>© {new Date().getFullYear()} Museum Digital Gamelan Jawa Tengah. Dibangun untuk pelestarian budaya.</p>
        <p className="tracking-wide">Format Statis Interaktif • Next.js & Web Audio API</p>
      </div>
    </footer>
  );
};
