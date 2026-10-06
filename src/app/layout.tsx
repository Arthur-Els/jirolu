import type { Metadata } from "next";
import { Inter, Cormorant_Garamond, Plus_Jakarta_Sans, Playfair_Display, JetBrains_Mono } from "next/font/google";
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

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://jirolu.web.id"),
  title: "Jirolu | Museum Gamelan yang Bisa Kamu Mainkan",
  description:
    "Jirolu adalah museum digital interaktif gamelan Jawa Tengah. Jelajahi filosofi mendalam dan mainkan Saron, Bonang, Gong, serta Kendang secara virtual tanpa jeda suara.",
  keywords: [
    "jirolu",
    "gamelan jawa",
    "museum gamelan",
    "saron virtual",
    "bonang virtual",
    "gong virtual",
    "kendang virtual",
    "alat musik tradisional",
    "karawitan jawa",
  ],
  authors: [{ name: "Jirolu" }],
  openGraph: {
    title: "Jirolu | Museum Gamelan yang Bisa Kamu Mainkan",
    description:
      "Museum gamelan digital interaktif: pelajari filosofi dan mainkan alat musik gamelan Jawa secara virtual tanpa delay.",
    url: "https://jirolu.web.id",
    siteName: "Jirolu",
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
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${cormorant.variable} ${plusJakarta.variable} ${playfair.variable} ${jetbrainsMono.variable} scroll-smooth`}
    >
      <body className="bg-tinta text-gading bg-batik-pattern flex flex-col min-h-screen">
        {/* Navigasi Utama Jirolu */}
        <Navbar />

        {/* Konten Halaman */}
        <main className="flex-1 w-full">{children}</main>

        {/* Footer Jirolu */}
        <Footer />
      </body>
    </html>
  );
}
