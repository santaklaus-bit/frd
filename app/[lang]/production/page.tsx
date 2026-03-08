import Link from "next/link";
import { Video, Mic, Film, MapPin, Camera, ArrowRight } from "lucide-react";
import { getDictionary } from "@/lib/get-dictionary";
import { getData } from "@/lib/content-manager";
import { Metadata } from "next";

const ICON_MAP: Record<string, any> = {
  Video,
  Mic,
  Film,
  MapPin,
  Camera,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "fr");
  return {
    title: dict.seo.production.title,
    description: dict.seo.production.description,
    alternates: { canonical: `/${lang}/production` },
  };
}

export default async function ProductionPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "fr");

  // Dynamic read — reflects admin changes instantly without a rebuild
  const rawProduction = await getData("production");
  const sections = rawProduction
    .filter((item: any) => item.slug)
    .map((item: any) => ({
      title: item.title?.[lang] ?? item.title?.fr ?? "",
      description: item.description?.[lang] ?? item.description?.fr ?? "",
      details: item.details?.[lang] ?? item.details?.fr ?? "",
      href: `/${lang}${item.href}`,
      icon: ICON_MAP[item.icon] || Video,
    }));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-4xl mb-20 text-center mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 uppercase tracking-tighter">
            {dict.production.title}
          </h1>
          <p className="text-3xl font-medium leading-tight mb-6">
            {dict.production.description}
          </p>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {dict.production.intro}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(sections as any[]).map((section: any) => (
            <Link
              key={section.href}
              href={section.href}
              className="group p-10 border border-border rounded-3xl bg-background hover:bg-muted/10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="mb-8 p-4 rounded-2xl bg-muted/30 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors w-fit">
                <section.icon className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-bold mb-4 uppercase tracking-tighter">
                {section.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6 font-medium">
                {section.description}
              </p>
              <p className="text-sm text-muted-foreground/60 mb-8 italic">
                {section.details}
              </p>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground">
                {lang === "fr" ? "Explorer" : "Explore"}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-32 p-12 rounded-3xl bg-black dark:bg-white text-white dark:text-black text-center">
          <p className="text-2xl font-bold uppercase tracking-tight">
            {dict.production.outro}
          </p>
        </div>
      </div>
    </div>
  );
}
