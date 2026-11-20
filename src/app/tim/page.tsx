import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { HeroVideoBackground } from "@/components/ui/HeroVideoBackground";
import { TEAM_MEMBERS } from "@/lib/tim";

export const metadata: Metadata = {
  title: "Tim di Balik Jirolu | Museum Gamelan yang Bisa Kamu Mainkan",
  description:
    "Kenali empat pembuat di balik Jirolu — dari pengembangan web, desain UI/UX, hingga arsitektur sistem dan alur pengguna.",
};

export default function TimPage() {
  return (
    <div className="relative w-full min-h-dvh bg-paper text-ink">
      {/* Background Video Fixed */}
      <HeroVideoBackground src="/background/bg-home.mp4" isFixed={true} />

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-24 space-y-20 sm:space-y-28">
        {/* 1. HERO EDITORIAL */}
        <header className="max-w-3xl space-y-6">
          <span
            className="font-serif text-xl sm:text-2xl text-accent/80 block"
            aria-hidden="true"
          >
            ꦗꦶꦫꦺꦴꦭꦸ
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal text-ink tracking-tight leading-[1.08]">
            Tim di Balik Jirolu
          </h1>
          <p className="font-sans text-base sm:text-lg text-ink-2 leading-relaxed max-w-2xl">
            Empat orang yang merancang, menyusun, dan membangun museum gamelan digital ini agar siapa pun dapat mendengar dan memainkannya langsung dari peramban.
          </p>
        </header>

        {/* 2. DAFTAR KREDIT PAMERAN: 4 ANGGOTA TIM */}
        <section className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-ink">
              Susunan Tim
            </h2>
            <p className="font-sans text-sm text-muted">
              Empat peran utama dalam perancangan dan pengembangan web
            </p>
          </div>

          <ol role="list" className="border-t border-rule divide-y divide-rule">
            {TEAM_MEMBERS.map((member) => (
              <li
                key={member.id}
                className="py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start lg:items-center"
              >
                {/* Kolom Kiri: Nomor Urut, Monogram/Foto, dan Nama */}
                <div className="lg:col-span-5 flex items-center gap-5 sm:gap-6 min-w-0">
                  <span
                    className="font-serif text-2xl sm:text-3xl text-accent/80 num w-9 shrink-0 select-none"
                    aria-hidden="true"
                  >
                    {member.nomor}
                  </span>

                  <div
                    className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-paper-2 border border-rule flex items-center justify-center shrink-0 overflow-hidden"
                    aria-hidden={member.avatar ? undefined : "true"}
                  >
                    {member.avatar ? (
                      <Image
                        src={member.avatar}
                        alt={`Potret ${member.nama}`}
                        fill
                        sizes="64px"
                        className="object-cover object-center"
                      />
                    ) : (
                      <span className="font-serif text-2xl sm:text-3xl font-normal text-accent select-none">
                        {member.inisial}
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-serif text-2xl sm:text-3xl font-normal text-ink leading-tight">
                      {member.nama}
                    </h3>
                  </div>
                </div>

                {/* Kolom Kanan: Jabatan Standar Industri & Kontribusi Nyata */}
                <div className="lg:col-span-7 space-y-2.5 lg:pl-2">
                  <p
                    lang="en"
                    className="font-sans text-sm sm:text-base font-medium text-accent"
                  >
                    {member.jabatan}
                  </p>
                  <p className="font-sans text-base text-ink-2 leading-relaxed max-w-2xl">
                    {member.kontribusi}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* 3. RINGKASAN TIM: PPLG WEBSITE DEVELOPMENT TEAM */}
        <section className="bg-paper-2 border border-rule rounded-3xl p-6 sm:p-10 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="lg:col-span-5 space-y-3">
            <h2
              lang="en"
              className="font-serif text-2xl sm:text-3xl font-normal text-ink leading-tight"
            >
              PPLG Website Development Team
            </h2>
            <p className="font-sans text-sm text-accent">
              Kolaborasi pameran alat musik tradisional Jawa
            </p>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <p className="font-sans text-base text-ink-2 leading-relaxed">
              Jirolu dikembangkan bersama sebagai proyek pameran web untuk memperkenalkan seni karawitan Jawa Tengah secara lebih dekat. Mulai dari pemetaan alur pengguna, perancangan visual, hingga implementasi simulasi instrumen, setiap bagian dikerjakan secara terpadu agar pengunjung dapat belajar sekaligus menabuh gamelan dengan mudah.
            </p>

            <div className="divide-y divide-rule border-y border-rule font-sans text-sm">
              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-muted">Proyek</span>
                <span className="text-ink font-medium text-right">
                  Jirolu — Museum Gamelan Digital
                </span>
              </div>
              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-muted">Persembahan</span>
                <span className="text-ink font-medium text-right">
                  Pameran Alat Musik Tradisional Jawa
                </span>
              </div>
              <div className="py-3 flex items-center justify-between gap-4">
                <span className="text-muted">Fokus karya</span>
                <span className="text-ink font-medium text-right">
                  Simulasi audio interaktif &amp; edukasi karawitan
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 4. PENUTUP: BALANCED ACTION ROW */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/instrumen/saron"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-accent hover:bg-accent-2 text-accent-ink font-semibold text-sm motion-safe:transition-colors duration-150 flex items-center justify-center min-h-[46px] focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 motion-safe:active:scale-95"
          >
            Mulai Mainkan Saron
          </Link>
          <Link
            href="/tentang"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-paper-2 hover:bg-paper-3 text-ink border border-rule hover:border-accent font-medium text-sm motion-safe:transition-colors duration-150 flex items-center justify-center min-h-[46px] focus-visible:outline-2 focus-visible:outline-focus focus-visible:outline-offset-2 motion-safe:active:scale-95"
          >
            Tentang Jirolu
          </Link>
        </div>
      </div>
    </div>
  );
}

