import { notFound } from "next/navigation";
import { ArrowLeft, Target, Users, Lightbulb, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import { getData } from "@/lib/content-manager";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";

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
  const initiatives = (await getData("initiatives")) as any[];
  const initiative = initiatives.find((i: any) => i.slug === slug);

  if (!initiative) return {};

  const title = initiative.title[lang as keyof typeof initiative.title] || initiative.title.fr;
  const description = initiative.description[lang as keyof typeof initiative.description] || initiative.description.fr;

  return {
    title,
    description,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug, lang } = await params;
  const initiatives = (await getData("initiatives")) as any[];
  const initiative = initiatives.find((i: any) => i.slug === slug);

  if (!initiative) {
    notFound();
  }

  const title = initiative.title[lang as keyof typeof initiative.title] || initiative.title.fr;
  const description = initiative.description[lang as keyof typeof initiative.description] || initiative.description.fr;
  const category = initiative.category[lang as keyof typeof initiative.category] || initiative.category.fr;
  const Icon = ICON_MAP[initiative.icon] || Lightbulb;

  return (
    <div className="min-h-screen bg-background relative">
      <div className="absolute top-0 left-0 z-0 w-full h-[300px] [mask-image:linear-gradient(to_top,transparent_25%,black_95%)]">
        <FlickeringGrid
          className="absolute top-0 left-0 size-full"
          squareSize={4}
          gridGap={6}
          color="#6B7280"
          maxOpacity={0.15}
          flickerChance={0.05}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-24 relative z-10">
        <Button variant="ghost" asChild className="mb-8 -ml-4 hover:bg-muted/50">
          <Link href={`/${lang}/projects`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-bold uppercase text-xs tracking-widest">
            <ArrowLeft className="w-4 h-4" />
            {lang === "fr" ? "Retour aux projets" : "Back to projects"}
          </Link>
        </Button>

        <div className="space-y-8 md:space-y-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 border border-border/50 text-muted-foreground">
              <Icon className="h-4 w-4" />
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest leading-none pt-0.5">
                {category}
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tighter uppercase leading-[0.9] text-balance">
              {title}
            </h1>
          </div>

          <div className="prose dark:prose-invert max-w-none text-lg sm:text-xl text-muted-foreground leading-relaxed font-normal">
            <p className="text-foreground font-medium mb-6">{description}</p>
            {/* Detailed content would go here if available in the model */}
            {initiative.details && (
              <div className="mt-8 pt-8 border-t border-border/40">
                <p>{(initiative.details as any)[lang] || initiative.details.fr}</p>
              </div>
            )}
          </div>

          {initiative.link && (
            <div className="pt-8">
              <Button asChild size="lg" className="rounded-full px-8 py-6 font-bold uppercase tracking-widest transition-transform hover:scale-105">
                <a href={initiative.link} target="_blank" rel="noopener noreferrer">
                  {lang === "fr" ? "Voir la réalisation" : "View achievement"}
                </a>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
