import { Target, Users, Lightbulb, TrendingUp, ArrowRight } from "lucide-react";
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

  return {
    title: dict.seo.projects.title,
    description: dict.seo.projects.description,
    alternates: {
      canonical: `/${lang}/projects`,
    },
  };
}

const ICON_MAP: Record<string, any> = {
  Target,
  Users,
  Lightbulb,
  TrendingUp,
};

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "fr");

  const rawProjects = await getData("projects");
  const filteredProjects = rawProjects.filter((item: any) => item.slug);
  
  const initiatives = filteredProjects.map((item: any) => ({
    ...item,
    icon: ICON_MAP[item.icon] || Lightbulb,
    title: item.title?.[lang] ?? item.title?.fr ?? "",
    description: item.description?.[lang] ?? item.description?.fr ?? "",
    category: item.category?.[lang] ?? item.category?.fr ?? "",
  }));

  const isFr = lang === "fr";
  const featured = initiatives[0] ?? null;
  const rest = initiatives.slice(1);

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

        {/* ── FEATURED PROJECT ── */}
        {featured && (
          <section className="py-16 md:py-24 border-b border-border/40">
            <article className="group grid md:grid-cols-2 gap-10 md:gap-16 items-start">
              {/* Image */}
              {featured.image ? (
                <div className="relative aspect-[3/2] overflow-hidden bg-muted">
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                </div>
              ) : (
                <div className="relative aspect-[3/2] bg-muted/60 flex items-center justify-center">
                  <featured.icon className="h-12 w-12 text-muted-foreground/40" />
                </div>
              )}

              {/* Content */}
              <div className="flex flex-col justify-center gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-muted text-muted-foreground uppercase tracking-widest">
                    {featured.category}
                  </span>
                </div>
                <Link href={`/${lang}/projects/${featured.slug}`} className="w-fit">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight hover:underline uppercase">
                    {featured.title}
                  </h2>
                </Link>
                {featured.description && (
                  <p className="text-muted-foreground leading-relaxed line-clamp-4">
                    {featured.description}
                  </p>
                )}
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground">
                  {isFr ? "En savoir plus" : "Learn more"}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          </section>
        )}

        {/* ── PROJECT GRID ── */}
        {rest.length > 0 && (
          <section className="py-16 md:py-24">
            <div className="grid md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-16 md:gap-y-24">
              {rest.map((project: any) => (
                <article key={project.slug} className="group flex flex-col gap-6">
                  {/* Image */}
                  <div className="relative aspect-[3/2] overflow-hidden bg-muted/60">
                    {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                         <project.icon className="h-10 w-10 text-muted-foreground/40" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-muted text-muted-foreground uppercase tracking-widest">
                        {project.category}
                      </span>
                    </div>
                    <Link href={`/${lang}/projects/${project.slug}`} className="w-fit">
                      <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-snug hover:underline uppercase">
                        {project.title}
                      </h2>
                    </Link>
                    {project.description && (
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {project.description}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ── EMPTY STATE ── */}
        {initiatives.length === 0 && (
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
