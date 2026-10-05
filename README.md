# 🏛️ Museum Digital Gamelan Jawa Tengah

Selamat datang di repositori **Museum Digital Gamelan Jawa Tengah**! Proyek ini adalah museum interaktif berbasis web untuk menjelajahi keindahan estetika, nilai filosofis mendalam, serta memainkan ragam alat musik gamelan Jawa secara virtual dengan suara instan tanpa jeda (*zero latency*).

Dibuat menggunakan pendekatan **Modern-Etnik** yang elegan, bersih, dan berwibawa, memadukan tradisi karawitan Jawa dengan teknologi web modern.

---

## 🛠️ Teknologi yang Digunakan (*Tech Stack*)

- **Next.js (App Router)**: Framework modern React dengan fitur *Static Export* (`output: 'export'`) sehingga web dapat di-hosting di mana saja tanpa server backend.
- **TypeScript**: Menjaga kejelasan struktur data dan mencegah kesalahan kode (*bug-free*).
- **Tailwind CSS**: Pengaturan gaya tampilan yang rapi dan konsisten dengan palet warna etnik khusus (Tinta, Arang, Emas, Perunggu, Gading).
- **Web Audio API**: Pemrosesan suara murni dari browser langsung ke kartu suara komputer/ponsel. **Bukan** tag `<audio>` biasa, sehingga mendukung pukulan cepat berulang (*polyphony*), *multi-touch*, dan tanpa *lag*.
- **Framer Motion**: Menghadirkan animasi halus pendar keemasan pada bilah saat ditabuh.

---

## 🚀 Cara Menjalankan Proyek di Komputer Lokal

### 1. Prasyarat
Pastikan komputer kamu sudah terpasang **Node.js** (versi 18 atau lebih baru).

### 2. Pemasangan (*Install Dependencies*)
Buka terminal/PowerShell di folder proyek ini (`jirolu`), lalu jalankan:
```bash
npm install
```

### 3. Menjalankan Server Pengembangan (*Development*)
Untuk melihat website berjalan di browser kamu:
```bash
npm run dev
```
Buka browser dan kunjungi alamat: [http://localhost:3000](http://localhost:3000).

### 4. Membangun Situs Statis (*Production Build*)
Untuk menguji hasil ekspor situs statis akhir sebelum disebarkan:
```bash
npm run build
```
Hasil siap saji akan berada di folder `out/`.

---

## 🎹 Cara Memainkan Soundboard Virtual

1. Buka halaman instrumen (misalnya **/instrumen/saron**).
2. **Di Laptop / Komputer**:
   - Tekan tombol keyboard:
     - `A` = Nada 1 (Ji)
     - `S` = Nada 2 (Ro)
     - `D` = Nada 3 (Lu)
     - `F` = Nada 4 (Pat)
     - `G` = Nada 5 (Mo)
     - `H` = Nada 6 (Nem)
     - `J` = Nada 7 (Pi)
   - Atau klik bilah langsung menggunakan mouse.
3. **Di Ponsel / Tablet**:
   - Sentuh bilah nada perunggu langsung di layar.
   - Mendukung **multi-touch** (kamu bisa memukul dua atau tiga bilah sekaligus dengan beberapa jari).
   - Layar tidak akan *scroll* atau *zoom* secara tidak sengaja karena sudah dilengkapi fitur `touch-action: none`.
4. **Catatan Safari / iPhone**:
   - Browser seluler membatasi suara otomatis sebelum ada interaksi. Klik tombol **"Aktifkan Suara Audio"** atau langsung sentuh bilah pertama kali untuk membuka kunci audio.

---

## 📂 Panduan Menaruh File Aset (Audio & Gambar)

Jika kamu sudah merekam nada gamelan asli dalam format `.webm` berkualitas tinggi, kamu cukup memasukkan file-file tersebut ke folder berikut:

```
public/
├── audio/
│   ├── saron/
│   │   ├── pelog/       <-- Letakkan file: 1.webm, 2.webm, 3.webm, 4.webm, 5.webm, 6.webm, 7.webm
│   │   └── slendro/     <-- (Untuk Fase 2) Letakkan nada slendro: 1.webm, 2.webm, 3.webm, 5.webm, 6.webm
│   ├── bonang/          <-- (Untuk Fase 2)
│   ├── gong/            <-- (Untuk Fase 2)
│   └── kendang/         <-- (Untuk Fase 2)
└── images/
    └── instrumen/       <-- Foto alat musik: saron.webp, bonang.webp, gong.webp, kendang.webp
```

> **💡 Catatan Ramah:**  
> Jika file `.webm` rekaman asli belum kamu masukkan, kamu **tidak perlu khawatir!** Sistem kami secara otomatis mengaktifkan **Audio Synthesizer Perunggu Internal** berbasis frekuensi nada gamelan Pelog asli, sehingga kamu tetap bisa mendengar suara denting gamelan secara langsung.

---

## ➕ Cara Menambah Alat Musik Baru

Struktur proyek ini dirancang sangat modular dan mudah dikembangkan tanpa database:

1. **Buat file data JSON baru** di folder `src/content/instrumen/` (contoh: `demung.json`):
   ```json
   {
     "slug": "demung",
     "nama": "Demung",
     "namaJawa": "ꦢꦼꦩꦸꦁ",
     "deskripsiSingkat": "Instrumen balungan dengan oktaf lebih rendah dari saron.",
     "fungsi": "Menegaskan balungan dengan nada rendah berwibawa.",
     "filosofi": "Melambangkan ketenangan jiwa yang berakar kuat.",
     "gambar": "/images/instrumen/demung.webp",
     "larasDefault": "pelog",
     "tersediaDiFase": 1,
     "laras": {
       "pelog": [
         { "nada": "1", "label": "ji", "audio": "/audio/demung/pelog/1.webm", "key": "a", "frekuensi": 140 }
       ]
     }
   }
   ```
2. **Daftarkan di `src/lib/content.ts`**:
   - Impor `demungData from "@/content/instrumen/demung.json"`.
   - Masukkan ke array `daftarInstrumen`.
3. **Sediakan gambar**: Taruh gambar `demung.webp` di folder `public/images/instrumen/`.
4. Halaman `/instrumen/demung` dan kartunya di Galeri Beranda akan otomatis dibuat oleh Next.js!

---

## 🌐 Cara Deploy ke Vercel

Aplikasi ini sudah dioptimalkan dengan konfigurasi statis (`output: 'export'`) sehingga proses *deployment* di Vercel sangat cepat dan gratis:

1. Unggah kode ke repositori **GitHub** kamu.
2. Masuk ke dasbor [Vercel](https://vercel.com) dan pilih **"Add New Project"**.
3. Hubungkan repositori GitHub proyek ini.
4. Pada bagian pengaturan *Build & Output Settings*, Vercel akan otomatis mengenali Next.js:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `out`
5. Klik **"Deploy"**! Dalam 1-2 menit, situs Museum Digital Gamelan kamu sudah online dan bisa diakses publik di seluruh dunia.

---

## 🌿 Filosofi Karawitan Jawa

> *"Laras, Raras, Rancak"*  
> Keselarasan nada, keindahan rasa, dan keteraturan hidup dalam harmoni alam semesta.
