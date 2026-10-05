import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palet warna Modern-Etnik Museum Gamelan Jawa
        tinta: "#0B0A09",     // Latar belakang utama (hitam pekat bernuansa hangat)
        arang: "#171411",     // Latar kartu, panel, dan bilah instrumen
        emas: {
          DEFAULT: "#D4AF37", // Aksen utama (kuningan / emas gamelan)
          muda: "#F4E3B2",
          tua: "#997A1E",
        },
        perunggu: "#A9783C",  // Aksen kedua (perunggu keraton)
        gading: "#EFE6D2",    // Warna teks utama (krem gading ramah mata)
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        pendar: "0 0 25px rgba(212, 175, 55, 0.45)",
        bilah: "inset 0 1px 2px rgba(255,255,255,0.15), 0 8px 16px rgba(0,0,0,0.6)",
      },
    },
  },
  plugins: [],
};

export default config;
