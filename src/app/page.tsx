import React from "react";
import { getAllInstruments } from "@/lib/content";
import { HomeClient } from "@/components/home/HomeClient";

export default function HomePage() {
  const instruments = getAllInstruments();

  return <HomeClient instruments={instruments} />;
}
