import { publicContent } from "@/lib/cms/content";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Portrait } from "@/components/sections/Team";
import { ArrowIcon } from "@/components/ui/Icons";
import { BookFaq } from "@/components/sections/BookFaq";

import { poleStyles } from "@/data/services";

export const metadata: Metadata = {
  title: "L'équipe — OPUS CORP",
  description:
    "Découvrez les membres de l'équipe OPUS CORP à Cotonou : direction, gestion de projet, opérations, design graphique et communication BTL.",
};

export default async function TeamListPage() {
  const { site, team } = await publicContent();
  return (
    <>
      <PageHero
        title="L'équipe OPUS"
        eyebrow={site.motto}
        subtitle="Direction, pilotage de projet, opérations terrain, design et communication : découvrez les visages et les expertises qui donnent vie à chaque expérience signée OPUS CORP."
      >
        <span className="inline-grid h-12 min-w-12 place-items-center rounded-md bg-brand px-3 font-inter text-[18px] font-semibold text-black">
          {String(team.length).padStart(2, "0")}
        </span>
      </PageHero>

      <section className="wrap pb-24 md:pb-32">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {team.map((m, i) => {
            const pole = poleStyles[m.pole];
            return (
              <Reveal key={m.slug} delay={0.1 * (i % 3)}>
                <Link
                  href={`/equipe/${m.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-mint-50 transition-all duration-500 hover:border-brand/60 hover:shadow-[0_0_50px_rgba(237,106,61,0.14)]"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-mint-100">
                    <Portrait
                      m={m}
                      sizes="(min-width: 1200px) 33vw, (min-width: 810px) 50vw, 100vw"
                    />
                    <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-navy/85 px-3.5 py-1.5 backdrop-blur-md">
                      <span className={`size-2 rounded-full ${pole.bg}`} />
                      <span className="t-mono-sm text-white">
                        {m.department}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-6 lg:p-8">
                    <div>
                      <p className="t-mono-sm text-brand">{m.role}</p>
                      <h2 className="mt-2 font-display text-[26px] font-semibold tracking-[-0.03em] text-white transition-colors group-hover:text-brand lg:text-[30px]">
                        {m.name}
                      </h2>
                      <p className="t-body mt-4 text-muted line-clamp-3">
                        {m.excerpt}
                      </p>
                    </div>

                    <div className="mt-6 border-t border-line pt-5">
                      <div className="flex flex-wrap gap-2">
                        {m.expertise.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="t-mono-sm rounded-full border border-line px-3 py-1 text-slate"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      <span className="mt-5 inline-flex items-center gap-2 font-mono text-[14px] font-medium text-brand transition-transform group-hover:translate-x-1">
                        Découvrir son profil
                        <ArrowIcon className="size-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <BookFaq />
    </>
  );
}
