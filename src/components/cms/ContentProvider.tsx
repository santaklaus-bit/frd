"use client";
import { createContext, useContext } from "react";
import type { PublicContent } from "@/lib/cms/schema";
const Context = createContext<PublicContent | null>(null);
export function ContentProvider({
  content,
  children,
}: {
  content: PublicContent;
  children: React.ReactNode;
}) {
  return <Context.Provider value={content}>{children}</Context.Provider>;
}
export function useContent() {
  const value = useContext(Context);
  if (!value) throw new Error("Le contenu OPUS n’est pas disponible.");
  return value;
}
