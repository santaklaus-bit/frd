import { publicContent } from "@/lib/cms/content";
import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { Team } from "@/components/sections/Team";
import { BookFaq } from "@/components/sections/BookFaq";

export const metadata: Metadata = { title: "À propos — OPUS CORP" };

/**
 * APR.CHI.01 / CHI.01–04 : aucun chiffre CHI fourni pour OPUS (les valeurs du classeur sont celles de Wall Africa).
 * Compteurs calculés à partir des fiches EVT fournies : nombre de projets et public cumulé (somme des « Public et unité »).
 */

export default async function AboutPage() {
  const { site, events, pages } = await publicContent();
  const stats = [
    { n: events.length, suffix: "", label: "Projets réalisés en 2026" },
    { n: 26500, suffix: "+", label: "Personnes accueillies", grouped: true },
    { n: 3, suffix: "", label: "Pôles : design, branding, event" },
    { n: 2026, suffix: "", label: "Démarrage opérationnel" },
  ];
  return (
    <>
      <PageHero title="À propos" subtitle={pages.aboutSubtitle} />

      <section className="wrap pb-24">
        {/* APR.HER.03 — image OPUS autorisée à fournir (visuel libre de droits en attendant) */}
        <Reveal className="relative aspect-[4/5] overflow-hidden rounded-lg md:aspect-[1376/640]">
          <Image
            src={pages.aboutImage}
            alt={pages.aboutImageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </Reveal>
      </section>

      <section className="wrap pb-24 md:pb-32">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
          <Reveal>
            <h3 className="h-quote max-w-[980px] text-white">
              {site.mission} {site.promise}
            </h3>
          </Reveal>
          <Reveal delay={0.3} className="lg:text-right">
            <p className="t-eyebrow text-muted">Ils nous font confiance</p>
            {/* APR.PAR.02 / PAR.01 — Canal+ (client). PAR.02–06 non renseignés. */}
            <p className="mt-3 font-display text-[22px] font-semibold tracking-[-0.03em] text-white">
              Canal+
            </p>
          </Reveal>
        </div>
        <Reveal
          delay={0.2}
          className="mt-16 grid grid-cols-2 gap-y-10 border-t border-line pt-10 md:grid-cols-4"
        >
          {stats.map((s) => (
            <div key={s.label}>
              <p className="font-hanken text-[44px] font-bold leading-none tracking-[-0.04em] text-white md:text-[64px]">
                <Counter to={s.n} duration={2} grouped={"grouped" in s} />
                {s.suffix}
              </p>
              <p className="t-mono mt-3 uppercase text-muted">{s.label}</p>
            </div>
          ))}
        </Reveal>
      </section>

      {/* APR.CUL — culture / promesse (attribution institutionnelle, pas un témoignage) */}
      <section className="bg-forest text-black">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <Reveal className="relative aspect-[4/5] md:aspect-auto md:min-h-[680px]">
            <Image
              src={pages.cultureImage}
              alt={pages.cultureImageAlt}
              fill
              sizes="(min-width: 810px) 50vw, 100vw"
              className="object-cover"
            />
          </Reveal>
          <div className="flex flex-col justify-between gap-16 px-5 py-10 md:px-10 md:py-14 lg:px-16 lg:py-16">
            <Reveal>
              <h2 className="h-big max-w-[560px]">{pages.cultureTitle}</h2>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="h-quote max-w-[560px]">{pages.cultureText}</p>
              <p className="mt-4 t-eyebrow text-black/80">
                {site.name} — {site.tagline}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <Team />
      <BookFaq />
    </>
  );
}
