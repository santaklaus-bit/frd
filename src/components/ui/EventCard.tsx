import Image from "next/image";
import Link from "next/link";
import type { EventItem } from "@/data/events";
import { TiltCard } from "./TiltCard";

/** Carte événement : image 16:10 avec overlay "Voir l'événement" (Bricolage 64px) + zoom au hover. */
export function EventCard({ ev, priority = false }: { ev: EventItem; priority?: boolean }) {
  return (
    <Link href={`/evenements/${ev.slug}`} className="group block">
      <TiltCard max={6} scale={1.01} className="relative">
      <div className="relative aspect-[664/424] overflow-hidden rounded-lg bg-mint-100">
        <Image
          src={ev.image}
          alt={ev.alt}
          fill
          priority={priority}
          sizes="(min-width: 810px) 50vw, 100vw"
          className="object-cover transition-transform duration-[900ms] ease-[var(--ease-framer)] group-hover:scale-105"
        />
        <div className="absolute inset-0 grid place-items-center bg-black/60 opacity-0 backdrop-blur-[2px] transition-opacity duration-500 group-hover:opacity-100">
          <span className="translate-y-4 font-display text-[24px] font-bold tracking-[-0.02em] text-brand transition-transform duration-500 group-hover:translate-y-0 md:text-[32px] lg:text-[44px]">Voir l’événement</span>
        </div>
        <span className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 font-mono text-[12px] text-white backdrop-blur"><span aria-hidden className="size-1.5 rounded-full bg-brand" />{ev.category}</span>
      </div>
      </TiltCard>
      <div className="mt-5 border-t border-line pt-5">
        <h3 className="h-card text-white transition-colors group-hover:text-brand">{ev.title}</h3>
        <p className="t-mono mt-3 text-muted">
          {ev.city}, {ev.country}<span className="mx-3 inline-block size-1 -translate-y-[3px] rounded-full bg-muted" />{ev.dateLabel}
        </p>
      </div>
    </Link>
  );
}
