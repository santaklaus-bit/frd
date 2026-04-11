import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import { getData } from "@/lib/content-manager";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { HashScrollHandler } from "@/components/hash-scroll-handler";

export const dynamic = "force-dynamic";

// @ts-ignore
import edjsParser from "editorjs-html";

interface PageProps {
  params: Promise<{ slug: string; lang: string }>;
}

async function LinkedProjects({ slugs, lang }: { slugs: string[]; lang: string }) {
  const allProjects = await getData("projects");
  const linked = allProjects.filter((p: any) => slugs.includes(p.slug));

  if (linked.length === 0) return null;

  return (
    <div className="mt-20 pt-12 border-t border-border/40 not-prose">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">
        {lang === "fr" ? "Projets liés" : "Related projects"}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {linked.map((project: any) => {
          const title = (project.title as any)[lang] || project.title.fr;
          const description = (project.description as any)[lang] || project.description.fr;
          const image = project.image;
          return (
            <Link
              key={project.slug}
              href={`/${lang}/projects/${project.slug}`}
              className="group flex flex-col gap-3 p-4 rounded-2xl border border-border/40 bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300"
            >
              {image && (
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-foreground leading-tight">{title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{description}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors mt-0.5" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, lang } = await params;
  const initiatives = (await getData("expertise")) as any[];
  const initiative = initiatives.find((i: any) => i.slug === slug);

  if (!initiative) return {};

  const title = initiative.title[lang as keyof typeof initiative.title] || initiative.title.fr;
  const description = initiative.description[lang as keyof typeof initiative.description] || initiative.description.fr;
  const caption = (initiative.imageCaption as any)?.[lang] || initiative.imageCaption?.fr || "";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: initiative.image ? [{ url: initiative.image, alt: caption || title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: initiative.image ? [initiative.image] : [],
    },
  };
}

export default async function ExpertiseDetailPage({ params }: PageProps) {
  const { slug, lang } = await params;
  const initiatives = (await getData("expertise")) as any[];
  const initiative = initiatives.find((i: any) => i.slug === slug);

  if (!initiative) {
    notFound();
  }

  const title = (initiative.title as any)[lang] || initiative.title.fr;
  const description = (initiative.description as any)[lang] || initiative.description.fr;
  const category = (initiative.category as any)[lang] || initiative.category.fr;
  const content = initiative.content ? ((initiative.content as any)[lang] || initiative.content.fr) : "";
  const caption = (initiative.imageCaption as any)?.[lang] || initiative.imageCaption?.fr || "";

  // Editor.js Check & Parse
  let isEditorJs = false;
  let renderedHtml = "";

  if (content && (content.startsWith("{") || content.startsWith('{"'))) {
    try {
      const parsed = JSON.parse(content);
      if (parsed && parsed.blocks && Array.isArray(parsed.blocks)) {
        isEditorJs = true;
        const parser = edjsParser();
        const htmlBlocks = parser.parse(parsed);
        renderedHtml = Array.isArray(htmlBlocks) ? htmlBlocks.join("") : (htmlBlocks as string);
      }
    } catch (e) {
      // Not JSON or Not EditorJS format, fallback to raw text
    }
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <HashScrollHandler />

      {/* ── BACKGROUND ACCENT ── */}
      <div className="absolute top-0 left-0 z-0 w-full h-[500px] pointer-events-none">
        <FlickeringGrid
          className="absolute top-0 left-0 size-full [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_80%)] opacity-30"
          squareSize={4}
          gridGap={6}
          color="#6B7280"
          maxOpacity={0.2}
          flickerChance={0.05}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      </div>

      <div className="relative z-10">
        {/* ── HEADER ── */}
        <header className="pt-24 pb-16 md:pt-32 md:pb-24 border-b border-border/40">
          <div className="max-w-5xl mx-auto px-6">
            <Button variant="ghost" asChild className="mb-12 -ml-4 hover:bg-muted/50 rounded-full h-10 px-4 group">
              <Link href={`/${lang}/expertise`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-all font-bold uppercase text-[10px] tracking-[0.2em]">
                <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                {lang === "fr" ? "Expertise" : "Expertise"}
              </Link>
            </Button>

            <div className="space-y-8">
              <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary animate-in fade-in slide-in-from-bottom-4 duration-700">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] leading-none pt-0.5">
                  {category}
                </span>
              </div>
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-serif font-extrabold tracking-tight text-balance leading-[0.85] uppercase animate-in fade-in slide-in-from-bottom-8 duration-700 delay-150">
                {title}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed font-medium animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
                {description}
              </p>
            </div>
          </div>
        </header>

        {/* ── CONTENT ── */}
        <main className="py-20 md:py-32">
          <div className="max-w-3xl mx-auto px-6">
            <div className="prose prose-lg dark:prose-invert max-w-none 
              prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-tight prose-headings:uppercase
              prose-p:text-muted-foreground prose-p:leading-[1.8] prose-p:mb-8
              prose-li:text-muted-foreground prose-strong:text-foreground
              animate-in fade-in duration-1000 delay-500">
              
              {initiative.image && (
                <div className="mb-12 space-y-4">
                  <div className="relative aspect-video rounded-3xl overflow-hidden border border-border/40 shadow-2xl">
                    <img
                        src={initiative.image}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                  </div>
                  {caption && (
                    <p className="text-sm text-muted-foreground italic px-2 border-l-2 border-primary/30 py-1 not-prose">
                      {caption}
                    </p>
                  )}
                </div>
              )}

              {isEditorJs ? (
                <div dangerouslySetInnerHTML={{ __html: renderedHtml }} className="leading-relaxed" />
              ) : content ? (
                <div className="whitespace-pre-wrap leading-relaxed">
                  {content}
                </div>
              ) : (
                 <p className="italic text-muted-foreground/60">
                   {lang === 'fr' ? 'Aucun contenu supplémentaire disponible.' : 'No additional content available.'}
                 </p>
              )}

              {initiative.details && (
                <div className="mt-8 text-muted-foreground/80 font-medium h-full border-primary/30 pl-8 py-2 italic text-xl leading-relaxed">
                   {(initiative.details as any)[lang] || initiative.details.fr}
                </div>
              )}
            </div>

            {initiative.link && (
              <div className="mt-20 pt-12 border-t border-border/40">
                <Button asChild size="lg" className="rounded-full px-10 h-14 font-bold uppercase tracking-widest transition-all hover:scale-105 shadow-xl shadow-primary/10">
                  <a href={initiative.link} target="_blank" rel="noopener noreferrer">
                    {lang === "fr" ? "En savoir plus" : "Learn more"}
                  </a>
                </Button>
              </div>
            )}

            {/* ── LINKED PROJECTS ── */}
            {initiative.projectSlugs && initiative.projectSlugs.length > 0 && (
              <LinkedProjects
                slugs={initiative.projectSlugs}
                lang={lang}
              />
            )}
          </div>
        </main>
      </div>
      
      {/* ── FOOTER DECOR ── */}
      <div className="h-64 bg-gradient-to-t from-muted/20 to-transparent pointer-events-none" />
    </div>
  );
}
