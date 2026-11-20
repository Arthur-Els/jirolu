"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/#galeri", label: "Panggung" },
    { href: "/tentang", label: "Tentang" },
    { href: "/cara-bermain", label: "Cara Bermain" },
    { href: "/tim", label: "Tim" },
  ];

  const isCurrentPage = (href: string) => {
    if (href.startsWith("/#")) return false;
    return pathname === href;
  };

  useEffect(() => {
    const handleScroll = () => {
      // Aktifkan efek liquid glass saat sudah scroll lumayan jauh (> 40px)
      setIsScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    setIsMobileMenuOpen(false);
    if (href === "/#galeri" && pathname === "/") {
      e.preventDefault();
      document.getElementById("galeri")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full flex items-center justify-between px-6 sm:px-12 transition-[padding,background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-in-out select-none ${
        isScrolled || isMobileMenuOpen
          ? "py-3 sm:py-3.5 bg-[#0B0A09]/75 backdrop-blur-xl backdrop-saturate-150 border-b border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.37)]"
          : "py-4 sm:py-5 bg-transparent backdrop-blur-none border-b border-transparent"
      }`}
    >
      {/* Brand Jirolu (Logo Image) */}
      <Link
        href="/"
        className="flex items-center gap-2 hover:opacity-80 transition-opacity select-none group"
      >
        <Image
          src="/jirolu-logo.png"
          alt="Jirolu Logo"
          width={130}
          height={72}
          priority
          className="h-8 sm:h-12 w-auto object-contain transition-transform duration-200"
        />
      </Link>

      {/* Navigasi Desktop */}
      <nav aria-label="Utama" className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => {
          const active = isCurrentPage(link.href);
          return (
            <Link
              key={link.label}
              href={link.href}
              aria-current={active ? "page" : undefined}
              onClick={(e) => handleLinkClick(link.href, e)}
              className={`text-[14px] transition-colors font-medium select-none whitespace-nowrap rounded-sm focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-4 ${
                active
                  ? "text-ink underline decoration-accent decoration-2 underline-offset-8"
                  : "text-white/75 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Action Button Desktop & Mobile Toggle */}
      <div className="flex items-center gap-3">
        {/* Tombol Desktop */}
        <Link
          href="/instrumen/saron"
          className="hidden md:inline-flex rounded-xl px-[22px] py-[10px] bg-emas hover:bg-emas-muda text-tinta text-[14px] font-semibold transition-[background-color,color,transform] duration-200 transform active:scale-95 whitespace-nowrap"
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
          {navLinks.map((link) => {
            const active = isCurrentPage(link.href);
            return (
              <Link
                key={link.label}
                href={link.href}
                aria-current={active ? "page" : undefined}
                onClick={(e) => handleLinkClick(link.href, e)}
                className={`block text-[15px] font-medium py-1 ${
                  active
                    ? "text-ink border-l-2 border-accent pl-3"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-white/10">
            <Link
              href="/instrumen/saron"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-center w-full py-3 rounded-xl bg-emas hover:bg-emas-muda text-tinta text-[14px] font-semibold"
            >
              Mulai Bermain
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
