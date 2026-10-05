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

2. **Bonang (Kategori: Bernada)**
   - Disusun dalam **2 baris pencon bundar**:
     - Baris Atas (nada tinggi): Tombol `Q, W, E, R, T, Y, U`
     - Baris Bawah (nada rendah): Tombol `A, S, D, F, G, H, J`
   - Mendukung laras **Pelog** (14 pencon) dan **Slendro** (10 pencon).

3. **Gong Ageng (Kategori: Bersuara)**
   - Menampilkan 3 gong besar dengan karakter suara berbeda:
     - **Gong Ageng** (tombol `1`): Dentuman paling dalam penutup siklus gongan.
     - **Gong Suwukan** (tombol `2`): Gong sedang pembagi kalimat lagu.
     - **Kempul** (tombol `3`): Gong gantung aksen yang cerah.
   - Dilengkapi efek animasi **gelombang riak emas melebar pelan** (*ripple effect*) dan durasi dengung panjang (3 - 5 detik). Jika gong yang sama dipukul lagi, suara lama dihentikan dengan cepat agar tidak bising.

4. **Kendang (Kategori: Bersuara / Ritmis)**
   - Menampilkan ilustrasi kendang interaktif dengan **4 area pukul utama**:
     - **Dung** (tombol `Z`): Pukulan jari dalam sisi besar, bulat & bergaung.
     - **Dah / Bem** (tombol `V`): Pukulan telapak tangan terbuka sisi besar, bass mantap.
     - **Tak** (tombol `X`): Pukulan redam telapak sisi kecil, kering & tegas.
     - **Tung / Tak-tak** (tombol `C`): Sentuhan lentik jari di tepi sisi kecil, tinggi & nyaring.
   - Dilengkapi kartu penjelasan karakter pukulan di bawah soundboard.

---

## 🎛️ Fitur Tambahan Soundboard

- **Slider Volume & Tombol Bisu (Mute)** di semua soundboard.
- **Kartu "Alat Musik Lainnya"** di bagian bawah halaman tiap instrumen untuk memudahkan navigasi antar-koleksi.
- **Audio Synthesizer Cadangan**: Jika berkas audio `.webm` belum diisi, Jirolu otomatis mensintesis suara nada perunggu, dentuman gong sub-bass, dan membran kendang sehingga web tetap berbunyi merdu tanpa error.

---

## 🚀 Cara Menjalankan Proyek

### 1. Pemasangan (*Install*)
```bash
npm install
```

### 2. Jalankan Server Dev (*Localhost*)
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).

### 3. Build Static Export (Siap Deploy)
```bash
npm run build
```
Hasil siap saji akan diekspor ke folder `out/`.

---

## 🖼️ Cara Mengganti Gambar Placeholder dengan Foto Asli

Jirolu telah menyediakan gambar SVG placeholder etnik yang elegan di `public/images/instrumen/`. Jika kamu sudah memiliki foto asli alat musik, ikuti langkah mudah ini **tanpa perlu mengubah kode komponen**:

1. Letakkan file fotomu (misal format `.webp`, `.jpg`, atau `.png`) di folder:
   ```
   public/images/instrumen/
   ```
2. Buka file JSON instrumen terkait di folder `src/content/instrumen/`:
   - `saron.json`
   - `bonang.json`
   - `gong.json`
   - `kendang.json`
3. Cukup ubah nilai field `"gambar"` ke nama file fotomu, contoh:
   ```json
   "gambar": "/images/instrumen/bonang_asli.webp"
   ```
4. Simpan, dan foto barumu otomatis tampil di Galeri Beranda, Halaman Detail, dan Kartu Koleksi Lainnya!

---

## 📂 Daftar Lengkap File Audio yang Perlu Disiapkan

Jika kamu ingin merekam suara gamelan asli dalam format `.webm`, berikut panduan struktur folder dan nama file persisnya:

```
public/audio/
├── saron/
│   ├── pelog/
│   │   ├── 1.webm  (nada ji)
│   │   ├── 2.webm  (nada ro)
│   │   ├── 3.webm  (nada lu)
│   │   ├── 4.webm  (nada pat)
│   │   ├── 5.webm  (nada mo)
│   │   ├── 6.webm  (nada nem)
│   │   └── 7.webm  (nada pi)
│   └── slendro/
│       ├── 1.webm  (nada ji)
│       ├── 2.webm  (nada ro)
│       ├── 3.webm  (nada lu)
│       ├── 5.webm  (nada mo)
│       └── 6.webm  (nada nem)
│
├── bonang/
│   ├── pelog/
│   │   ├── 1_hi.webm s/d 7_hi.webm (baris atas)
│   │   └── 1.webm s/d 7.webm       (baris bawah)
│   └── slendro/
│       ├── 1_hi.webm s/d 6_hi.webm (baris atas)
│       └── 1.webm s/d 6.webm       (baris bawah)
│
├── gong/
│   ├── gong_ageng.webm
│   ├── gong_suwukan.webm
│   └── kempul.webm
│
└── kendang/
    ├── dung.webm
    ├── tak.webm
    ├── tung.webm
    └── dah.webm
```

---

## ➕ Cara Menambah Alat Musik Baru

1. Buat file JSON baru di `src/content/instrumen/` (pilih kategori `"bernada"` atau `"bersuara"`).
2. Daftarkan di `src/lib/content.ts` pada array `daftarInstrumen`.
3. Sediakan gambar di `public/images/instrumen/`.
4. Halaman `/instrumen/[slug]` dan kartu galeri akan terbuat otomatis!

---

## 🌐 Cara Deploy ke Vercel

1. Push kode ke repositori GitHub kamu.
2. Impor proyek di [Vercel](https://vercel.com).
3. Vercel akan otomatis mengenali konfigurasi:
   - Build Command: `npm run build`
   - Output Directory: `out`
4. Klik **Deploy** dan situs Jirolu akan online dalam sekejap!
