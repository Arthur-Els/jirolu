# 🏛️ Jirolu — Museum Gamelan yang Bisa Kamu Mainkan

**Jirolu** adalah museum digital gamelan Jawa Tengah yang interaktif dan edukatif. Di Jirolu, pengunjung tidak hanya membaca filosofi dan fungsi alat musik karawitan, tetapi juga bisa **langsung memainkannya secara virtual** lewat keyboard atau layar sentuh ponsel dengan suara instan tanpa jeda (*zero latency*).

Nama **Jirolu** terinspirasi dari tiga nada pertama dalam tangga nada gamelan Jawa:
- **Ji** (nada 1)
- **Ro** (nada 2)
- **Lu** (nada 3)

---

## 🎵 Alat Musik yang Tersedia di Jirolu

1. **Saron (Kategori: Bernada)**
   - Mendukung **Laras Pelog** (7 nada: ji, ro, lu, pat, mo, nem, pi) dengan tombol keyboard `A, S, D, F, G, H, J`.
   - Mendukung **Laras Slendro** (5 nada: ji, ro, lu, mo, nem) dengan tombol keyboard `A, S, D, F, G`.
   - Fitur pergantian laras dengan peredaman suara halus (*fade out*).
   - Mendukung **Mode Belajar Lagu** interaktif.

2. **Bonang (Kategori: Bernada)**
   - Disusun dalam **2 baris pencon bundar**:
     - Baris Atas (nada tinggi): Tombol `Q, W, E, R, T, Y, U`
     - Baris Bawah (nada rendah): Tombol `A, S, D, F, G, H, J`
   - Mendukung laras **Pelog** (14 pencon) dan **Slendro** (10 pencon).
   - Mendukung **Mode Belajar Lagu** interaktif.

3. **Gong Ageng (Kategori: Bersuara)**
   - Menampilkan 3 gong besar dengan karakter suara berbeda:
     - **Gong Ageng** (tombol `2`): Dentuman paling dalam penutup siklus gongan.
     - **Gong Suwukan** (tombol `1`): Gong sedang pembagi kalimat lagu.
     - **Kempul** (tombol `3`): Gong gantung aksen yang cerah.
   - Dilengkapi efek animasi **gelombang riak emas melebar pelan** (*ripple effect*) dan durasi dengung panjang (3 - 5 detik). Jika gong yang sama dipukul lagi, suara lama dihentikan dengan cepat agar tidak bising.

4. **Kendang (Kategori: Bersuara / Ritmis)**
   - Menampilkan ilustrasi kendang interaktif dengan **4 area pukul utama**:
     - **Dung** (tombol `X`): Pukulan jari dalam sisi besar, bulat & bergaung.
     - **Dah / Bem** (tombol `Z`): Pukulan telapak tangan terbuka sisi besar, bass mantap.
     - **Tak** (tombol `V`): Pukulan redam telapak sisi kecil, kering & tegas.
     - **Tung / Tak-tak** (tombol `C`): Sentuhan lentik jari di tepi sisi kecil, tinggi & nyaring.
   - Dilengkapi kartu penjelasan karakter pukulan di bawah soundboard.

---

## 🎓 Mode Belajar Lagu (Saron & Bonang)

Pengunjung dapat belajar memainkan lagu tradisional secara bertahap:
1. Pilih tab **"Belajar Lagu"** di atas soundboard.
2. Pilih lagu dari daftar (misal: *Latihan Dasar Slendro*, *Lir-Ilir*, atau *Gundul-Gundul Pacul*).
3. Bilah nada berikutnya yang harus ditekan akan menyala dengan **cahaya emas berdenyut pelan**.
4. Tekan bilah tersebut. Jika benar, panduan melangkah ke nada berikutnya. Jika salah, bilah bergetar lembut tanpa menghentikan permainan.
5. Selesai bermain, sistem menampilkan pesan apresiasi dan jumlah salah tekan.

### Cara Menambah Lagu Baru:
1. Buat berkas JSON baru di folder `src/content/lagu/` (misalnya `suwe-ora-jamu.json`):
   ```json
   {
     "slug": "suwe-ora-jamu",
     "judul": "Suwe Ora Jamu",
     "laras": "pelog",
     "tingkat": "Mudah",
     "alat": ["saron", "bonang"],
     "deskripsi": "Tembang dolanan populer Jawa Tengah tentang kerinduan.",
     "asalDaerah": "Jawa Tengah",
     "nada": ["1", "2", "3", "5", "6", "5", "3"]
   }
   ```
2. Impor lagu tersebut di `src/lib/content.ts` dan masukkan ke dalam array `daftarLagu`.

---

## 🔴 Panel Rekam & Putar Ulang (Semua Alat Musik)

Tersedia di bawah soundboard seluruh instrumen:
- **Rekam**: Mencatat setiap ketukan nada/suara beserta jeda milidetiknya secara presisi (maksimal 60 detik).
- **Putar**: Memutar ulang permainan secara otomatis melalui Web Audio API dan bilah/pad yang berbunyi ikut menyala.
- **Berhenti**: Menghentikan perekaman atau membatalkan pemutaran seketika dengan fade-out halus.
- **Hapus**: Mengosongkan data rekaman saat ini.

---

## 🗂️ Struktur Folder Proyek

```
src/
├── app/
│   ├── layout.tsx, page.tsx, globals.css
│   ├── cara-bermain/page.tsx     <-- Panduan praktis bermain
│   ├── instrumen/[slug]/page.tsx <-- Halaman detail & soundboard
│   └── tentang/page.tsx         <-- Profil Jirolu & filosofi nama
├── components/
│   ├── belajar/                 <-- ModeBelajar, DaftarLagu, PanduanLagu
│   ├── rekam/                   <-- PanelRekaman
│   ├── soundboard/              <-- Soundboard, Bilah, PencuBonang, GongPad, KendangPad
│   ├── gallery/                 <-- GalleryGrid, InstrumentCard
│   ├── instrument/              <-- InfoPanel, OtherInstruments
│   └── ui/                      <-- Navbar, Footer, Button
├── content/
│   ├── instrumen/               <-- saron.json, bonang.json, gong.json, kendang.json
│   └── lagu/                    <-- latihan-dasar.json, lir-ilir.json, gundul-gundul-pacul.json
├── lib/
│   ├── audio/                   <-- audioEngine.ts, useAudioBuffers.ts, keyMaps.ts
│   ├── belajar/                 <-- useBelajarLagu.ts
│   ├── rekam/                   <-- useRekaman.ts
│   └── content.ts
└── types/
    ├── instrumen.ts
    └── lagu.ts
```

---

## 🚀 Cara Menjalankan Proyek

```bash
# 1. Pasang dependensi
npm install

# 2. Jalankan server lokal
npm run dev

# 3. Bangun situs statis siap saji
npm run build
```

Buka peramban di [http://localhost:3000](http://localhost:3000).
Hasil ekspor statis HTML murni tersimpan di folder `out/`.
