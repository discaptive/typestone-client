"use client";

import { Collection } from "@/lib/types";
import { createContext } from "react";

export const CollectionContext = createContext<Collection>({
  owner: "",
  settings: {},
  posts: [],
});

export const CollectionProvider = ({
  children,
  collection,
}: {
  children: React.ReactNode;
  collection: Collection;
}) => {
  return (
    <CollectionContext.Provider value={collection}>
      {children}
    </CollectionContext.Provider>
  );
};
