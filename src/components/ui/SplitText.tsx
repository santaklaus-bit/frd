"use client";
import { motion } from "motion/react";
import { EASE_FRAMER } from "@/lib/motion";

/** Titre révélé lettre par lettre au scroll (React Bits "Split Text"). Mots insécables. */
export function SplitText({ text, className, delay = 0, stagger = 0.025 }: { text: string; className?: string; delay?: number; stagger?: number }) {
  const words = text.split(" ");
  let idx = 0;
  return (
    <span className={className} aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} aria-hidden>
          <span className="inline-block whitespace-nowrap">
            {Array.from(w).map((ch, ci) => {
              const i = idx++;
              return (
                <motion.span
                  key={ci}
                  className="inline-block will-change-transform"
                  initial={{ opacity: 0, y: "0.5em", rotateX: -40 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, amount: 0.6 }}
                  transition={{ duration: 0.6, delay: delay + i * stagger, ease: EASE_FRAMER }}
                >
                  {ch}
                </motion.span>
              );
            })}
          </span>
          {wi < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}
