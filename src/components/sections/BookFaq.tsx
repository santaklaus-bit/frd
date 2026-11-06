"use client";
import { useContent } from "@/components/cms/ContentProvider";
import { OpusLogo } from "@/components/ui/OpusLogo";
import { TO_CONFIRM } from "@/data/site";

import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { MailIcon } from "@/components/ui/Icons";
import { SpotlightCard } from "@/components/ui/SpotlightCard";

/** Bloc "Réserver" (GLO.CTA) + FAQ (GLO.FAQ, accordéon) sur 2 colonnes. */
export function BookFaq() {
  const { site, faq } = useContent();
  return (
    <section className="wrap py-24 md:py-32">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[512px_1fr] lg:gap-20">
        <Reveal>
          <SpotlightCard className="flex min-h-[560px] flex-col justify-between rounded-lg bg-mint-50 p-8 text-white lg:min-h-[740px]">
            <div>
              <span className="grid size-[84px] place-items-center rounded-full bg-forest text-black">
                <OpusLogo variant="mark" title="" className="w-[58px]" />
              </span>
              <h3 className="h-card mt-8 text-white">Contactez-nous</h3>
              <p className="t-mono-sm mt-5 max-w-[420px] text-muted">
                Parlons de votre prochain événement ou de votre activation.
                Partagez votre objectif et le type de projet envisagé : notre
                équipe vous accompagne pour préciser votre besoin.
              </p>
              <Button href={site.cta.href} size="sm" className="mt-7">
                {site.cta.label}
              </Button>
            </div>
            <div className="mt-16 flex items-center gap-4">
              <span className="grid size-10 place-items-center rounded-md bg-mint-100 text-brand">
                <MailIcon className="size-5" />
              </span>
              <div>
                <p className="font-inter text-[13px] font-medium text-white">
                  Vous préférez l’e-mail ?
                </p>
                {site.email ? (
                  <a
                    href={`mailto:${site.email}`}
                    className="t-mono-sm text-muted transition-colors hover:text-brand"
                  >
                    {site.email}
                  </a>
                ) : (
                  <p className="t-mono-sm text-muted">
                    Adresse e-mail : {TO_CONFIRM.toLowerCase()}
                  </p>
                )}
              </div>
            </div>
          </SpotlightCard>
        </Reveal>

        <div>
          <Reveal>
            <h2 className="h-big text-ink">
              Questions
              <br />
              fréquentes
            </h2>
          </Reveal>
          <Reveal delay={0.3} className="mt-12 lg:mt-16">
            <Accordion items={faq} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
