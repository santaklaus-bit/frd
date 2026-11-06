"use client";
import { motion, type Variants } from "motion/react";
import { rise, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Enveloppe d'apparition au scroll (preset Framer y:120 spring .8 par défaut). */
export function Reveal({
  children,
  className,
  delay = 0.2,
  variants,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variants?: Variants;
  as?: "div" | "section" | "li" | "p" | "h2" | "h3";
}) {
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp className={cn("will-change-transform", className)} variants={variants ?? rise(delay)} initial="hidden" whileInView="show" viewport={viewportOnce}>
      {children}
    </Comp>
  );
}
