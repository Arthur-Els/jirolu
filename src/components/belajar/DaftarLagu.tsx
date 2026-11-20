import React from "react";
import { Lagu } from "@/types/lagu";

interface DaftarLaguProps {
  songs: Lagu[];
  onSelectSong: (song: Lagu) => void;
}

export const DaftarLagu: React.FC<DaftarLaguProps> = ({ songs, onSelectSong }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-serif text-lg font-bold text-gading flex items-center gap-2">
          <span>Pilih Lagu untuk Dipelajari</span>
        </h4>
        <span className="text-xs text-gading/60 font-sans">
          {songs.length} lagu tersedia
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {songs.map((song) => (
          <button
            key={song.slug}
            type="button"
            onClick={() => onSelectSong(song)}
            className="group text-left p-4 rounded-xl bg-tinta/80 border border-perunggu/30 hover:border-emas hover:bg-arang/90 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emas/50 flex flex-col justify-between gap-3 min-h-[44px]"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-serif text-base font-bold text-gading group-hover:text-emas transition-colors line-clamp-1">
                  {song.judul}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emas/15 text-emas uppercase tracking-wider shrink-0">
                  {song.tingkat}
                </span>
              </div>
              <p className="text-xs text-gading/65 line-clamp-2 leading-relaxed">
                {song.deskripsi || "Pelajari urutan nada gamelan secara bertahap."}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-perunggu/20 text-[11px] text-gading/50">
              <span className="capitalize text-emas-muda">
                Laras: {song.laras}
              </span>
              <span>{song.nada.length} nada</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
