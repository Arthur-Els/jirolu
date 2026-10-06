"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/tentang", label: "Tentang" },
    { href: "/#galeri", label: "Koleksi Alat" },
    { href: "/cara-bermain", label: "Cara Bermain" },
    { href: "/#kontak", label: "Kontak" },
  ];

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

  return (
    <header className="absolute top-0 left-0 right-0 z-50 w-full flex items-center justify-between px-6 py-5 sm:px-12 sm:py-6 bg-transparent backdrop-blur-none border-none">
      {/* Brand */}
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
            className="text-[14px] text-white/75 hover:text-white transition-colors font-medium select-none"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Action Button */}
      <div className="hidden sm:flex items-center">
        <Link
          href="/instrumen/saron"
          className="rounded-full px-[22px] py-[10px] bg-emas hover:bg-emas-muda text-tinta text-[14px] font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(212,175,55,0.35)] hover:shadow-[0_0_28px_rgba(212,175,55,0.55)]"
        >
          Mulai Mainkan
        </Link>
      </div>

      {/* Tombol Menu Mobile */}
      <div className="md:hidden flex items-center gap-3">
        <Link
          href="/instrumen/saron"
          className="rounded-full px-4 py-1.5 bg-emas hover:bg-emas-muda text-tinta text-xs font-semibold sm:hidden shadow-[0_0_15px_rgba(212,175,55,0.3)]"
        >
          Mulai
        </Link>
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Buka menu navigasi"
          aria-expanded={isMobileMenuOpen}
          className="p-2 text-white/80 hover:text-white transition-colors"
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
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#0B0A09]/95 backdrop-blur-xl border-b border-white/10 px-6 py-6 space-y-4 shadow-2xl animate-in fade-in duration-200">
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
              Mulai Mainkan
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
