export interface TeamMember {
  id: string;
  nomor: string;
  nama: string;
  inisial: string;
  jabatan: string;
  kontribusi: string;
  /** Opsional: isi dengan path gambar di /public/images/tim/... saat foto profil tersedia */
  avatar?: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: "arthur",
    nomor: "01",
    nama: "Arthur",
    inisial: "A",
    jabatan: "Project Lead & Lead Web Developer",
    kontribusi:
      "Memimpin arah pengembangan Jirolu sekaligus membangun arsitektur web utama, mesin simulasi audio berbasis Web Audio API, dan integrasi seluruh halaman instrumen gamelan.",
  },
  {
    id: "gevin",
    nomor: "02",
    nama: "Gevin",
    inisial: "G",
    jabatan: "Web Developer",
    kontribusi:
      "Mendukung pengembangan antarmuka web, implementasi komponen halaman, serta penyempurnaan detail teknis dan responsivitas agar Jirolu berjalan nyaman di berbagai ukuran layar.",
  },
  {
    id: "fakirah",
    nomor: "03",
    nama: "Fakirah",
    inisial: "F",
    jabatan: "UI/UX Designer",
    kontribusi:
      "Merancang identitas visual, komposisi antarmuka, dan pengalaman pengguna yang memadukan suasana museum karawitan Jawa dengan interaksi web yang hangat dan mudah dijelajahi.",
  },
  {
    id: "alvano",
    nomor: "04",
    nama: "Alvano",
    inisial: "A",
    jabatan: "System Analyst & Information Architect",
    kontribusi:
      "Menyusun alur perjalanan pengguna, struktur navigasi, serta pemetaan sistem agar alur belajar dan bermain gamelan dari beranda hingga tiap instrumen terasa runtut.",
  },
];
