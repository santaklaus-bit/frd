import { ArrowRight } from "lucide-react";
import { getDictionary } from "@/lib/get-dictionary";
import { getData } from "@/lib/content-manager";
import Image from "next/image";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "fr");
  const defaultTitle = lang === "fr" ? "Projets - Farid DANKO" : "Projects - Farid DANKO";
  const defaultDesc = lang === "fr"
    ? "Découvrez les projets de Farid Danko"
    : "Discover Farid Danko's projects";

  return {
    title: (dict as any)?.seo?.projects?.title || defaultTitle,
    description: (dict as any)?.seo?.projects?.description || defaultDesc,
    alternates: {
      canonical: `/${lang}/projects`,
    },
  };
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "fr");

  const rawProjects = await getData("projects");
  const filteredProjects = rawProjects.filter((item: any) => item.slug);
  
  const projects = filteredProjects.map((item: any) => ({
    ...item,
    title: item.title?.[lang] ?? item.title?.fr ?? "",
    description: item.description?.[lang] ?? item.description?.fr ?? "",
    category: item.category?.[lang] ?? item.category?.fr ?? "",
  }));

  const isFr = lang === "fr";

  return (
    <div className="min-h-screen bg-background">
      {/* ── VERTICAL SIDEBAR LABEL ── */}
      <div
        aria-hidden
        className="hidden lg:flex fixed left-0 top-0 h-screen w-12 items-center justify-center z-10 pointer-events-none"
      >
        <span
          className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/40 select-none"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          Farid Danko — {isFr ? "Projets" : "Projects"}
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 xl:px-24 lg:pl-20">
        {/* ── PAGE HEADER ── */}
        <header className="pt-16 md:pt-24 pb-12 md:pb-20 border-b border-border/50">
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-muted-foreground/60 mb-4">
            {isFr ? "Réalisations & Impact" : "Achievements & Impact"}
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none uppercase">
            {isFr ? "Projets" : "Projects"}
          </h1>
        </header>

        {/* ── PROJECT LIST ── */}
        {projects.length > 0 && (
          <section className="py-12 md:py-20 grid gap-8 md:gap-10">
            {projects.map((project: any, i: number) => (
              <article
                key={project.slug}
                className="group relative grid md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] gap-6 md:gap-10 p-4 md:p-6 rounded-3xl border border-border/50 bg-card/40 transition-all duration-300 hover:border-foreground/30 hover:bg-card hover:shadow-xl"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
                  {project.image ? (
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(min-width: 768px) 45vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                      priority={i === 0}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">
                      {isFr ? "Pas d'image" : "No image"}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex min-w-0 flex-col justify-center gap-4 md:py-2 md:pr-4">
                  <div className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                    <span className="tabular-nums text-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="h-px w-8 bg-border" />
                    <span className="truncate">{project.category}</span>
                  </div>

                  <h2 className="text-2xl md:text-[1.75rem] lg:text-3xl font-semibold tracking-tight leading-tight text-balance">
                    <Link
                      href={`/${lang}/projects/${project.slug}`}
                      className="after:absolute after:inset-0 after:content-[''] after:rounded-3xl"
                    >
                      {project.title}
                    </Link>
                  </h2>

                  {project.description && (
                    <p className="text-muted-foreground leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  )}

                  <span className="mt-1 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-foreground">
                    {isFr ? "Voir le projet" : "View project"}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1.5" />
                  </span>
                </div>
              </article>
            ))}
          </section>
        )}

        {/* ── EMPTY STATE ── */}
        {projects.length === 0 && (
          <div className="py-40 text-center">
            <p className="text-3xl text-muted-foreground/50 font-light uppercase tracking-tighter">
              {isFr ? "Aucun projet pour l'instant." : "No projects yet."}
            </p>
          </div>
        )}

        {/* ── OUTRO ── */}
        <div className="mb-14 md:mb-24 lg:mb-32 p-8 sm:p-10 md:p-12 lg:p-16 rounded-2xl bg-black dark:bg-white text-white dark:text-black text-center relative overflow-hidden mt-12">
          <div className="relative z-10">
            <p className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-tighter mb-5 md:mb-6 lg:mb-8 leading-tight max-w-3xl mx-auto">
              {dict.projects.outro}
            </p>
            <Link href={`/${lang}/contact`}>
              <Button
                size="lg"
                variant="outline"
                className="px-6 sm:px-8 md:px-12 py-5 sm:py-6 md:py-8 rounded-full font-bold uppercase tracking-widest border-2 bg-transparent text-white border-white hover:bg-white hover:text-black dark:text-black dark:border-black dark:hover:bg-black dark:hover:text-white transition-all transform hover:scale-105 text-sm sm:text-base"
              >
                {isFr ? "Me contacter" : "Contact me"}
              </Button>
            </Link>
          </div>
          <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/5 dark:bg-black/5 rounded-full -mr-24 sm:-mr-32 -mt-24 sm:-mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-white/5 dark:bg-black/5 rounded-full -ml-24 sm:-ml-32 -mb-24 sm:-mb-32 blur-3xl" />
        </div>
      </div>
    </div>
  );
}
