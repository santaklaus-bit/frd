import { notFound } from "next/navigation";
import { ArrowLeft, Target, Users, Lightbulb, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getData } from "@/lib/content-manager";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { HashScrollHandler } from "@/components/hash-scroll-handler";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string; lang: string }>;
}

const ICON_MAP: Record<string, any> = {
  Target,
  Users,
  Lightbulb,
  TrendingUp,
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, lang } = await params;
  const initiatives = (await getData("expertise")) as any[];
  const initiative = initiatives.find((i: any) => i.slug === slug);

  if (!initiative) return {};

  const title = initiative.title[lang as keyof typeof initiative.title] || initiative.title.fr;
  const description = initiative.description[lang as keyof typeof initiative.description] || initiative.description.fr;

  return {
    title,
    description,
  };
}

export default async function ExpertiseDetailPage({ params }: PageProps) {
  const { slug, lang } = await params;
  const initiatives = (await getData("expertise")) as any[];
  const initiative = initiatives.find((i: any) => i.slug === slug);

  if (!initiative) {
    notFound();
  }

  const title = initiative.title[lang as keyof typeof initiative.title] || initiative.title.fr;
  const description = initiative.description[lang as keyof typeof initiative.description] || initiative.description.fr;
  const category = initiative.category[lang as keyof typeof initiative.category] || initiative.category.fr;
  const Icon = ICON_MAP[initiative.icon] || Target;

  return (
    <div className="min-h-screen bg-background relative">
      <HashScrollHandler />

      {/* ── BANNER IMAGE ── */}
      {initiative.image && (
        <div className="relative w-full h-[40vh] md:h-[55vh] overflow-hidden">
          <Image
            src={initiative.image}
            alt={title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-background" />
        </div>
      )}

      {!initiative.image && (
        <div className="absolute top-0 left-0 z-0 w-full h-[200px] [mask-image:linear-gradient(to_top,transparent_25%,black_95%)]">
          <FlickeringGrid
            className="absolute top-0 left-0 size-full"
            squareSize={4}
            gridGap={6}
            color="#6B7280"
            maxOpacity={0.2}
            flickerChance={0.05}
          />
        </div>
      )}

      <div className="border-b border-border relative z-10 bg-background/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
          <div className="flex flex-col gap-8">
            <Button variant="ghost" asChild className="w-fit -ml-4 hover:bg-muted/50">
              <Link href={`/${lang}/expertise`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-bold uppercase text-xs tracking-widest">
                <ArrowLeft className="w-4 h-4" />
                {lang === "fr" ? "Retour à l'expertise" : "Back to expertise"}
              </Link>
            </Button>

            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 text-muted-foreground w-fit">
                <Icon className="h-4 w-4" />
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest leading-none pt-0.5">
                  {category}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-semibold tracking-tighter text-balance leading-[0.9] uppercase">
                {title}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10">
        <div className="grid lg:grid-cols-[1fr_250px] gap-12 lg:gap-20">
          <main className="space-y-12">
            <p className="text-foreground font-medium text-lg sm:text-xl leading-relaxed mb-6">
              {description}
            </p>

            {initiative.details && (
              <div className="prose dark:prose-invert max-w-none prose-headings:font-serif prose-headings:font-semibold prose-headings:tracking-tighter prose-headings:uppercase prose-p:text-muted-foreground prose-p:leading-relaxed prose-lg whitespace-pre-wrap">
                <p>{(initiative.details as any)[lang] || initiative.details.fr}</p>
              </div>
            )}

            {initiative.link && (
              <div className="pt-8">
                <Button asChild size="lg" className="rounded-full px-8 py-6 font-bold uppercase tracking-widest transition-transform hover:scale-105">
                  <a href={initiative.link} target="_blank" rel="noopener noreferrer">
                    {lang === "fr" ? "Voir la réalisation" : "View implementation"}
                  </a>
                </Button>
              </div>
            )}
          </main>

          <aside className="hidden lg:block">
            {/* Sidebar content if needed */}
          </aside>
        </div>
      </div>
    </div>
  );
}
