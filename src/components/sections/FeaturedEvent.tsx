"use client";
import { useContent } from "@/components/cms/ContentProvider";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/ui/Reveal";
import { SparkIcon } from "@/components/ui/Icons";
import { fadeIn } from "@/lib/motion";
import { TiltCard } from "@/components/ui/TiltCard";

/** Projet vedette (ACC.FOC) : bloc doré pleine largeur — titre + texte éditorial + intervention OPUS à gauche, image plein hauteur à droite. */
export function FeaturedEvent() {
  const { events } = useContent();
  const featuredEvent = events.find((e) => e.featured) ?? events[0];
  const ev = featuredEvent;
  if (!ev) return null;
  return (
    <section className="grid grid-cols-1 bg-bg text-black md:bg-forest md:grid-cols-2">
      {/* Mobile : image d'abord, la carte dorée chevauche */}
      <Reveal className="relative aspect-[4/5] md:hidden">
        <Image
          src={ev.image}
          alt={ev.alt}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-transparent" />
      </Reveal>
      <div className="grain relative z-10 -mt-24 mx-5 flex flex-col justify-between gap-10 rounded-xl bg-forest px-6 py-8 md:m-0 md:gap-16 md:rounded-none md:px-10 md:py-14 lg:px-16 lg:py-16">
        <Reveal variants={fadeIn}>
          <h2 className="h-big max-w-[560px]">
            <Link
              href={`/evenements/${ev.slug}`}
              className="transition-colors hover:text-white"
            >
              {ev.title}
            </Link>
          </h2>
        </Reveal>
        <Reveal delay={0.3} className="flex flex-col gap-4">
          <SparkIcon className="size-6 text-black" />
          <p className="h-quote max-w-[620px]">
            Chaque projet part de l’expérience à faire vivre au public. Concept,
            scénographie, communication et déploiement sont préparés pour former
            un ensemble cohérent.
          </p>
          <p className="t-eyebrow text-black/80">
            {ev.role} — {ev.dateLabel}
          </p>
        </Reveal>
      </div>
      <Reveal
        delay={0.2}
        className="relative hidden md:block md:aspect-auto md:min-h-[720px] lg:min-h-[850px]"
      >
        <TiltCard max={5} scale={1} className="absolute inset-0">
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src={ev.image}
              alt={ev.alt}
              fill
              sizes="(min-width: 810px) 50vw, 100vw"
              className="scale-[1.08] object-cover"
            />
          </div>
        </TiltCard>
      </Reveal>
      <div className="h-16 md:hidden" />
    </section>
  );
}
