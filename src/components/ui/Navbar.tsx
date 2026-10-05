"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Beranda" },
    { href: "/#galeri", label: "Galeri Alat Musik" },
    { href: "/tentang", label: "Tentang Jirolu" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-tinta/85 backdrop-blur-md border-b border-perunggu/25">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
        {/* Brand / Logo Jirolu */}
        <Link
          href="/"
          className="group flex items-center gap-3 transition-transform duration-200 hover:scale-[1.01]"
        >
          <div className="w-10 h-10 rounded-full border border-emas/50 flex items-center justify-center bg-arang/90 shadow-[0_0_12px_rgba(212,175,55,0.2)] group-hover:border-emas group-hover:shadow-[0_0_16px_rgba(212,175,55,0.4)]">
            <span className="text-emas font-serif text-lg font-bold">ꦗꦶ</span>
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-gading group-hover:text-emas transition-colors">
              Jirolu
            </span>
            <span className="text-[10px] tracking-widest text-perunggu uppercase font-sans -mt-1">
              Museum Gamelan
            </span>
          </div>
        </Link>

        {/* Navigasi Desktop */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-wide transition-colors relative py-1 ${
                  isActive
                    ? "text-emas font-medium"
                    : "text-gading/80 hover:text-emas"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emas rounded-full shadow-[0_0_8px_#D4AF37]" />
                )}
              </Link>
            );
          })}
          <Link
            href="/instrumen/saron"
            className="text-xs uppercase tracking-wider px-4 py-2 rounded-full border border-emas/60 text-emas hover:bg-emas hover:text-tinta font-semibold transition-all shadow-[0_0_12px_rgba(212,175,55,0.2)]"
          >
            Mulai Mainkan
          </Link>
        </nav>

        {/* Tombol Menu Mobile */}
        <div className="md:hidden flex items-center">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Buka menu navigasi"
            aria-expanded={isMobileMenuOpen}
            className="p-2.5 rounded-lg text-gading hover:text-emas hover:bg-arang border border-perunggu/30 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
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
        <div className="md:hidden bg-arang/95 border-b border-perunggu/30 px-4 pt-3 pb-5 space-y-2 backdrop-blur-lg animate-in fade-in duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-md text-base font-medium text-gading hover:text-emas hover:bg-tinta/50"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="/instrumen/saron"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-center w-full py-3 rounded-lg bg-emas text-tinta font-semibold text-sm shadow-[0_0_15px_rgba(212,175,55,0.3)]"
            >
              Mulai Mainkan Gamelan
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
