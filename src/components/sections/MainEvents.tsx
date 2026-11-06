"use client";
import { useContent } from "@/components/cms/ContentProvider";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { EventCard } from "@/components/ui/EventCard";
import { Reveal } from "@/components/ui/Reveal";
import { CardStack } from "@/components/ui/CardStack";
import { ArrowIcon } from "@/components/ui/Icons";

/** "Nos événements" : grille 2 colonnes (desktop) · pile de cartes à swiper (mobile). */
export function MainEvents() {
  const { events } = useContent();
  const homeEvents = events.slice(0, 5);
  const [current, setCurrent] = useState(0);
  const ev = homeEvents[Math.min(current, homeEvents.length - 1)];
  if (!ev) return null;
  return (
    <section className="wrap py-24 md:py-32">
      <SectionHeading
        index="01"
        first="Nos"
        rest="événements"
        description="Découvrez les événements et expériences de marque auxquels OPUS CORP contribue."
        cta={{ label: "Tous les événements", href: "/evenements" }}
      />

      {/* Desktop / tablette */}
      <ul className="mt-12 hidden grid-cols-1 gap-x-7 gap-y-14 md:mt-16 md:grid md:grid-cols-2">
        {homeEvents.map((ev, i) => (
          <Reveal as="li" key={ev.slug} delay={0.15 + (i % 2) * 0.15}>
            <EventCard ev={ev} />
          </Reveal>
        ))}
      </ul>

      {/* Mobile : pile de cartes */}
      <Reveal className="mt-10 md:hidden">
        <p className="t-mono-sm mb-4 text-muted">
          Glissez la carte pour passer à la suivante →
        </p>
        <CardStack
          items={homeEvents}
          keyOf={(e) => e.slug}
          onChange={setCurrent}
          aspect="4 / 5"
          render={(e) => (
            <div className="relative h-full w-full">
              <Image
                src={e.image}
                alt={e.alt}
                fill
                sizes="90vw"
                className="pointer-events-none object-cover"
                draggable={false}
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 pt-20">
                <p className="t-mono-sm text-brand">
                  {e.category} · {e.dateLabel}
                </p>
                <h3 className="mt-2 font-hanken text-[24px] font-bold uppercase leading-[1.05] tracking-[-0.02em] text-white">
                  {e.title}
                </h3>
                <p className="t-mono-sm mt-1 text-white/70">
                  {e.city}, {e.country}
                </p>
              </div>
            </div>
          )}
        />
        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="font-display text-[13px] font-bold text-brand">
            {String(current + 1).padStart(2, "0")}{" "}
            <span className="text-muted">
              / {String(homeEvents.length).padStart(2, "0")}
            </span>
          </p>
          <Link
            href={`/evenements/${ev.slug}`}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-brand px-4 font-mono text-[14px] font-medium text-white transition-colors hover:bg-brand hover:text-black"
          >
            Voir l’événement <ArrowIcon className="size-4" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
