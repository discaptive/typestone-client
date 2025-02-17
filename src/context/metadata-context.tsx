"use client";

import { Metadata } from "@/lib/types";
import { createContext } from "react";

export const MetadataContext = createContext<Metadata>({
  username: "",
  navigations: [],
  giscus: undefined,
  branch: "main",
  posts: [],
});

export const MetadataProvider = ({
  children,
  metadata,
}: {
  children: React.ReactNode;
  metadata: Metadata;
}) => {
  return (
    <MetadataContext.Provider value={metadata}>
      {children}
    </MetadataContext.Provider>
  );
};
