/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mode export statis sesuai instruksi
  output: 'export',
  // Nonaktifkan optimasi gambar server bawaan Next.js untuk mendukung static export HTML
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
