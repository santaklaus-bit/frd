import { Target, Users, Lightbulb, TrendingUp, ArrowRight } from "lucide-react";
import { getDictionary } from "@/lib/get-dictionary";
import { getData } from "@/lib/content-manager";
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

  // Dynamic read — reflects admin changes instantly without a rebuild
  const rawInitiatives = await getData("initiatives");
  const initiatives = rawInitiatives
    .filter((item: any) => item.slug) // skip empty drafts
    .map((item: any) => ({
      ...item,
      icon: ICON_MAP[item.icon] || Lightbulb,
      title: item.title?.[lang] ?? item.title?.fr ?? "",
      description: item.description?.[lang] ?? item.description?.fr ?? "",
      category: item.category?.[lang] ?? item.category?.fr ?? "",
    }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">
        <div className="max-w-4xl mb-10 md:mb-16 lg:mb-20 text-center mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-semibold mb-4 md:mb-6 uppercase tracking-tighter">
            {dict.projects.title}
          </h1>
          <p className="text-base sm:text-lg md:text-xl font-normal leading-tight mb-3 md:mb-6">
            {dict.projects.intro}
          </p>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
            {dict.projects.description}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
          {(initiatives as any[]).map((initiative: any, index: number) => (
            <div
              key={index}
              className="p-6 sm:p-8 md:p-10 lg:p-12 border border-border rounded-2xl md:rounded-[2rem] lg:rounded-[2.5rem] bg-background hover:bg-muted/10 hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="mb-5 md:mb-6 lg:mb-8 p-3 md:p-4 lg:p-5 rounded-xl md:rounded-2xl bg-muted/30 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors w-fit">
                <initiative.icon className="h-7 w-7 md:h-8 md:w-8 lg:h-10 lg:w-10" />
              </div>
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <span className="text-[10px] md:text-xs font-bold px-2.5 md:px-4 py-1 md:py-1.5 rounded-full bg-muted text-muted-foreground uppercase tracking-widest">
                  {initiative.category}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-serif font-semibold mb-3 md:mb-4 uppercase tracking-tighter">
                {initiative.title}
              </h2>
              <p className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed mb-5 md:mb-6 lg:mb-8">
                {initiative.description}
              </p>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground">
                {lang === "fr" ? "En savoir plus" : "Learn more"}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 md:mt-24 lg:mt-32 p-8 sm:p-10 md:p-12 lg:p-16 rounded-2xl md:rounded-[2rem] lg:rounded-[3rem] bg-black dark:bg-white text-white dark:text-black text-center relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-tighter mb-5 md:mb-6 lg:mb-8 leading-tight max-w-3xl mx-auto">
              {dict.projects.outro}
            </p>
            <Link href={`/${lang}/contact`}>
              <Button
                size="lg"
                variant="outline"
                className="px-6 sm:px-8 md:px-12 py-5 sm:py-6 md:py-8 rounded-full font-bold uppercase tracking-widest border-2 hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-all transform hover:scale-105 text-sm sm:text-base"
              >
                {lang === "fr" ? "Me contacter" : "Contact me"}
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
