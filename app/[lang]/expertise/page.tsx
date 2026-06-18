export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getDictionary } from "@/lib/get-dictionary";
import { Metadata } from "next";
import { getData } from "@/lib/content-manager";
import Image from "next/image";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "fr");
  const defaultTitle = lang === "fr" ? "Expertise - Farid DANKO" : "Expertise - Farid DANKO";
  const defaultDesc = lang === "fr"
    ? "Découvrez l'expertise de Farid Danko"
    : "Discover Farid Danko's expertise";

  return {
    title: (dict as any)?.seo?.expertise?.title || defaultTitle,
    description: (dict as any)?.seo?.expertise?.description || defaultDesc,
    alternates: { canonical: `/${lang}/expertise` },
  };
}

export default async function ExpertisePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const isFr = lang === "fr";

  const rawInitiatives = await getData("expertise");
  const initiatives = rawInitiatives
    .filter((item: any) => item.slug) // skip empty drafts
    .map((item: any, index: number) => ({
      ...item,
      num: String(index + 1).padStart(2, "0"),
      title: item.title?.[lang] ?? item.title?.fr ?? "",
      desc: item.description?.[lang] ?? item.description?.fr ?? "",
      href: `/${lang}/expertise/${item.slug}`,
    }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-28">

        {/* ── HEADER ── */}
        <header className="mb-16 md:mb-24 border-b border-border/50 pb-12 md:pb-16">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/60 mb-4">
            {isFr ? "Domaines d'intervention" : "Areas of intervention"}
          </p>
          <h1 className="text-5xl md:text-7xl font-bold uppercase tracking-tight mb-8">
            {isFr ? "Expertise" : "Expertise"}
          </h1>
          <div className="max-w-2xl space-y-3">
            <p className="text-lg md:text-xl text-foreground leading-relaxed">
              {isFr
                ? "Farid Danko intervient à l'intersection de l'autonomisation économique, du développement organisationnel et de l'inclusion."
                : "Farid Danko works at the intersection of economic empowerment, organizational development and inclusion."}
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              {isFr
                ? "Son approche relie lecture stratégique, travail de terrain et structuration de solutions à fort impact."
                : "His approach connects strategic insight, fieldwork and the design of high-impact solutions."}
            </p>
          </div>
        </header>

        {/* ── BLOCKS ── Horizontal list style */}
        <div className="flex flex-col divide-y divide-border/40">
          {(initiatives as any[]).map((block) => (
            <div key={block.slug} className="group relative">
              <Link
                href={block.href}
                className="flex flex-col md:flex-row items-center justify-between gap-8 py-10 md:py-12 hover:pl-3 transition-all duration-300"
              >
                <div className="flex items-start gap-8 md:gap-12 flex-1">
                  <span className="text-xs font-bold tabular-nums text-muted-foreground/40 pt-1.5 shrink-0">
                    {block.num}
                  </span>
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-tight mb-4 group-hover:text-foreground transition-colors">
                      {block.title}
                    </h2>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl">
                      {block.desc}
                    </p>
                  </div>
                </div>


                <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground/40 group-hover:text-foreground group-hover:translate-x-1 transition-all duration-300 md:block hidden" />
              </Link>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
