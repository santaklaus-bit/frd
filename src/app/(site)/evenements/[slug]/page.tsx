import type { Metadata } from "next";
import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";
import { publicContent, redirectTarget } from "@/lib/cms/content";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EventCard } from "@/components/ui/EventCard";
import { HelpForm } from "@/components/sections/HelpForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { events } = await publicContent();
  const ev = events.find((event) => event.slug === slug);
  return {
    title: ev ? ev.seoTitle || `${ev.title} — OPUS CORP` : "Événement",
    description: ev?.seoDescription || ev?.excerpt,
    openGraph: ev ? { images: [{ url: ev.image, alt: ev.alt }] } : undefined,
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { events } = await publicContent();
  const ev = events.find((event) => event.slug === slug);
  if (!ev) {
    const target = redirectTarget("events", slug);
    if (target) permanentRedirect(`/evenements/${target}`);
    notFound();
  }
  const more = events.filter((e) => e.slug !== ev.slug).slice(0, 2);

  return (
    <>
      <PageHero
        title={ev.title}
        eyebrow={ev.category}
        subtitle={ev.excerpt}
        align="split"
        size="big"
      >
        <Button href="/reserver" size="sm">
          Un projet similaire ?
        </Button>
      </PageHero>

      <section className="wrap pb-16">
        <Reveal
          delay={0.2}
          className="grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-8 md:grid-cols-5"
        >
          <Meta k="Lieu :" v={`${ev.venue}, ${ev.city}`} />
          <Meta k="Intervention OPUS :" v={ev.role} />
          <Meta k="Public :" v={ev.audience} />
          <Meta k="Date :" v={ev.dateLabel} />
          <Meta k="Horaires :" v={ev.hours} />
        </Reveal>
        <Reveal
          delay={0.3}
          className="relative mt-12 aspect-[4/5] overflow-hidden rounded-lg md:aspect-[1376/720]"
        >
          <Image
            src={ev.image}
            alt={ev.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </Reveal>
      </section>

      <section className="wrap pb-24 md:pb-32">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[320px_1fr]">
          <Reveal>
            <h4 className="t-mono text-brand">(À propos de l’événement)</h4>
          </Reveal>
          <div className="flex flex-col gap-8">
            {ev.about.map((p, i) => (
              <Reveal key={i} delay={0.2 + i * 0.1}>
                <p className="h-quote text-white">{p}</p>
              </Reveal>
            ))}
            <Reveal delay={0.4}>
              <h4 className="font-hanken text-[20px] font-semibold uppercase tracking-[-0.04em] text-white">
                {ev.lineupLabel}
              </h4>
              <ul className="mt-4 flex flex-wrap gap-3">
                {ev.lineup.map((a) => (
                  <li
                    key={a}
                    className="t-mono rounded-full border border-line px-4 py-2 text-muted"
                  >
                    {a}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {ev.gallery && ev.gallery.length > 1 && (
        <section className="wrap pb-24 md:pb-32">
          <Reveal>
            <h3 className="font-hanken text-[24px] font-semibold uppercase tracking-[-0.04em] text-white lg:text-[28px]">
              Galerie photos du projet
            </h3>
            <p className="t-mono-sm mt-2 text-muted">
              Immersion dans les réalisations et dispositifs déployés sur le
              terrain.
            </p>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ev.gallery.map((img, i) => (
              <Reveal
                key={i}
                delay={0.1 * i}
                className="group relative aspect-square overflow-hidden rounded-lg border border-line bg-card"
              >
                <Image
                  src={img}
                  alt={`${ev.title} — cliché ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="wrap pb-24 md:pb-32">
        <SectionHeading
          first="Plus"
          rest="d'événements"
          description="Découvrez d'autres interventions d'OPUS CORP."
          cta={{ label: "Tous les événements", href: "/evenements" }}
        />
        <ul className="mt-12 grid grid-cols-1 gap-x-7 gap-y-14 md:grid-cols-2 lg:mt-16">
          {more.map((e, i) => (
            <Reveal as="li" key={e.slug} delay={0.15 + i * 0.15}>
              <EventCard ev={e} />
            </Reveal>
          ))}
        </ul>
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
