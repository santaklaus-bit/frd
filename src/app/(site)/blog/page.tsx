import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Articles } from "@/components/sections/Articles";

export const metadata: Metadata = { title: "Blog — OPUS CORP" };

export default function BlogPage() {
  return (
    <>
      <PageHero
        title="Articles"
        subtitle="Méthodes, culture et coulisses : découvrez comment OPUS CORP prépare les expériences de marque."
      />
      <Articles />
    </>
  );
}
