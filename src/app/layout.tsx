import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

// Inisialisasi Google Fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gamelan-jawatengah.web.id"),
  title: "Museum Digital Gamelan Jawa Tengah | Pameran & Soundboard Virtual",
  description:
    "Eksplorasi warisan adiluhung gamelan Jawa Tengah secara interaktif. Dengarkan denting Saron, Bonang, Gong, dan Kendang, serta selami filosofi luhur karawitan Nusantara.",
  keywords: [
    "gamelan jawa",
    "gamelan jawa tengah",
    "museum gamelan",
    "saron virtual",
    "soundboard gamelan",
    "alat musik tradisional",
    "karawitan",
  ],
  authors: [{ name: "Museum Digital Gamelan Jawa Tengah" }],
  openGraph: {
    title: "Museum Digital Gamelan Jawa Tengah",
    description:
      "Museum digital interaktif: pelajari filosofi dan mainkan alat musik gamelan Jawa secara virtual tanpa jeda suara.",
    url: "https://gamelan-jawatengah.web.id",
    siteName: "Museum Digital Gamelan Jawa Tengah",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${cormorant.variable} scroll-smooth`}>
      <body className="bg-tinta text-gading bg-batik-pattern flex flex-col min-h-screen">
        {/* Navigasi Utama */}
        <Navbar />

        {/* Konten Halaman */}
        <main className="flex-1 w-full">{children}</main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
