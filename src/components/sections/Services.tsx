"use client";
import { useContent } from "@/components/cms/ContentProvider";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { poleStyles } from "@/data/services";
import { OpusLogo } from "@/components/ui/OpusLogo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { CheckIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

/**
 * Nos services (ACC.SER / SER.01–03) — remplace la section "Simple pricing" du template (site portfolio, pas de billetterie).
 * 3 cartes, chacune coiffée de la déclinaison de logo de son pôle (charte, plans 6 à 8) :
 * Branding (orange), Event (rouge), Design (jaune).
 */
export function Services() {
  const { services } = useContent();
  const [open, setOpen] = useState(1);
  return (
    <section className="wrap pb-24 md:pb-32">
      <SectionHeading
        index="03"
        first="Nos"
        rest="services"
        description="Communication, expériences événementielles et espaces de marque : des interventions coordonnées autour de votre objectif."
        cta={{ label: "Discuter de votre projet", href: "/reserver" }}
      />
      {/* Mobile : accordéon numéroté */}
      <Reveal className="mt-10 md:hidden">
        <ul className="border-t border-line">
          {services.map((s, i) => {
            const isOpen = open === i;
            return (
              <li key={s.id} className="border-b border-line">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center gap-4 py-5 text-left"
                >
                  <span
                    className={cn(
                      "font-display text-[26px] font-semibold leading-none transition-colors",
                      isOpen ? poleStyles[s.pole].text : "text-muted",
                    )}
                  >
                    {s.num}
                  </span>
                  <span
                    className={cn(
                      "flex-1 font-hanken text-[18px] font-bold uppercase leading-tight tracking-[-0.02em] transition-colors",
                      isOpen ? "text-white" : "text-white/70",
                    )}
                  >
                    {s.name}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="grid size-9 shrink-0 place-items-center rounded-full border border-brand text-brand"
                  >
                    <span className="relative block size-3">
                      <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-current" />
                      <span className="absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 bg-current" />
                    </span>
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="c"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: "spring", duration: 0.5, bounce: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mb-5 overflow-hidden rounded-xl bg-mint-50">
                        <div
                          aria-hidden
                          className={cn(
                            "flex items-center gap-3 px-5 py-4 text-white",
                            poleStyles[s.pole].bg,
                          )}
                        >
                          <OpusLogo
                            variant="mark"
                            title=""
                            className="w-[72px]"
                          />
                          <span className="t-eyebrow">
                            {poleStyles[s.pole].label}
                          </span>
                        </div>
                        <div className="p-5">
                          <p className="t-mono-sm text-muted">{s.desc}</p>
                          <ul className="mt-4 flex flex-col gap-2">
                            {s.items.map((it) => (
                              <li key={it} className="flex items-center gap-3">
                                <CheckIcon
                                  className={cn(
                                    "size-4 shrink-0",
                                    poleStyles[s.pole].text,
                                  )}
                                />
                                <span className="t-mono-sm text-white/85">
                                  {it}
                                </span>
                              </li>
                            ))}
                          </ul>
                          <Button
                            href="/reserver"
                            size="sm"
                            className="mt-5 w-full text-[14px]"
                          >
                            {s.cta}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            );
          })}
        </ul>
      </Reveal>

      <ul className="mt-12 hidden grid-cols-1 gap-4 md:grid md:grid-cols-3 lg:mt-16">
        {services.map((s, i) => (
          <Reveal as="li" key={s.id} delay={0.15 + i * 0.1}>
            <SpotlightCard className="flex h-full flex-col overflow-hidden rounded-lg bg-mint-50 text-white">
              <div
                aria-hidden
                className={cn(
                  "grain relative flex h-[150px] items-center justify-center gap-4 text-white lg:h-[170px]",
                  poleStyles[s.pole].bg,
                )}
              >
                <OpusLogo
                  variant="mark"
                  title=""
                  className="w-[112px] lg:w-[128px]"
                />
                <span className="t-eyebrow">{poleStyles[s.pole].label}</span>
              </div>
              <div className="flex flex-1 flex-col p-7 lg:p-8">
                <p className="flex items-baseline gap-2">
                  <span
                    className={cn(
                      "font-display text-[40px] font-semibold tracking-[-0.04em] leading-none lg:text-[48px]",
                      poleStyles[s.pole].text,
                    )}
                  >
                    {s.num}
                  </span>
                  <span className="font-mono text-[13px] tracking-[-0.04em] text-slate">
                    / 03
                  </span>
                </p>
                <h3 className="mt-5 font-display text-[16px] font-semibold uppercase tracking-[0.02em]">
                  {s.name}
                </h3>
                <p className="t-mono-sm mt-2 text-muted">{s.desc}</p>
                <div className="my-7 border-t border-line" />
                <p className="t-eyebrow mb-4 text-white/70">
                  Ce que nous faisons
                </p>
                <ul className="flex flex-col gap-3">
                  {s.items.map((it) => (
                    <li key={it} className="flex items-center gap-3">
                      <CheckIcon
                        className={cn(
                          "size-4 shrink-0",
                          poleStyles[s.pole].text,
                        )}
                      />
                      <span className="t-mono-sm text-muted">{it}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-8">
                  <Button
                    href="/reserver"
                    variant={s.dark ? "primary" : "outline"}
                    className="w-full text-[15px]"
                    size="sm"
                  >
                    {s.cta}
                  </Button>
                </div>
              </div>
            </SpotlightCard>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
