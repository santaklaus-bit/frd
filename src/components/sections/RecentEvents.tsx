"use client";
import { useContent } from "@/components/cms/ContentProvider";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { glassRise } from "@/lib/motion";
import { RollingGallery } from "@/components/ui/RollingGallery";
import { cn } from "@/lib/utils";

/**
 * Événements récents : grande image 16:9 + carte glass (backdrop-blur 48px) en bas à gauche
 * + bande de 4 vignettes (N&B → couleur au hover, clic = change l'image principale).
 * Mobile : galerie 3D cylindrique (glisser pour tourner).
 */
export function RecentEvents() {
  const { events } = useContent();
  const recent = events.slice(0, 4);
  const [active, setActive] = useState(0);
  const ev = recent[Math.min(active, recent.length - 1)];
  if (!ev) return null;
  return (
    <section className="wrap pb-24 md:pb-32">
      <SectionHeading
        index="02"
        first="Événements"
        rest="récents"
        description="Découvrez nos dernières interventions, de la conception au déploiement."
      />

      {/* Desktop / tablette */}
      <Reveal
        delay={0.2}
        className="relative mt-12 hidden aspect-[1376/980] overflow-hidden rounded-lg md:block lg:mt-16"
      >
        {recent.map((r, i) => (
          <motion.div
            key={r.slug}
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: i === active ? 1 : 0 }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src={r.image}
              alt={r.alt}
              fill
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <motion.div
          key={ev.slug}
          variants={glassRise}
          initial="hidden"
          animate="show"
          className="absolute bottom-[26%] left-[4.6%] w-[min(600px,60%)] rounded-lg border border-white/10 bg-black/60 p-6 text-white backdrop-blur-[48px] lg:p-8"
        >
          <h4 className="font-hanken text-[22px] font-semibold tracking-[-0.04em] leading-none lg:text-[26px]">
            <Link href={`/evenements/${ev.slug}`} className="hover:text-brand">
              {ev.title}
            </Link>
          </h4>
          <p className="t-mono-sm mt-2 text-muted">
            {ev.dateLabel} — {ev.city}
          </p>
          <p className="t-body mt-5 text-slate">{ev.excerpt}</p>
        </motion.div>
        <ul className="absolute inset-x-[4.6%] bottom-[4%] grid grid-cols-4 gap-2">
          {recent.map((r, i) => (
            <li key={r.slug}>
              <button
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                aria-label={r.title}
                className={cn(
                  "relative block aspect-[286/155] w-full overflow-hidden rounded-md transition-all duration-500",
                  i === active
                    ? "grayscale-0 ring-2 ring-brand"
                    : "grayscale hover:grayscale-0",
                )}
              >
                <Image
                  src={r.image}
                  alt=""
                  fill
                  sizes="25vw"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      </Reveal>

      {/* Mobile : galerie 3D */}
      <Reveal className="mt-10 md:hidden">
        <RollingGallery
          height={300}
          images={[...recent, ...events.slice(4, 6)].map((r) => ({
            src: r.image,
            alt: r.alt,
            label: r.title,
            sub: `${r.dateLabel} — ${r.city}`,
          }))}
        />
        <p className="t-mono-sm mt-3 text-center text-muted">
          Glissez pour faire tourner la galerie
        </p>
      </Reveal>
    </section>
  );
}
