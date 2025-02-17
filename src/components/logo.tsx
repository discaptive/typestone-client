"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Logo() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  return (
    <Image
      src={`/logo${mounted && resolvedTheme === "dark" ? "-dark" : ""}.svg`}
      alt="Typestone Logo"
      width={40}
      height={40}
    />
  );
}
