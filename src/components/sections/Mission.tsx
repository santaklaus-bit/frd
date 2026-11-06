"use client";
import { useContent } from "@/components/cms/ContentProvider";
import Image from "next/image";

import { WordReveal } from "@/components/ui/WordReveal";
import { Reveal } from "@/components/ui/Reveal";

// MED.AVA.01 — mini-portraits : membres réels de l'équipe OPUS (portraits fournis), plus de photos de banque d'images.

/** Manifeste (ACC.INT) : portraits de l'équipe empilés + badge « 2026 » (ACC.INT.02 : métrique 100+ non définie → année de démarrage), texte révélé mot par mot. */
export function Mission() {
  const { site, team } = useContent();
  const avatars = team.filter((m) => m.image).map((m) => m.image as string);
  return (
    <section className="wrap pt-24 pb-16 md:pt-32 md:pb-20">
      <Reveal className="flex justify-center">
        <div className="flex items-center">
          {avatars.map((src) => (
            <span
              key={src}
              className="relative -ml-2 size-[60px] overflow-hidden rounded-md border-2 border-bg first:ml-0"
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="60px"
                className="object-cover object-top grayscale"
              />
            </span>
          ))}
          <span className="-ml-2 grid h-[60px] min-w-[60px] place-items-center rounded-md px-2 border-2 border-bg bg-brand font-inter text-[18px] font-semibold tracking-[-0.4px] text-black">
            {site.stats.since}
          </span>
        </div>
      </Reveal>
      <div className="mx-auto mt-8 max-w-[1180px] text-center">
        <WordReveal text={site.mission} className="h-quote text-ink" />
      </div>
    </section>
  );
}
