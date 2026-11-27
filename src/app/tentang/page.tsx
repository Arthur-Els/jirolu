import React from "react";
import type { Metadata } from "next";
import { TentangClient } from "@/components/pages/TentangClient";

export const metadata: Metadata = {
  title: "Tentang Jirolu | Museum Gamelan yang Bisa Kamu Mainkan",
  description:
    "Cerita di balik pembuatan Jirolu, arti nama ji-ro-lu, cara kerja simulasi, dan sumber rekaman audio gamelan.",
};

export default function TentangPage() {
  return <TentangClient />;
}
