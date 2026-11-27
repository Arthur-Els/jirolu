"use client";

import React from "react";
import Link from "next/link";
import { HeroVideoBackground } from "@/components/ui/HeroVideoBackground";
import { useLanguage } from "@/lib/i18n/LanguageProvider";

export const CaraBermainClient: React.FC = () => {
  const { locale } = useLanguage();
  const isEn = locale === "en";

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
            <span>{isEn ? "Visitor Guide" : "Panduan Pengunjung"}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-gading tracking-tight">
            {isEn
              ? "How to Play Gamelan on Jirolu"
              : "Cara Memainkan Gamelan di Jirolu"}
          </h1>
          <div className="w-[25%] h-0.5 bg-emas mx-auto rounded-full my-3" />
          <p className="font-serif text-lg text-emas italic">
            {isEn
              ? "“Easy, zero-latency, and ready for anyone to try.”"
              : "“Gampang, tanpa delay, dan bisa dicoba siapa saja.”"}
          </p>
        </div>

        {/* Bagian 1: Bermain di HP vs Laptop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bermain di HP / Tablet */}
          <div className="p-6 rounded-3xl bg-arang/80 border border-perunggu/30 space-y-4 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emas/15 border border-emas/40 flex items-center justify-center text-emas">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="font-serif text-2xl font-bold text-gading">
                {isEn
                  ? "On Mobile & Tablet Screens"
                  : "Di Layar Ponsel & Tablet"}
              </h2>
            </div>
            <ul className="space-y-2.5 text-sm text-gading/80 font-light leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emas font-bold">•</span>
                {isEn ? (
                  <span>
                    <strong>Direct Touch:</strong> Tap the bronze keys,{" "}
                    <em>pencu</em> (raised bosses), gong, or <em>kendang</em>{" "}
                    <em>tebokan</em> (drumhead) areas directly with your
                    fingertips.
                  </span>
                ) : (
                  <span>
                    <strong>Sentuh Langsung:</strong> Ketuk bilah, pencon, gong,
                    atau area kendang langsung dengan ujung jarimu.
                  </span>
                )}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emas font-bold">•</span>
                {isEn ? (
                  <span>
                    <strong>Multi-Touch Support:</strong> Strike two or three
                    keys simultaneously (for example, paired notes or{" "}
                    <em>memathet</em> damping transitions on the saron).
                  </span>
                ) : (
                  <span>
                    <strong>Mendukung Multi-Touch:</strong> Kamu bisa menabuh
                    dua atau tiga bilah sekaligus bersamaan (misal teknik
                    kempyang di saron).
                  </span>
                )}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emas font-bold">•</span>
                {isEn ? (
                  <span>
                    <strong>Locked Play Area:</strong> The key pad includes
                    anti-zoom and anti-scroll behavior so playing stays
                    comfortable without the screen shifting.
                  </span>
                ) : (
                  <span>
                    <strong>Layar Aman:</strong> Area bilah dilengkapi fitur
                    anti-zoom dan anti-scroll sehingga bermain tetap nyaman
                    tanpa layar bergeser.
                  </span>
                )}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emas font-bold">•</span>
                {isEn ? (
                  <span>
                    <strong>iPhone / Safari Users:</strong> If sound does not
                    play yet, simply tap the{" "}
                    <em>&ldquo;Activate Audio&rdquo;</em> button above the keys.
                  </span>
                ) : (
                  <span>
                    <strong>Pengguna iPhone/Safari:</strong> Jika suara belum
                    keluar, cukup ketuk tombol{" "}
                    <em>&ldquo;Aktifkan Suara Audio&rdquo;</em> di atas bilah.
                  </span>
                )}
              </li>
            </ul>
          </div>

          {/* Bermain di Laptop / PC */}
          <div className="p-6 rounded-3xl bg-arang/80 border border-perunggu/30 space-y-4 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-perunggu/20 border border-perunggu/50 flex items-center justify-center text-emas">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h2 className="font-serif text-2xl font-bold text-gading">
                {isEn ? "On Laptop & Desktop" : "Di Laptop & Komputer"}
              </h2>
            </div>
            <ul className="space-y-2.5 text-sm text-gading/80 font-light leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-emas font-bold">•</span>
                {isEn ? (
                  <span>
                    <strong>Mouse Click:</strong> Click keys, bosses, and pads
                    directly with your cursor.
                  </span>
                ) : (
                  <span>
                    <strong>Klik Mouse:</strong> Kamu bisa mengklik bilah dan
                    tombol secara langsung.
                  </span>
                )}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emas font-bold">•</span>
                {isEn ? (
                  <span>
                    <strong>Use Your Keyboard:</strong> Press the letter and
                    number keys on your physical keyboard for the fastest,
                    lag-free response.
                  </span>
                ) : (
                  <span>
                    <strong>Gunakan Keyboard:</strong> Tekan tombol huruf dan
                    angka di keyboard fisik untuk respons tercepat tanpa
                    hambatan.
                  </span>
                )}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emas font-bold">•</span>
                {isEn ? (
                  <span>
                    <strong>Key Labels:</strong> Each key clearly displays its
                    keyboard shortcut so you never lose track.
                  </span>
                ) : (
                  <span>
                    <strong>Petunjuk Tuts:</strong> Huruf keyboard tertulis rapi
                    di setiap bilah agar kamu tidak bingung.
                  </span>
                )}
              </li>
            </ul>
          </div>
        </div>

        {/* Bagian 2: Tabel Pemetaan Tombol Keyboard Per Alat */}
        <section className="p-6 sm:p-8 rounded-3xl bg-arang/80 border border-perunggu/30 space-y-6 shadow-lg">
          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-bold text-gading flex items-center gap-2">
              <span>
                {isEn
                  ? "Computer Keyboard Key Mapping"
                  : "Daftar Tombol Keyboard Komputer"}
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-gading/65">
              {isEn
                ? "Here is the complete keyboard map for all four gamelan instruments in Jirolu:"
                : "Berikut peta tombol keyboard lengkap untuk keempat alat musik gamelan di Jirolu:"}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-perunggu/40 text-emas font-serif text-sm">
                  <th className="py-3 px-3">
                    {isEn ? "Instrument" : "Alat Musik"}
                  </th>
                  <th className="py-3 px-3">
                    {isEn ? "Laras (Scale) / Mode" : "Laras / Mode"}
                  </th>
                  <th className="py-3 px-3">
                    {isEn ? "Keyboard Keys" : "Tombol Keyboard"}
                  </th>
                  <th className="py-3 px-3">
                    {isEn ? "Notes / Sound Character" : "Nada / Karakter Suara"}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-perunggu/20 text-gading/85">
                <tr>
                  <td className="py-3 px-3 font-semibold text-gading">Saron</td>
                  <td className="py-3 px-3">Pelog</td>
                  <td className="py-3 px-3 font-mono font-bold text-emas">
                    1 2 3 4 5 6 7
                  </td>
                  <td className="py-3 px-3">
                    {isEn
                      ? "Notes 1–7 (Ji-Ro-Lu: ji, ro, lu, pat, mo, nem, pi)"
                      : "Nada 1 - 7 (ji, ro, lu, pat, mo, nem, pi)"}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-gading">Saron</td>
                  <td className="py-3 px-3">Slendro</td>
                  <td className="py-3 px-3 font-mono font-bold text-emas">
                    1 2 3 5 6
                  </td>
                  <td className="py-3 px-3">
                    {isEn
                      ? "Notes 1, 2, 3, 5, 6 (ji, ro, lu, mo, nem)"
                      : "Nada 1, 2, 3, 5, 6 (ji, ro, lu, mo, nem)"}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-gading">
                    Bonang
                  </td>
                  <td className="py-3 px-3">
                    {isEn ? "Top Row (High)" : "Baris Atas (Tinggi)"}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emas">
                    Q W E R T Y U
                  </td>
                  <td className="py-3 px-3">
                    {isEn
                      ? "Upper-octave pencu (raised bronze kettles)"
                      : "Oktaf tinggi pencon"}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-gading">
                    Bonang
                  </td>
                  <td className="py-3 px-3">
                    {isEn ? "Bottom Row (Low)" : "Baris Bawah (Rendah)"}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emas">
                    A S D F G H J
                  </td>
                  <td className="py-3 px-3">
                    {isEn
                      ? "Lower-octave pencu (raised bronze kettles)"
                      : "Oktaf rendah pencon"}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-gading">
                    Gong Ageng
                  </td>
                  <td className="py-3 px-3">{isEn ? "3 Gongs" : "3 Gong"}</td>
                  <td className="py-3 px-3 font-mono font-bold text-emas">
                    1, 2, 3
                  </td>
                  <td className="py-3 px-3">
                    {isEn
                      ? "1 = Gong Ageng (hung on the gayor frame to mark a gongan cycle), 2 = Gong Suwukan, 3 = Kempul"
                      : "1 = Gong Ageng, 2 = Gong Suwukan, 3 = Kempul"}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-3 font-semibold text-gading">
                    Kendang
                  </td>
                  <td className="py-3 px-3">
                    {isEn ? "4 Hand Strikes" : "4 Pukulan Tangan"}
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-emas">
                    Z, X, C, V
                  </td>
                  <td className="py-3 px-3">
                    {isEn
                      ? "Z = Dung (deep tebokan drumhead bass), X = Tak (crisp slap), C = Tung (open mid tone), V = Dah / Bem (resonant low strike)"
                      : "Z = Dung, X = Tak, C = Tung, V = Dah / Bem"}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Bagian 3: Mengenal Laras Slendro & Pelog */}
        <section className="p-6 sm:p-8 rounded-3xl bg-arang/80 border border-perunggu/30 space-y-4 shadow-lg">
          <h2 className="font-serif text-2xl font-bold text-gading">
            {isEn
              ? "Understanding Laras (Tuning Scales): Slendro & Pelog"
              : "Mengenal Laras: Slendro & Pelog"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-perunggu/20 text-sm text-gading/80 font-light leading-relaxed">
            <div className="pb-4 md:pb-0 md:pr-6 space-y-2">
              <h3 className="font-serif text-lg font-bold text-emas">
                {isEn
                  ? "Laras Slendro (5 Notes)"
                  : "Laras Slendro (5 Nada)"}
              </h3>
              <p>
                {isEn ? (
                  <>
                    A pentatonic tuning scale with relatively even intervals
                    between pitches. It consists of 5 notes in the{" "}
                    <strong>Ji-Ro-Lu</strong> notation:{" "}
                    <strong>
                      1 (ji), 2 (ro), 3 (lu), 5 (mo), and 6 (nem)
                    </strong>
                    . Its character feels bright, lively, spirited, and direct.
                  </>
                ) : (
                  <>
                    Tangga nada pentatonis dengan pembagian interval nada yang
                    relatif merata. Terdiri atas 5 nada:{" "}
                    <strong>
                      1 (ji), 2 (ro), 3 (lu), 5 (mo), dan 6 (nem)
                    </strong>
                    . Nuansanya terasa riang, lincah, bersemangat, dan lugas.
                  </>
                )}
              </p>
            </div>
            <div className="pt-4 md:pt-0 md:pl-6 space-y-2">
              <h3 className="font-serif text-lg font-bold text-emas">
                {isEn ? "Laras Pelog (7 Notes)" : "Laras Pelog"}
              </h3>
              <p>
                {isEn ? (
                  <>
                    A heptatonic tuning scale with asymmetrical intervals
                    (alternating wide and narrow steps). It comprises 7 notes:{" "}
                    <strong>
                      1 (ji), 2 (ro), 3 (lu), 4 (pat), 5 (mo), 6 (nem), and 7
                      (pi)
                    </strong>
                    . Its mood feels majestic, contemplative, solemn, and
                    dignified.
                  </>
                ) : (
                  <>
                    Tangga nada heptatonis dengan rentang jarak nada yang
                    berbeda-beda (ada yang renggang dan sempit). Terdiri atas 7
                    nada: <strong>1, 2, 3, 4, 5, 6, dan 7</strong>. Nuansanya
                    agung, syahdu, khidmat, dan penuh wibawa.
                  </>
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Bagian 4: Fitur Mode Belajar & Rekaman */}
        <section className="p-6 sm:p-8 rounded-3xl bg-arang/80 border border-perunggu/30 space-y-4 shadow-lg">
          <h2 className="font-serif text-2xl font-bold text-gading">
            {isEn
              ? "Learn Mode & Recording Features"
              : "Fitur Mode Belajar dan Rekam"}
          </h2>
          <div className="divide-y divide-perunggu/20 text-sm text-gading/80 leading-relaxed font-light">
            <div className="pb-4 space-y-1.5">
              <h3 className="font-serif text-base font-bold text-emas">
                {isEn
                  ? "1. Song Learn Mode (Saron & Bonang)"
                  : "1. Mode Belajar Lagu (Saron dan Bonang)"}
              </h3>
              <p>
                {isEn ? (
                  <>
                    Select the <strong>&ldquo;Learn Song&rdquo;</strong>{" "}
                    tab above the soundboard and choose a piece to practice. The
                    next key you need to strike lights up with a{" "}
                    <em>pulsing golden glow</em>. If you strike the wrong key,
                    it gently shakes without stopping your session. There is no
                    time limit, so you can learn comfortably at your own pace!
                  </>
                ) : (
                  <>
                    Pilih tab <strong>&ldquo;Belajar Lagu&rdquo;</strong> di
                    atas soundboard. Pilih lagu yang ingin kamu pelajari. Bilah
                    nada yang harus kamu tekan berikutnya akan menyala dengan{" "}
                    <em>pendar emas berdenyut</em>. Jika salah menekan, bilah
                    akan bergetar lembut tanpa menghentikan permainan. Tidak ada
                    batasan waktu, kamu bisa belajar dengan santai!
                  </>
                )}
              </p>
            </div>

            <div className="pt-4 space-y-1.5">
              <h3 className="font-serif text-base font-bold text-emas">
                {isEn
                  ? "2. Record & Playback Panel"
                  : "2. Panel Rekam dan Putar Ulang"}
              </h3>
              <p>
                {isEn ? (
                  <>
                    Use the panel below the soundboard. Click{" "}
                    <strong>&ldquo;Record&rdquo;</strong> and play your
                    instrument. When finished, click{" "}
                    <strong>&ldquo;Stop&rdquo;</strong> and listen back to your
                    performance by pressing <strong>&ldquo;Play&rdquo;</strong>.
                    During playback, the keys light up automatically in sync
                    with your recorded beat!
                  </>
                ) : (
                  <>
                    Gunakan panel di bawah soundboard. Klik{" "}
                    <strong>&ldquo;Rekam&rdquo;</strong> lalu mainkan alat
                    musikmu. Setelah selesai, klik{" "}
                    <strong>&ldquo;Berhenti&rdquo;</strong> dan dengarkan
                    kembali kreasimu dengan menekan{" "}
                    <strong>&ldquo;Putar&rdquo;</strong>. Saat diputar ulang,
                    bilah akan otomatis menyala mengikuti ketukan rekamanmu!
                  </>
                )}
              </p>
            </div>
          </div>
        </section>

        {/* Tombol Aksi Coba Sekarang */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/instrumen/saron"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-accent hover:bg-accent-2 text-accent-ink font-semibold text-[15px] motion-safe:transition-colors duration-150 flex items-center justify-center min-h-[48px] focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 motion-safe:active:scale-95"
          >
            {isEn ? "Start Playing Saron" : "Mulai Mainkan Saron"}
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-paper-2 hover:bg-paper-3 text-ink border border-rule font-medium text-[15px] motion-safe:transition-colors duration-150 flex items-center justify-center min-h-[48px] focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 motion-safe:active:scale-95"
          >
            {isEn ? "Back to Home" : "Kembali ke Beranda"}
          </Link>
        </div>
      </div>
    </div>
  );
};
