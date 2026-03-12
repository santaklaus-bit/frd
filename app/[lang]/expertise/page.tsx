import Link from "next/link";
import { Zap, TrendingUp, Users, ArrowRight } from "lucide-react";
import { getDictionary } from "@/lib/get-dictionary";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "fr");
  return {
    title: dict.seo.expertise.title,
    description: dict.seo.expertise.description,
    alternates: { canonical: `/${lang}/expertise` },
  };
}

export default async function ExpertisePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "fr");

  const sections = [
    {
      key: "autonomisation",
      icon: Zap,
      title: dict.expertise.subpages.autonomisation.title,
      description: dict.expertise.subpages.autonomisation.desc,
      details: dict.expertise.subpages.autonomisation.details,
      href: `/${lang}/expertise/autonomisation`,
    },
    {
      key: "developpement",
      icon: TrendingUp,
      title: dict.expertise.subpages.developpement.title,
      description: dict.expertise.subpages.developpement.desc,
      details: dict.expertise.subpages.developpement.details,
      href: `/${lang}/expertise/developpement`,
    },
    {
      key: "inclusion",
      icon: Users,
      title: dict.expertise.subpages.inclusion.title,
      description: dict.expertise.subpages.inclusion.desc,
      details: dict.expertise.subpages.inclusion.details,
      href: `/${lang}/expertise/inclusion`,
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="max-w-4xl mb-12 md:mb-20 text-center mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 uppercase tracking-tighter">
            {dict.expertise.title}
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl font-medium leading-tight mb-4 md:mb-6">
            {dict.expertise.description}
          </p>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            {dict.expertise.intro}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section) => (
            <Link
              key={section.key}
              href={section.href}
              className="group p-8 md:p-10 border border-border rounded-3xl bg-background hover:bg-muted/10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="mb-6 md:mb-8 p-3 md:p-4 rounded-2xl bg-muted/30 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors w-fit">
                <section.icon className="h-6 w-6 md:h-8 md:w-8" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 uppercase tracking-tighter">
                {section.title}
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed mb-4 md:mb-6 font-medium">
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

        <div className="mt-20 md:mt-32 p-8 md:p-12 rounded-3xl bg-black dark:bg-white text-white dark:text-black text-center">
          <p className="text-xl md:text-2xl font-bold uppercase tracking-tight">
            {dict.expertise.outro}
          </p>
        </div>
      </div>
    </div>
  );
}
