"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const lastScrollYRef = useRef(0);
  const pathname = usePathname();

  const navLinks = [
    { href: "/tentang", label: "Tentang" },
    { href: "/#galeri", label: "Koleksi Alat" },
    { href: "/cara-bermain", label: "Cara Bermain" },
    { href: "/#kontak", label: "Kontak" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 1. Aktifkan efek liquid glass saat sudah scroll lumayan jauh (> 40px)
      setIsScrolled(currentScrollY > 40);

      // 2. Logika sembunyi saat scroll ke bawah, muncul saat scroll ke atas
      if (currentScrollY > 80) {
        if (currentScrollY > lastScrollYRef.current) {
          // Sedang scroll ke bawah -> sembunyikan navbar
          setIsVisible(false);
        } else {
          // Sedang scroll ke atas -> munculkan kembali navbar
          setIsVisible(true);
        }
      } else {
        // Masih di area paling atas -> selalu tampilkan
        setIsVisible(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    setIsMobileMenuOpen(false);
    if (href === "/#galeri" && pathname === "/") {
      e.preventDefault();
      document.getElementById("galeri")?.scrollIntoView({ behavior: "smooth" });
    } else if (href === "/#kontak" && pathname === "/") {
      e.preventDefault();
      document.getElementById("kontak")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Jangan sembunyikan navbar saat menu mobile sedang terbuka
  const shouldShowNavbar = isVisible || isMobileMenuOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full flex items-center justify-between px-6 sm:px-12 transition-all duration-300 ease-in-out select-none ${
        shouldShowNavbar ? "translate-y-0" : "-translate-y-full"
      } ${
        isScrolled || isMobileMenuOpen
          ? "py-4 sm:py-4.5 bg-[#0B0A09]/65 backdrop-blur-xl backdrop-saturate-150 border-b border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.37)]"
          : "py-5 sm:py-6 bg-transparent backdrop-blur-none border-b border-transparent"
      }`}
    >
      {/* Brand Jirolu */}
      <Link
        href="/"
        className="font-sans text-[18px] font-semibold text-white tracking-tight hover:opacity-90 transition-opacity select-none"
      >
        Jirolu
      </Link>

      {/* Navigasi Desktop */}
      <nav className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={(e) => handleLinkClick(link.href, e)}
            className="text-[14px] text-white/75 hover:text-white transition-colors font-medium select-none whitespace-nowrap"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Action Button Desktop & Mobile Toggle */}
      <div className="flex items-center gap-3">
        {/* Tombol Desktop */}
        <Link
          href="/instrumen/saron"
          className="hidden md:inline-flex rounded-full px-[22px] py-[10px] bg-emas hover:bg-emas-muda text-tinta text-[14px] font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:shadow-[0_0_28px_rgba(212,175,55,0.55)] whitespace-nowrap"
        >
          Mulai Bermain
        </Link>

        {/* Hamburger Menu Toggle Mobile */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Buka menu navigasi"
          aria-expanded={isMobileMenuOpen}
          className="md:hidden p-2 text-white/80 hover:text-white transition-colors cursor-pointer"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Dropdown Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#0B0A09]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 space-y-4 shadow-2xl animate-in fade-in duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={(e) => handleLinkClick(link.href, e)}
              className="block text-[15px] font-medium text-white/80 hover:text-white py-1"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-white/10">
            <Link
              href="/instrumen/saron"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-center w-full py-3 rounded-full bg-emas hover:bg-emas-muda text-tinta text-[14px] font-semibold shadow-[0_0_20px_rgba(212,175,55,0.35)]"
            >
              Mulai Bermain
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
