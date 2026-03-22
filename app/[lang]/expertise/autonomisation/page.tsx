import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Autonomisation — Expertise | Farid Danko",
};

export default async function AutonomiPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const isFr = lang === "fr";

  const axes = isFr
    ? [
        "Structuration d'activités génératrices de revenus",
        "Analyse de chaînes de valeur",
        "Entrepreneuriat féminin et jeunesse",
        "Coopératives et dynamiques collectives",
        "Transformation locale et création de valeur",
      ]
    : [
        "Structuring income-generating activities",
        "Value chain analysis",
        "Women's and youth entrepreneurship",
        "Cooperatives and collective dynamics",
        "Local transformation and value creation",
      ];

  const projects = [
    { label: isFr ? "Filière piri piri – Kenya" : "Piri piri chain – Kenya", href: `/${lang}/projects` },
    { label: isFr ? "Filière viticole – Québec" : "Wine chain – Québec", href: `/${lang}/projects` },
    { label: isFr ? "Filière pomicole – Québec" : "Apple chain – Québec", href: `/${lang}/projects` },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-24">

        {/* Back */}
        <Link
          href={`/${lang}/expertise`}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-16"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {isFr ? "Expertise" : "Expertise"}
        </Link>

        {/* Header */}
        <div className="mb-14 pb-10 border-b border-border/50">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/50 mb-5">01</p>
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-6">
            {isFr ? "Autonomisation" : "Empowerment"}
          </h1>
          <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
            {isFr
              ? "L'autonomisation économique passe par la capacité à produire, structurer, transformer et créer de la valeur dans la durée."
              : "Economic empowerment requires the ability to produce, structure, transform and create lasting value."}
          </p>
          <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
            {isFr
              ? "Cette expertise s'inscrit dans des contextes où l'entrepreneuriat, l'organisation collective et la lecture des marchés deviennent des leviers de revenu et de résilience."
              : "This expertise applies in contexts where entrepreneurship, collective organization and market analysis become levers for income and resilience."}
          </p>
        </div>

        {/* Axes */}
        <section className="mb-14">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/50 mb-7">
            {isFr ? "Axes d'intervention" : "Areas of intervention"}
          </p>
          <div className="space-y-4">
            {axes.map((axe, i) => (
              <div key={axe} className="flex items-start gap-4">
                <span className="text-[10px] font-bold text-muted-foreground/40 tabular-nums mt-0.5 w-5 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm md:text-base text-foreground/80 leading-relaxed">{axe}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Approach */}
        <section className="mb-14 pb-10 border-b border-border/50">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/50 mb-5">
            {isFr ? "Approche" : "Approach"}
          </p>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            {isFr
              ? "L'approche privilégie l'observation du terrain, la compréhension des systèmes productifs et l'identification d'opportunités économiques adaptées aux réalités locales."
              : "The approach favours direct observation, understanding of productive systems and identifying economic opportunities suited to local realities."}
          </p>
        </section>

        {/* Projects */}
        <section>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/50 mb-6">
            {isFr ? "Projets liés" : "Related projects"}
          </p>
          <div className="flex flex-col">
            {projects.map((p) => (
              <Link
                key={p.label}
                href={p.href}
                className="group flex items-center justify-between py-4 border-b border-border/30 text-sm md:text-base text-foreground/70 hover:text-foreground transition-colors"
              >
                {p.label}
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-foreground group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
