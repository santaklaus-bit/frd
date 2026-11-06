"use client";
import { motion } from "motion/react";
import { EASE_FRAMER } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * En-tête de page interne Eventry : H1 géant révélé lettre par lettre (stagger),
 * sous-titre à droite + slot optionnel (badge, CTA).
 */
export function PageHero({ title, subtitle, eyebrow, children, className, align = "split", size = "display" }: { title: string; subtitle?: string; eyebrow?: string; children?: React.ReactNode; className?: string; align?: "split" | "stack"; size?: "display" | "big" }) {
  const words = title.split(" ");
  let idx = 0;
  return (
    <section className={cn("wrap pt-36 pb-12 md:pt-44 md:pb-16", className)}>
      {eyebrow && (
        <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5, ease: EASE_FRAMER }} className="t-mono mb-4 text-brand">
          {eyebrow}
        </motion.p>
      )}
      <div className={cn("flex flex-col gap-6", align === "split" && "lg:flex-row lg:items-end lg:justify-between lg:gap-12")}>
        <h1 className={cn(size === "display" ? "h-display" : "h-big font-hanken", "min-w-0 max-w-[880px] text-white")} aria-label={title}>
          {words.map((word, wi) => {
            const segments = word.split("-").map((seg, si, arr) => (si < arr.length - 1 ? `${seg}-` : seg));
            return (
              <span key={wi} aria-hidden className="inline">
                {segments.map((seg, si) => (
                  <span key={si} className="inline-block whitespace-nowrap">
                    {Array.from(seg).map((ch, ci) => {
                      const i = idx++;
                      return (
                        <motion.span
                          key={ci}
                          initial={{ opacity: 0, y: "0.4em" }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.7, delay: 0.5 + i * 0.03, ease: EASE_FRAMER }}
                          className="inline-block will-change-transform"
                        >
                          {ch}
                        </motion.span>
                      );
                    })}
                  </span>
                ))}
                {wi < words.length - 1 ? " " : null}
              </span>
            );
          })}
        </h1>
        {(subtitle || children) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.9, ease: EASE_FRAMER }} className="flex flex-col gap-5 lg:max-w-[420px] lg:shrink-0 lg:items-start">
            {subtitle && <p className="t-lead text-muted">{subtitle}</p>}
            {children}
          </motion.div>
        )}
      </div>
    </section>
  );
}
