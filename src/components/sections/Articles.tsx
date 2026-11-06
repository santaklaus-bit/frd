"use client";
import { useContent } from "@/components/cms/ContentProvider";
import Image from "next/image";
import Link from "next/link";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { SnapRow } from "@/components/ui/SnapRow";

/** Articles (ACC.BLG / BLG.LST) : titre 2 tons + 2 cartes blog. */
export function Articles() {
  const { articles } = useContent();
  return (
    <section className="wrap py-24 md:py-32">
      <SectionHeading
        index="05"
        first="Articles"
        rest="OPUS CORP"
        description="Nos méthodes, nos coulisses et nos conseils pour concevoir des expériences de marque cohérentes."
        cta={{ label: "Tous les articles", href: "/blog" }}
      />
      <SnapRow
        count={articles.length}
        className="mt-10 md:hidden"
        label="articles"
      >
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`/blog/${a.slug}`}
            className="w-[82vw] shrink-0 snap-center"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-mint-100">
              <Image
                src={a.image}
                alt={a.alt}
                fill
                sizes="82vw"
                className="object-cover"
              />
              <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 font-mono text-[12px] text-brand backdrop-blur">
                {a.category}
              </span>
            </div>
            <h3 className="mt-4 font-hanken text-[20px] font-bold uppercase leading-tight tracking-[-0.02em] text-white">
              {a.title}
            </h3>
            <p className="t-mono-sm mt-2 text-muted">{a.dateLabel}</p>
          </Link>
        ))}
      </SnapRow>
      <ul className="mt-12 hidden grid-cols-1 gap-x-7 gap-y-12 md:grid md:grid-cols-2 lg:mt-16">
        {articles.map((a, i) => (
          <Reveal as="li" key={a.slug} delay={0.15 + i * 0.15}>
            <Link href={`/blog/${a.slug}`} className="group block">
              <div className="relative aspect-[664/424] overflow-hidden rounded-lg bg-mint-100">
                <Image
                  src={a.image}
                  alt={a.alt}
                  fill
                  sizes="(min-width: 810px) 50vw, 100vw"
                  className="object-cover transition-transform duration-[900ms] ease-[var(--ease-framer)] group-hover:scale-105"
                />
                <div className="absolute inset-0 grid place-items-center bg-black/60 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <span className="font-display text-[24px] font-bold tracking-[-0.02em] text-brand lg:text-[36px]">
                    Lire l’article
                  </span>
                </div>
              </div>
              <p className="t-mono-sm mt-6 text-muted">{a.category}</p>
              <h3 className="h-card mt-3 text-white transition-colors group-hover:text-brand lg:text-[32px]">
                {a.title}
              </h3>
              <p className="t-mono-sm mt-3 text-muted">{a.dateLabel}</p>
            </Link>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
