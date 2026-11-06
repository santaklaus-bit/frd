"use client";
import { useContent } from "@/components/cms/ContentProvider";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { initials, type TeamMember } from "@/data/team";
import { OpusLogo } from "@/components/ui/OpusLogo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/ui/Icons";
import { springLayout } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * Équipe : accordéon horizontal — la carte active s'élargit (flex 4.6), les autres restent en bandes fines.
 * Hover/focus change la carte active ; clic ouvre la page de présentation du membre (`/equipe/[slug]`).
 * Mobile : scroll horizontal snap avec lien direct vers chaque fiche.
 */
export function Team() {
  const { team } = useContent();
  const [active, setActive] = useState(0);
  const router = useRouter();

  return (
    <section className="bg-mint-50 py-24 md:py-32">
      <div className="wrap">
        <SectionHeading
          index="04"
          first="L'équipe"
          rest="OPUS"
          description="Direction, opérations, design et communication : une équipe resserrée qui suit chaque projet de la conception à la livraison."
          cta={{ label: "Voir toute l'équipe", href: "/equipe" }}
        />

        <div
          className="mt-12 hidden gap-[10px] md:flex lg:mt-16"
          style={{ height: 640 }}
        >
          {team.map((m, i) => {
            const isActive = i === active;
            return (
              <motion.div
                key={m.slug}
                role="button"
                tabIndex={0}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => {
                  if (isActive) router.push(`/equipe/${m.slug}`);
                  else setActive(i);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(`/equipe/${m.slug}`);
                  }
                }}
                aria-label={`${m.name}, ${m.role} — Voir la présentation`}
                initial={false}
                animate={{ flexGrow: isActive ? 4.6 : 1 }}
                transition={springLayout}
                className={cn(
                  "group relative min-w-0 flex-1 basis-0 cursor-pointer overflow-hidden rounded-lg bg-mint-100 text-left ring-1 ring-transparent transition-shadow duration-500",
                  isActive &&
                    "ring-brand/60 shadow-[0_0_60px_rgba(237,106,61,0.18)]",
                )}
              >
                <Portrait m={m} sizes="(min-width: 1200px) 40vw, 30vw" />
                <motion.div
                  initial={false}
                  animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 16 }}
                  transition={{ duration: 0.4, delay: isActive ? 0.15 : 0 }}
                  className={cn(
                    "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent p-6 text-white lg:p-8",
                    !isActive && "pointer-events-none",
                  )}
                >
                  <p className="t-eyebrow text-brand">{m.department}</p>
                  <h3 className="mt-2 font-display text-[24px] font-semibold tracking-[-0.03em] leading-none lg:text-[30px]">
                    {m.name}
                  </h3>
                  <p className="t-mono-sm mt-2 text-white/80">{m.role}</p>
                  <Link
                    href={`/equipe/${m.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 font-mono text-[13px] font-medium text-black transition-colors hover:bg-lime"
                  >
                    Voir la présentation
                    <ArrowIcon className="size-4" />
                  </Link>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <Reveal
          className="mt-10 -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 md:hidden"
          data-lenis-prevent
        >
          {team.map((m) => (
            <Link
              key={m.slug}
              href={`/equipe/${m.slug}`}
              className="group relative aspect-[3/4] w-[78%] shrink-0 snap-center overflow-hidden rounded-lg bg-mint-100"
            >
              <Portrait m={m} sizes="80vw" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/55 to-transparent p-5 text-white">
                <p className="t-eyebrow text-brand">{m.department}</p>
                <h3 className="mt-1.5 font-display text-[22px] font-semibold tracking-[-0.03em] leading-none">
                  {m.name}
                </h3>
                <p className="t-mono-sm mt-2 text-white/80">{m.role}</p>
                <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-brand px-3.5 py-1.5 font-mono text-[12px] font-medium text-black">
                  Voir la présentation
                  <ArrowIcon className="size-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function Portrait({
  m,
  sizes,
}: {
  m: TeamMember;
  sizes: string;
  active?: boolean;
  color?: boolean;
}) {
  if (m.image) {
    return (
      <Image
        src={m.image}
        alt={m.name}
        fill
        sizes={sizes}
        className="object-cover object-top grayscale transition-all duration-500"
      />
    );
  }
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-mint-100 text-white [container-type:inline-size]"
    >
      <span className="text-opus-gradient font-display text-[clamp(22px,38cqi,120px)] font-semibold leading-none tracking-[-0.04em]">
        {initials(m.name)}
      </span>
      <OpusLogo
        variant="mark"
        title=""
        className="w-[min(64px,60%)] opacity-40"
      />
    </div>
  );
}
