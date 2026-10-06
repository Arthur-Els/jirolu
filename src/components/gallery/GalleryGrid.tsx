import React from "react";
import { Instrumen } from "@/types/instrumen";
import { InstrumentCard } from "./InstrumentCard";

interface GalleryGridProps {
  instruments: Instrumen[];
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ instruments }) => {
  return (
    <section id="galeri" className="w-full py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Galeri */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-emas text-xs uppercase tracking-widest font-medium">
            <span>ꦮꦶꦭꦸꦗꦼꦁꦫꦮꦸꦃ</span>
            <span>•</span>
            <span>Koleksi Utama</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-gading">
            Galeri Instrumen Karawitan
          </h2>
          <div className="w-16 h-0.5 bg-emas mx-auto rounded-full" />
          <p className="text-sm sm:text-base text-gading/75 leading-relaxed pt-2">
            Kenali karakteristik ragam instrumen gamelan Jawa Tengah. Sentuh kartu untuk
            mengeksplorasi filosofi mendalam dan mencoba soundboard virtual interaktifnya.
          </p>
        </div>

        {/* Grid Kartu Instrumen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {instruments.map((item) => (
            <InstrumentCard key={item.slug} instrumen={item} />
          ))}
        </div>
      </div>
    </section>
  );
};
