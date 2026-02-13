import { Target, Users, Lightbulb, TrendingUp, ArrowRight } from "lucide-react";
import { getDictionary } from "@/lib/get-dictionary";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function InitiativesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "fr");

  const initiatives = [
    {
      icon: Target,
      title:
        lang === "fr"
          ? "Programme d'apprentissage en milieu de travail"
          : "Workplace Learning Programme",
      description:
        lang === "fr"
          ? "Programme d'envergure pour les métiers du secteur de l'environnement, visant à faciliter l'insertion professionnelle."
          : "Large-scale programme for environmental sector trades, aimed at facilitating professional integration.",
      category: lang === "fr" ? "Employabilité" : "Employability",
    },
    {
      icon: Users,
      title:
        lang === "fr"
          ? "Insertion socioprofessionnelle"
          : "Socio-professional Integration",
      description:
        lang === "fr"
          ? "Coordination de programmes dédiés à l'employabilité et à l'insertion socioprofessionnelle."
          : "Coordination of programmes dedicated to employability and socio-professional integration.",
      category: lang === "fr" ? "Développement social" : "Social Development",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="max-w-4xl mb-20 text-center mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold mb-8 uppercase tracking-tighter">
            {dict.initiatives.title}
          </h1>
          <p className="text-2xl font-medium leading-tight mb-6">
            {dict.initiatives.intro}
          </p>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {dict.initiatives.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {initiatives.map((initiative, index) => (
            <div
              key={index}
              className="p-12 border border-border rounded-[2.5rem] bg-background hover:bg-muted/10 hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="mb-8 p-5 rounded-2xl bg-muted/30 group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors w-fit">
                <initiative.icon className="h-10 w-10" />
              </div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-xs font-bold px-4 py-1.5 rounded-full bg-muted text-muted-foreground uppercase tracking-widest">
                  {initiative.category}
                </span>
              </div>
              <h2 className="text-3xl font-bold mb-4 uppercase tracking-tighter">
                {initiative.title}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                {initiative.description}
              </p>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground">
                {lang === "fr" ? "En savoir plus" : "Learn more"}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-32 p-16 rounded-[3rem] bg-black dark:bg-white text-white dark:text-black text-center relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-3xl font-bold uppercase tracking-tighter mb-8 leading-tight max-w-3xl mx-auto">
              {dict.initiatives.outro}
            </p>
            <Link href={`/${lang}/contact`}>
              <Button
                size="lg"
                variant="outline"
                className="px-12 py-8 rounded-full font-bold uppercase tracking-widest border-2 hover:bg-white hover:text-black dark:hover:bg-black dark:hover:text-white transition-all transform hover:scale-105"
              >
                {lang === "fr" ? "Me contacter" : "Contact me"}
              </Button>
            </Link>
          </div>
          {/* Visual decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 dark:bg-black/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 dark:bg-black/5 rounded-full -ml-32 -mb-32 blur-3xl" />
        </div>
      </div>
    </div>
  );
}
