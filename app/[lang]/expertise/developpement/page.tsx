import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import Image from "next/image";
import { getData } from "@/lib/content-manager";

export const metadata: Metadata = {
  title: "Développement — Expertise | Farid Danko",
};

export default async function DeveloppementPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const isFr = lang === "fr";

  const initiatives = await getData("expertise");
  const initiative = initiatives.find((i: any) => i.slug === "developpement");

  const axes = isFr
    ? [
        "Diagnostic organisationnel",
        "Structuration stratégique",
        "Gouvernance et fonctionnement interne",
        "Développement de programmes",
        "Accompagnement institutionnel",
      ]
    : [
        "Organizational diagnosis",
        "Strategic structuring",
        "Governance and internal functioning",
        "Programme development",
        "Institutional support",
      ];

  const projects = [
    { label: isFr ? "Diagnostic sanitaire – Bénin" : "Health diagnostic – Benin", href: `/${lang}/projects` },
    { label: isFr ? "Projets associatifs et coopératifs accompagnés" : "Supported associative and cooperative projects", href: `/${lang}/projects` },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── BANNER IMAGE ── */}
      {initiative?.image && (
        <div className="relative w-full h-[30vh] md:h-[45vh] overflow-hidden">
          <Image
            src={initiative.image}
            alt={(initiative.title as any)[lang] || "Développement"}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-background" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 md:px-12 py-16 md:py-24 relative z-10">

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
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/50 mb-5">02</p>
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-6">
            {isFr ? "Développement" : "Development"}
          </h1>
          <p className="text-base md:text-lg text-foreground/80 leading-relaxed">
            {isFr
              ? "Le développement organisationnel consiste à renforcer la capacité des organisations à se structurer, à fonctionner efficacement et à porter des solutions durables."
              : "Organizational development means strengthening the capacity of organizations to structure themselves, operate effectively and deliver durable solutions."}
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
              ? "L'intervention vise à clarifier les priorités, renforcer les mécanismes de fonctionnement et soutenir la mise en œuvre de solutions adaptées aux contextes locaux."
              : "The intervention aims to clarify priorities, strengthen operational mechanisms and support the implementation of solutions adapted to local contexts."}
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
