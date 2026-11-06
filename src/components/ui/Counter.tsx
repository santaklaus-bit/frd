"use client";
import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "motion/react";

/** Compteur numérique. `grouped` : séparateur de milliers français (26 500), à éviter pour une année. */
export function Counter({ to, from = 0, duration = 2, delay = 0, className, suffix = "", grouped = false }: { to: number; from?: number; duration?: number; delay?: number; className?: string; suffix?: string; grouped?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [value, setValue] = useState(from);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(from, to, { duration, delay, ease: [0.69, 0, 0.05, 0.98], onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [inView, from, to, duration, delay]);
  return <span ref={ref} className={className}>{grouped ? value.toLocaleString("fr-FR").replace(/\u202f|\u00a0/g, "\u00a0") : value}{suffix}</span>;
}
