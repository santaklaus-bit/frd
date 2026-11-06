/**
 * Presets d'animation extraits du DOM Framer du template Eventry
 * (window.__framer__appearAnimationsContent). Valeurs reprises telles quelles.
 */
import type { Transition, Variants } from "motion/react";

export const EASE_FRAMER: [number, number, number, number] = [0.69, 0, 0.05, 0.98];
export const EASE_HERO: [number, number, number, number] = [0.95, -0.02, 0.38, 1];

/** Navbar : glisse depuis le haut (y:-50), spring 1.5s, bounce .2, delay .5 */
export const navAppear: Variants = {
  hidden: { opacity: 0, y: -50 },
  show: { opacity: 1, y: 0, transition: { type: "spring", duration: 1.5, bounce: 0.2, delay: 0.5 } },
};

/** Titre hero : scale .7 → 1, tween 1.4s, delay 1.1 */
export const heroScale: Variants = {
  hidden: { scale: 0.7, opacity: 1 },
  show: { scale: 1, opacity: 1, transition: { type: "tween", duration: 1.4, delay: 1.1, ease: EASE_HERO } },
};

/** Fade + translateY(20) tween 1s delay .2 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "tween", duration: 1, delay: 0.2, ease: EASE_FRAMER } },
};

/** Apparition générique de section : y:120 → 0, spring .8, bounce 0 */
export const rise = (delay = 0.2): Variants => ({
  hidden: { opacity: 0, y: 120 },
  show: { opacity: 1, y: 0, transition: { type: "spring", duration: 0.8, bounce: 0, delay } },
});

/** Carte glass des événements récents : y:80 → 0, spring .6 */
export const glassRise: Variants = {
  hidden: { opacity: 0, y: 80 },
  show: { opacity: 1, y: 0, transition: { type: "spring", duration: 0.6, bounce: 0, delay: 0.2 } },
};

/** Simple fade (titre événement) : spring .4 bounce .2 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { type: "spring", duration: 0.4, bounce: 0.2 } },
};

export const viewportOnce = { once: true, amount: 0.2 } as const;

export const springSoft: Transition = { type: "spring", duration: 0.6, bounce: 0 };
export const springLayout: Transition = { type: "spring", stiffness: 260, damping: 30 };
