import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { publicContent, redirectTarget } from "@/lib/cms/content";
import { poleStyles } from "@/data/services";
import type { CmsEvent } from "@/lib/cms/schema";

import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EventCard } from "@/components/ui/EventCard";
import { OpusLogo } from "@/components/ui/OpusLogo";
import { CheckIcon, ArrowIcon } from "@/components/ui/Icons";
import { Portrait } from "@/components/sections/Team";
import { HelpForm } from "@/components/sections/HelpForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { team } = await publicContent();
  const member = team.find((entry) => entry.slug === slug);
  return {
    title: member
      ? member.seoTitle || `${member.name} — ${member.role} | OPUS CORP`
      : "Membre de l'équipe — OPUS CORP",
    description: member?.seoDescription || member?.excerpt,
  };
}

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { team, events, site } = await publicContent();
  const member = team.find((entry) => entry.slug === slug);
  if (!member) {
    const target = redirectTarget("team", slug);
    if (target) permanentRedirect(`/equipe/${target}`);
    notFound();
  }

  const pole = poleStyles[member.pole];
  const memberProjects = member.projectSlugs
    .map((s) => events.find((e) => e.slug === s))
    .filter((e): e is CmsEvent => Boolean(e));
  const otherMembers = team.filter((m) => m.slug !== member.slug);

  return (
    <>
      <PageHero
        title={member.name}
        eyebrow={`${member.department} — ${member.role}`}
        subtitle={member.excerpt}
        align="split"
        size="big"
      >
        <div className="flex flex-wrap items-center gap-3">
          <Button href={site.cta.href} size="sm">
            {site.cta.label}
          </Button>
          <Button href="/equipe" variant="outline" size="sm">
            Toute l’équipe
          </Button>
        </div>
      </PageHero>

      <section className="wrap pb-16">
        <Reveal
          delay={0.15}
          className="grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-8 md:grid-cols-4"
        >
          <Meta k="Fonction :" v={member.role} />
          <Meta k="Département :" v={member.department} />
          <div>
            <p className="t-mono-sm text-muted">Pôle de rattachement :</p>
            <p className="mt-2 inline-flex items-center gap-2 font-hanken text-[18px] font-semibold tracking-[-0.04em] text-white lg:text-[20px]">
              <span className={`size-2.5 rounded-full ${pole.bg}`} />
              OPUS {pole.label.toUpperCase()}
            </p>
          </div>
          <Meta k="Base opérationnelle :" v={site.city} />
        </Reveal>
      </section>

      <section className="wrap pb-24 md:pb-32">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[460px_1fr] lg:gap-16">
          <div className="flex flex-col gap-6">
            <Reveal className="group relative aspect-[4/5] w-full overflow-hidden rounded-lg border border-line bg-mint-100">
              <Portrait m={member} sizes="(min-width: 1200px) 460px, 100vw" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-6 text-white">
                <p className="t-eyebrow text-brand">{site.name}</p>
                <p className="mt-1 font-display text-[22px] font-semibold tracking-[-0.03em]">
                  {member.name}
                </p>
                <p className="t-mono-sm text-white/80">{member.role}</p>
              </div>
            </Reveal>

            <Reveal
              delay={0.2}
              className="rounded-lg bg-forest p-6 text-black lg:p-8"
            >
              <div className="flex items-center justify-between">
                <span className="t-eyebrow text-black/80">
                  Vision & exigence
                </span>
                <OpusLogo variant="mark" title="" className="w-8 opacity-80" />
              </div>
              <blockquote className="mt-4 font-hanken text-[20px] font-medium leading-[1.3] tracking-[-0.02em] lg:text-[22px]">
                « {member.quote} »
              </blockquote>
              <p className="t-mono-sm mt-4 font-semibold text-black/80">
                — {member.name}, {member.role}
              </p>
            </Reveal>
          </div>

          <div className="flex flex-col justify-between gap-12">
            <div>
              <Reveal>
                <h2 className="t-mono text-brand">(Présentation & parcours)</h2>
              </Reveal>
              <div className="mt-6 flex flex-col gap-6">
                {member.bio.map((paragraph, i) => (
                  <Reveal key={i} delay={0.15 + i * 0.1}>
                    <p
                      className={
                        i === 0 ? "h-quote text-white" : "t-body text-muted"
                      }
                    >
                      {paragraph}
                    </p>
                  </Reveal>
                ))}
              </div>
            </div>

            <Reveal
              delay={0.3}
              className="rounded-lg border border-line bg-mint-50 p-6 lg:p-8"
            >
              <h3 className="font-hanken text-[20px] font-semibold uppercase tracking-[-0.04em] text-white lg:text-[24px]">
                Responsabilités & missions clés
              </h3>
              <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {member.missions.map((mission) => (
                  <li key={mission} className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand/20 text-brand">
                      <CheckIcon className="size-3.5" />
                    </span>
                    <span className="t-mono-sm text-white/90">{mission}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={0.4}>
              <h3 className="font-hanken text-[20px] font-semibold uppercase tracking-[-0.04em] text-white">
                Domaines d’expertise
              </h3>
              <ul className="mt-4 flex flex-wrap gap-3">
                {member.expertise.map((skill) => (
                  <li
                    key={skill}
                    className="t-mono rounded-full border border-line bg-mint-50 px-4 py-2 text-muted"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {memberProjects.length > 0 && (
        <section className="wrap pb-24 md:pb-32">
          <SectionHeading
            first="Projets"
            rest="associés"
            description={`Découvrez quelques-unes des réalisations d'OPUS CORP auxquelles ${member.name} a contribué.`}
            cta={{ label: "Tous les événements", href: "/evenements" }}
          />
          <ul className="mt-12 grid grid-cols-1 gap-x-7 gap-y-14 md:grid-cols-2 lg:mt-16">
            {memberProjects.slice(0, 2).map((ev, i) => (
              <Reveal as="li" key={ev.slug} delay={0.15 + i * 0.15}>
                <EventCard ev={ev} />
              </Reveal>
            ))}
          </ul>
        </section>
      )}

      <section className="bg-mint-50 py-24 md:py-32">
        <div className="wrap">
          <SectionHeading
            first="Autres membres"
            rest="de l'équipe"
            description="Une équipe pluridisciplinaire mobilisée sur chaque projet, de la conception à la livraison terrain."
            cta={{ label: "Voir toute l'équipe", href: "/equipe" }}
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-5">
            {otherMembers.map((other, i) => (
              <Reveal key={other.slug} delay={0.08 * i}>
                <Link
                  href={`/equipe/${other.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-bg transition-all duration-300 hover:border-brand/60"
                >
                  <div className="relative aspect-[4/5] w-full overflow-hidden bg-mint-100">
                    <Portrait
                      m={other}
                      sizes="(min-width: 1200px) 20vw, 50vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <p className="t-eyebrow text-brand">{other.department}</p>
                      <h3 className="mt-1.5 font-display text-[18px] font-semibold tracking-[-0.03em] text-white transition-colors group-hover:text-brand">
                        {other.name}
                      </h3>
                      <p className="t-mono-sm mt-1 text-muted">{other.role}</p>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1.5 font-mono text-[12px] font-medium text-brand">
                      Voir le profil
                      <ArrowIcon className="size-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <HelpForm compact />
    </>
  );
}

function Meta({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="t-mono-sm text-muted">{k}</p>
      <p className="mt-2 font-hanken text-[18px] font-semibold tracking-[-0.04em] text-white lg:text-[20px]">
        {v}
      </p>
    </div>
  );
}
