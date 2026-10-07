import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Instrumen } from "@/types/instrumen";

interface OtherInstrumentsProps {
  currentSlug: string;
  allInstruments: Instrumen[];
}

export const OtherInstruments: React.FC<OtherInstrumentsProps> = ({
  currentSlug,
  allInstruments,
}) => {
  // Saring agar hanya menampilkan instrumen selain yang sedang dibuka
  const others = allInstruments.filter((item) => item.slug !== currentSlug);

  return (
    <section className="w-full space-y-6 pt-10 border-t border-perunggu/25">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <span className="text-xs uppercase tracking-widest text-emas font-medium">
            Koleksi Museum
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-gading">
            Alat Musik Lainnya
          </h3>
        </div>
        <Link
          href="/#galeri"
          className="text-xs text-gading/70 hover:text-emas-muda font-medium transition-colors"
        >
          Lihat Semua Koleksi Galeri →
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {others.map((item) => (
          <Link
            key={item.slug}
            href={`/instrumen/${item.slug}`}
            className="group bg-arang/90 border border-perunggu/30 rounded-xl overflow-hidden hover:border-emas hover:shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-all duration-300 flex flex-col justify-between"
          >
            <div className="relative w-full aspect-[4/3] bg-tinta overflow-hidden">
              <Image
                src={item.gambar}
                alt={`Alat musik gamelan ${item.nama}`}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-arang via-transparent to-transparent opacity-80" />
              {item.namaJawa && (
                <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-tinta/80 border border-perunggu/30 text-emas font-serif text-xs">
                  {item.namaJawa}
                </span>
              )}
            </div>

            <div className="p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-lg font-bold text-gading group-hover:text-emas transition-colors">
                  {item.nama}
                </h4>
                <span className="text-[10px] text-perunggu uppercase tracking-wider font-semibold">
                  {item.tipe === "bernada" ? "Bernada" : "Ritmis"}
                </span>
              </div>
              <p className="text-xs text-gading/65 line-clamp-2 leading-relaxed">
                {item.deskripsiSingkat}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
