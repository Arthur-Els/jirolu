import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { HeroVideoBackground } from "@/components/ui/HeroVideoBackground";

export const metadata: Metadata = {
  title: "Cara Bermain Gamelan di Jirolu | Panduan Interaktif",
  description:
    "Panduan praktis bermain gamelan secara virtual di Jirolu melalui ponsel atau keyboard laptop, mengenal laras Slendro & Pelog, serta fitur rekam dan mode belajar.",
};

export default function CaraBermainPage() {
  return (
    <div className="relative w-full min-h-screen">
      {/* Background Video Fixed (Tetap diam di posisi viewport saat halaman di-scroll) */}
      <HeroVideoBackground src="/background/bg-home.mp4" isFixed={true} />

      {/* Konten Halaman Cara Bermain (Scroll di atas background video) */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 pt-28 sm:pt-36 pb-16 space-y-12">
        {/* Header Panduan */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 text-emas text-xs uppercase tracking-widest font-medium">
            <span>ꦠꦸꦠꦸꦂꦥꦤꦸꦢꦸꦃ</span>
            <span>•</span>
            <span>Panduan Pengunjung</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-gading tracking-tight">
            Cara Memainkan Gamelan di Jirolu
          </h1>
          <div className="w-[25%] h-0.5 bg-emas mx-auto rounded-full my-3" />
          <p className="font-serif text-lg text-emas italic">
            &ldquo;Gampang, tanpa delay, dan bisa dicoba siapa saja.&rdquo;
          </p>
        </div>

        {/* Bagian 1: Bermain di HP vs Laptop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bermain di HP / Tablet */}
          <div className="p-6 rounded-2xl bg-arang/80 border border-perunggu/30 space-y-4 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emas/15 border border-emas/40 flex items-center justify-center text-emas">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="font-serif text-2xl font-bold text-gading">
                Di Layar Ponsel & Tablet
              </h2>
            </div>
            <ul className="space-y-2.5 text-sm text-gading/80 font-light leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emas font-bold">•</span>
                <span><strong>Sentuh Langsung:</strong> Ketuk bilah, pencon, gong, atau area kendang langsung dengan ujung jarimu.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emas font-bold">•</span>
                <span><strong>Mendukung Multi-Touch:</strong> Kamu bisa menabuh dua atau tiga bilah sekaligus bersamaan (misal teknik kempyang di saron).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emas font-bold">•</span>
                <span><strong>Layar Aman:</strong> Area bilah dilengkapi fitur anti-zoom dan anti-scroll sehingga bermain tetap nyaman tanpa layar bergeser.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emas font-bold">•</span>
                <span><strong>Pengguna iPhone/Safari:</strong> Jika suara belum keluar, cukup ketuk tombol <em>&ldquo;Aktifkan Suara Audio&rdquo;</em> di atas bilah.</span>
              </li>
            </ul>
          </div>

          {/* Bermain di Laptop / PC */}
          <div className="p-6 rounded-2xl bg-arang/80 border border-perunggu/30 space-y-4 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-perunggu/20 border border-perunggu/50 flex items-center justify-center text-emas">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="font-serif text-2xl font-bold text-gading">
                Di Laptop & Komputer
              </h2>
            </div>
            <ul className="space-y-2.5 text-sm text-gading/80 font-light leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emas font-bold">•</span>
                <span><strong>Klik Mouse:</strong> Kamu bisa mengklik bilah dan tombol secara langsung.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emas font-bold">•</span>
                <span><strong>Gunakan Keyboard:</strong> Tekan tombol huruf dan angka di keyboard fisik untuk respons tercepat tanpa hambatan.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emas font-bold">•</span>
                <span><strong>Petunjuk Tuts:</strong> Huruf keyboard tertulis rapi di setiap bilah agar kamu tidak bingung.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bagian 2: Tabel Pemetaan Tombol Keyboard Per Alat */}
        <section className="p-6 sm:p-8 rounded-2xl bg-arang/80 border border-perunggu/30 space-y-6 shadow-lg">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-bold text-gading flex items-center gap-2">
              <span>Daftar Tombol Keyboard Komputer</span>
            </h2>
            <p className="text-xs sm:text-sm text-gading/65">
              Berikut peta tombol keyboard lengkap untuk keempat alat musik gamelan di Jirolu:
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-perunggu/40 text-emas font-serif text-sm">
                  <th className="py-3 px-3">Alat Musik</th>
                  <th className="py-3 px-3">Laras / Mode</th>
                  <th className="py-3 px-3">Tombol Keyboard</th>
                  <th className="py-3 px-3">Nada / Karakter Suara</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-perunggu/20 text-gading/85">
                <tr>
                  <td className="py-3 px-3 font-semibold text-gading">Saron</td>
                  <td className="py-3 px-3">Pelog</td>
                  <td className="py-3 px-3 font-mono font-bold text-emas">1 2 3 4 5 6 7</td>
                  <td className="py-3 px-3">Nada 1 - 7 (ji, ro, lu, pat, mo, nem, pi)</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-gading">Saron</td>
                  <td className="py-3 px-3">Slendro</td>
                  <td className="py-3 px-3 font-mono font-bold text-emas">1 2 3 5 6</td>
                  <td className="py-3 px-3">Nada 1, 2, 3, 5, 6 (ji, ro, lu, mo, nem)</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-gading">Bonang</td>
                  <td className="py-3 px-3">Baris Atas (Tinggi)</td>
                  <td className="py-3 px-3 font-mono font-bold text-emas">Q W E R T Y U</td>
                  <td className="py-3 px-3">Oktaf tinggi pencon</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-gading">Bonang</td>
                  <td className="py-3 px-3">Baris Bawah (Rendah)</td>
                  <td className="py-3 px-3 font-mono font-bold text-emas">A S D F G H J</td>
                  <td className="py-3 px-3">Oktaf rendah pencon</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-gading">Gong Ageng</td>
                  <td className="py-3 px-3">3 Gong</td>
                  <td className="py-3 px-3 font-mono font-bold text-emas">1, 2, 3</td>
                  <td className="py-3 px-3">1 = Gong Ageng, 2 = Gong Suwukan, 3 = Kempul</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-gading">Kendang</td>
                  <td className="py-3 px-3">4 Pukulan Tangan</td>
                  <td className="py-3 px-3 font-mono font-bold text-emas">Z, X, C, V</td>
                  <td className="py-3 px-3">Z = Dung, X = Tak, C = Tung, V = Dah / Bem</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Bagian 3: Mengenal Laras Slendro & Pelog */}
        <section className="p-6 sm:p-8 rounded-2xl bg-arang/80 border border-perunggu/30 space-y-4 shadow-lg">
          <h2 className="font-serif text-2xl font-bold text-gading">
            Mengenal Laras: Slendro & Pelog
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gading/80 font-light leading-relaxed">
            <div className="p-4 rounded-xl bg-tinta/60 border border-perunggu/25 space-y-2">
              <h3 className="font-serif text-lg font-bold text-emas">Laras Slendro (5 Nada)</h3>
              <p>
                Tangga nada pentatonis dengan pembagian interval nada yang relatif merata.
                Terdiri atas 5 nada: <strong>1 (ji), 2 (ro), 3 (lu), 5 (mo), dan 6 (nem)</strong>.
                Nuansanya terasa riang, lincah, bersemangat, dan lugas.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-tinta/60 border border-perunggu/25 space-y-2">
              <h3 className="font-serif text-lg font-bold text-emas">Laras Pelog</h3>
              <p>
                Tangga nada heptatonis dengan rentang jarak nada yang berbeda-beda (ada yang renggang dan sempit).
                Terdiri atas 7 nada: <strong>1, 2, 3, 4, 5, 6, dan 7</strong>.
                Nuansanya agung, syahdu, khidmat, dan penuh wibawa.
              </p>
            </div>
          </div>
        </section>

        {/* Bagian 4: Fitur Mode Belajar & Rekaman */}
        <section className="p-6 sm:p-8 rounded-2xl bg-arang/80 border border-perunggu/30 space-y-4 shadow-lg">
          <h2 className="font-serif text-2xl font-bold text-gading">
            Fitur Mode Belajar dan Rekam
          </h2>
          <div className="space-y-4 text-sm text-gading/80 leading-relaxed font-light">
            <div className="p-4 rounded-xl bg-tinta/60 border border-perunggu/25 space-y-1.5">
              <h3 className="font-serif text-base font-bold text-emas">1. Mode Belajar Lagu (Saron dan Bonang)</h3>
              <p>
                Pilih tab <strong>&ldquo;Belajar Lagu&rdquo;</strong> di atas soundboard. Pilih lagu yang ingin kamu pelajari.
                Bilah nada yang harus kamu tekan berikutnya akan menyala dengan <em>pendar emas berdenyut</em>.
                Jika salah menekan, bilah akan bergetar lembut tanpa menghentikan permainan. Tidak ada batasan waktu, kamu bisa belajar dengan santai!
              </p>
            </div>

            <div className="p-4 rounded-xl bg-tinta/60 border border-perunggu/25 space-y-1.5">
              <h3 className="font-serif text-base font-bold text-emas">2. Panel Rekam dan Putar Ulang</h3>
              <p>
                Gunakan panel di bawah soundboard. Klik <strong>&ldquo;Rekam&rdquo;</strong> lalu mainkan alat musikmu.
                Setelah selesai, klik <strong>&ldquo;Berhenti&rdquo;</strong> dan dengarkan kembali kreasimu dengan menekan <strong>&ldquo;Putar&rdquo;</strong>.
                Saat diputar ulang, bilah akan otomatis menyala mengikuti ketukan rekamanmu!
              </p>
            </div>
          </div>
        </section>

        {/* Tombol Aksi Coba Sekarang */}
        <div className="text-center pt-4">
          <Link
            href="/instrumen/saron"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-accent hover:bg-accent-2 text-accent-ink font-semibold text-[15px] motion-safe:transition-colors duration-150 min-h-[48px] focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 motion-safe:active:scale-95"
          >
            <span>Coba Mainkan Saron Sekarang</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
