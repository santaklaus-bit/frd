"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

/** FAQ : accordéon (height auto animé, icône + ↔ −). */
export function Accordion({ items, defaultOpen = 3, className }: { items: { q: string; a: string }[]; defaultOpen?: number; className?: string }) {
  const [open, setOpen] = useState<number | null>(defaultOpen);
  return (
    <ul className={cn("flex flex-col", className)}>
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <li key={i} className="border-b border-line-2">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-6 py-5 text-left"
            >
              <span className="font-hanken text-[18px] font-medium tracking-[-0.04em] leading-none text-ink lg:text-[20px]">{it.q}</span>
              <span className="relative grid size-6 shrink-0 place-items-center rounded-full border border-brand text-brand">
                <span className="absolute h-[1.5px] w-3 bg-current" />
                <motion.span className="absolute h-3 w-[1.5px] bg-current" animate={{ scaleY: isOpen ? 0 : 1 }} transition={{ duration: 0.25 }} />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ type: "spring", duration: 0.5, bounce: 0 }}
                  className="overflow-hidden"
                >
                  <p className="t-mono-sm pb-5 pr-12 text-muted">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
