"use client";
import { useContent } from "@/components/cms/ContentProvider";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import { EventCard } from "@/components/ui/EventCard";
import { cn } from "@/lib/utils";

/** Liste des événements : filtres par catégorie + grille 2 colonnes animée. */
export function EventsGrid() {
  const { events } = useContent();
  const cats = useMemo(
    () => ["Tous", ...Array.from(new Set(events.map((e) => e.category)))],
    [events],
  );
  const [cat, setCat] = useState("Tous");
  const list =
    cat === "Tous" ? events : events.filter((e) => e.category === cat);
  return (
    <section className="wrap pb-24 md:pb-32">
      <div className="flex flex-wrap gap-x-6 gap-y-2 border-b border-line pb-5">
        {cats.map((c, i) => (
          <button
            key={c}
            type="button"
            onClick={() => setCat(c)}
            className={cn(
              "t-mono transition-colors hover:text-brand",
              cat === c ? "text-brand" : "text-muted",
            )}
          >
            {i > 0 && <span className="mr-1 text-line">/</span>}
            {c}
          </button>
        ))}
      </div>
      <motion.ul
        layout
        className="mt-12 grid grid-cols-1 gap-x-7 gap-y-14 md:grid-cols-2"
      >
        <AnimatePresence mode="popLayout">
          {list.map((ev) => (
            <motion.li
              key={ev.slug}
              layout
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.6, bounce: 0 }}
            >
              <EventCard ev={ev} />
              <p className="t-body mt-4 max-w-[560px] text-slate">
                {ev.excerpt}
              </p>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </section>
  );
}
