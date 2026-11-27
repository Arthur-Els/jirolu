import React from "react";
import type { Metadata } from "next";
import { CaraBermainClient } from "@/components/pages/CaraBermainClient";

export const metadata: Metadata = {
  title: "Cara Bermain Gamelan di Jirolu | Panduan Interaktif",
  description:
    "Panduan praktis bermain gamelan secara virtual di Jirolu melalui ponsel atau keyboard laptop, mengenal laras Slendro & Pelog, serta fitur rekam dan mode belajar.",
};

export default function CaraBermainPage() {
  return <CaraBermainClient />;
}
