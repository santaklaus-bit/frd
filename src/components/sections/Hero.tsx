"use client";
import { useContent } from "@/components/cms/ContentProvider";
import { motion } from "motion/react";
import Link from "next/link";
import { heroScale, rise, EASE_FRAMER } from "@/lib/motion";

import { ArrowIcon } from "@/components/ui/Icons";
import { OpusLogo } from "@/components/ui/OpusLogo";
import { Magnet } from "@/components/ui/Magnet";

/**
 * Hero (ACC.HER) : vidéo de fond 100vh, logo « Opus. » en bas à gauche (scale .7→1) + triptyque DESIGN / BRANDING / EVENT (plan 3 de la charte),
 * paragraphe à droite, puis une ligne « Projet à la une » (titre + lieu · date · intervention) et un bouton vers la fiche du projet vedette.
 * ACC.HER.07 : le compteur de festivaliers est remplacé par le public du projet (aucun chiffre non justifié).
 * Vidéo : PLACEHOLDER libre de droits (Mixkit) → remplacer par « Opus event paysage.mp4 » (LIV.MED.04) + image de secours.
 */
export function Hero() {
  const { site, events, pages } = useContent();
  const featuredEvent = events.find((e) => e.featured) ?? events[0];
  const ev = featuredEvent;
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-black text-white">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={pages.heroVideo}
        poster={pages.heroPoster}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/45" />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1 bg-opus-gradient"
      />

      <div className="relative w-full px-5 pb-8 pt-40 md:px-10 md:pb-10 lg:px-16 lg:pb-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <motion.h1
            variants={heroScale}
            initial="hidden"
            animate="show"
            className="flex origin-bottom-left items-center gap-5 text-white md:gap-7"
          >
            <span className="sr-only">
              {site.name} — Design, Branding, Event
            </span>
            <OpusLogo
              variant="mark"
              title=""
              className="w-[min(64vw,280px)] md:w-[360px] lg:w-[430px]"
            />
            <span
              aria-hidden
              className="t-eyebrow flex flex-col gap-2 text-white/85 md:gap-3"
            >
              <span className="flex items-center gap-3">
                <span className="size-1.5 rounded-full bg-design" />
                Design
              </span>
              <span className="flex items-center gap-3">
                <span className="size-1.5 rounded-full bg-branding" />
                Branding
              </span>
              <span className="flex items-center gap-3">
                <span className="size-1.5 rounded-full bg-event" />
                Event
              </span>
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.3, ease: EASE_FRAMER }}
            className="t-body max-w-[360px] text-white/80 md:text-[17px] lg:mb-2"
          >
            {site.description}
          </motion.p>
        </div>

        {/* Projet à la une (ACC.HER.03–07) : une seule ligne discrète au lieu de trois colonnes */}
        {ev && (
          <motion.div
            variants={rise(0.3)}
            initial="hidden"
            animate="show"
            className="mt-10 flex flex-col gap-5 border-t border-white/15 pt-6 md:flex-row md:items-center md:justify-between lg:mt-14"
          >
            <div className="min-w-0">
              <p className="t-eyebrow text-brand">Projet à la une</p>
              <p className="mt-2 font-display text-[17px] font-medium tracking-[-0.01em] text-white md:text-[19px]">
                {ev.title}
              </p>
              <p className="t-mono-sm mt-1 text-white/60">
                {ev.city}, {ev.country} · {ev.dateLabel} · {ev.role}
              </p>
            </div>
            <Magnet
              padding={20}
              strength={0.25}
              className="-m-5 self-start md:self-auto"
            >
              <Link
                href={`/evenements/${ev.slug}`}
                className="group inline-flex h-12 shrink-0 items-center gap-3 rounded-full border border-white/25 pl-6 pr-2 font-mono text-[15px] font-medium text-white transition-colors duration-300 hover:border-brand hover:bg-brand hover:text-black"
              >
                Voir le projet
                <span className="grid size-9 place-items-center rounded-full bg-brand text-black transition-colors group-hover:bg-black group-hover:text-brand">
                  <ArrowIcon className="size-4 transition-transform duration-500 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Magnet>
          </motion.div>
        )}
      </div>
    </section>
  );
}
