"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/#galeri", label: "Galeri Alat Musik" },
    { href: "/cara-bermain", label: "Cara Bermain" },
    { href: "/tentang", label: "Tentang Jirolu" },
  ];

  const [activeHref, setActiveHref] = useState<string>("/");
  const [lineStyle, setLineStyle] = useState<{
    left: number;
    width: number;
    opacity: number;
  }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<{ [key: string]: HTMLAnchorElement | null }>({});

  // Fungsi untuk menggeser garis kuning ke menu yang sedang aktif
  const updateLinePosition = useCallback((targetHref: string) => {
    const linkEl = linkRefs.current[targetHref];
    const navEl = navRef.current;

    if (linkEl && navEl) {
      const navRect = navEl.getBoundingClientRect();
      const linkRect = linkEl.getBoundingClientRect();

      // Posisikan garis pas selebar teks dengan padding yang proporsional
      const paddingX = 8;
      const left = linkRect.left - navRect.left + paddingX;
      const width = Math.max(16, linkRect.width - paddingX * 2);

      setLineStyle({
        left,
        width,
        opacity: 1,
      });
    } else {
      setLineStyle((prev) => ({ ...prev, opacity: 0 }));
    }
  }, []);

  // Update posisi garis setiap kali activeHref berubah
  useEffect(() => {
    updateLinePosition(activeHref);
  }, [activeHref, updateLinePosition]);

  // Pantau scroll untuk menyesuaikan tampilan navbar dan aktifkan ScrollSpy pada halaman utama
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);

      // ScrollSpy: hanya aktif di halaman beranda ("/")
      if (pathname === "/") {
        const galeriEl = document.getElementById("galeri");
        if (galeriEl) {
          const rect = galeriEl.getBoundingClientRect();
          // Saat posisi galeri mendekati atau berada di viewport
          if (rect.top <= 240) {
            setActiveHref("/#galeri");
          } else {
            setActiveHref("/");
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  // Sinkronkan active link saat pathname berubah
  useEffect(() => {
    if (pathname !== "/") {
      setActiveHref(pathname);
    } else {
      if (typeof window !== "undefined" && window.location.hash === "#galeri") {
        setActiveHref("/#galeri");
      } else {
        setActiveHref("/");
      }
    }
  }, [pathname]);

  // Update posisi saat ukuran jendela berubah atau font selesai dimuat
  useEffect(() => {
    const handleResize = () => {
      updateLinePosition(activeHref);
    };

    window.addEventListener("resize", handleResize);

    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        updateLinePosition(activeHref);
      });
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [activeHref, updateLinePosition]);

  // Handler saat pengguna mengklik menu
  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    setIsMobileMenuOpen(false);
    setActiveHref(href);

    if (href === "/" && pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else if (href === "/#galeri" && pathname === "/") {
      e.preventDefault();
      const galeriEl = document.getElementById("galeri");
      if (galeriEl) {
        galeriEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-tinta/90 backdrop-blur-xl border-b border-perunggu/35 shadow-[0_8px_24px_rgba(0,0,0,0.6)] py-2 sm:py-2.5"
          : "bg-tinta/60 backdrop-blur-md border-b border-perunggu/15 py-3 sm:py-4"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Brand / Logo Jirolu */}
        <Link
          href="/"
          onClick={(e) => handleLinkClick("/", e)}
          className="group flex items-center gap-3 transition-transform duration-200 hover:scale-[1.02]"
        >
          <div className="w-10 h-10 rounded-full border border-emas/50 flex items-center justify-center bg-arang/90 shadow-[0_0_12px_rgba(212,175,55,0.2)] group-hover:border-emas group-hover:shadow-[0_0_18px_rgba(212,175,55,0.45)] transition-all">
            <span className="text-emas font-serif text-lg font-bold">ꦗꦶ</span>
          </div>
          <span className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-gading group-hover:text-emas transition-colors">
            Jirolu
          </span>
        </Link>

        {/* Navigasi Desktop dengan Garis Kuning Geser (Sliding Yellow Underline) */}
        <nav
          ref={navRef}
          aria-label="Navigasi Utama"
          className="hidden md:flex items-center gap-1 lg:gap-2 relative py-2"
        >
          {/* Garis Kuning / Emas Meluncur Mengikuti Menu Aktif */}
          {lineStyle.width > 0 && (
            <div
              className="absolute bottom-0 h-0.5 bg-emas rounded-full shadow-[0_0_10px_#D4AF37] pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)]"
              style={{
                transform: `translate3d(${lineStyle.left}px, 0, 0)`,
                width: `${lineStyle.width}px`,
                opacity: lineStyle.opacity,
              }}
            />
          )}

          {/* Item Menu Navigasi */}
          {navLinks.map((link) => {
            const isActive = activeHref === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                ref={(el) => {
                  linkRefs.current[link.href] = el;
                }}
                onClick={(e) => handleLinkClick(link.href, e)}
                className={`relative text-sm tracking-wide transition-colors duration-200 px-3.5 py-1.5 select-none ${
                  isActive
                    ? "text-emas font-semibold"
                    : "text-gading/75 hover:text-emas"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Tombol Mulai Mainkan Soundboard */}
          <div className="ml-3 pl-3 border-l border-perunggu/30">
            <Link
              href="/instrumen/saron"
              className="relative group/btn overflow-hidden text-xs uppercase tracking-wider px-4 py-2 rounded-full border border-emas/60 text-emas hover:text-tinta font-semibold transition-all duration-300 shadow-[0_0_14px_rgba(212,175,55,0.25)] hover:shadow-[0_0_22px_rgba(212,175,55,0.5)] flex items-center gap-1.5"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-emas via-emas-muda to-emas opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
              <span className="relative z-10">Mulai Mainkan</span>
            </Link>
          </div>
        </nav>

        {/* Tombol Menu Mobile */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Buka menu navigasi"
            aria-expanded={isMobileMenuOpen}
            className="p-2.5 rounded-lg text-gading hover:text-emas hover:bg-arang/80 border border-perunggu/30 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menu Dropdown Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden relative z-20 bg-arang/95 border-b border-perunggu/35 px-4 pt-3 pb-5 space-y-2 backdrop-blur-2xl shadow-2xl animate-in fade-in duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => handleLinkClick(link.href, e)}
              className={`block px-3 py-2.5 rounded-lg text-base font-medium transition-colors ${
                activeHref === link.href
                  ? "text-emas border-l-2 border-emas bg-emas/10 pl-4"
                  : "text-gading hover:text-emas hover:bg-tinta/50"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="/instrumen/saron"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-center w-full py-3 rounded-lg bg-emas text-tinta font-semibold text-sm shadow-[0_0_18px_rgba(212,175,55,0.35)] active:scale-[0.98] transition-transform"
            >
              Mulai Mainkan Gamelan
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
