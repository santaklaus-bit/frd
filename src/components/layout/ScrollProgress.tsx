"use client";
import { motion, useScroll, useSpring } from "motion/react";

/** Barre de progression de lecture au dégradé OPUS, en haut de page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-[2.5px] origin-left bg-opus-gradient shadow-[0_0_12px_rgba(248,177,51,0.7)]"
      style={{ scaleX }}
    />
  );
}
