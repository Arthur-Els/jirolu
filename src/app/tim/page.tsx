import React from "react";
import type { Metadata } from "next";
import { TEAM_MEMBERS } from "@/lib/tim";
import { TimClient } from "@/components/pages/TimClient";

export const metadata: Metadata = {
  title: "Tim di Balik Jirolu | Museum Gamelan yang Bisa Kamu Mainkan",
  description:
    "Kenali empat pembuat di balik Jirolu — dari pengembangan web, desain UI/UX, hingga arsitektur sistem dan alur pengguna.",
};

export default function TimPage() {
  return <TimClient members={TEAM_MEMBERS} />;
}

