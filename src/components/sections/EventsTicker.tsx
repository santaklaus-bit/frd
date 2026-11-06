"use client";
import { useContent } from "@/components/cms/ContentProvider";
import { useRef } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "motion/react";

/**
 * Bandeau au dégradé OPUS (jaune → orange) sous le hero — inspiré de React Bits "Scroll Velocity" :
 * défilement continu dont la vitesse et le sens réagissent à la vitesse de scroll.
 */
export function EventsTicker() {
  const { events } = useContent();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 5], { clamp: false });
  const dir = useRef(1);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  useAnimationFrame((_, delta) => {
    let move = dir.current * 2.2 * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * move * Math.abs(f);
    baseX.set(baseX.get() - move);
  });
  const row = (
    <>
      {events.map((e) => (
        <span
          key={e.slug}
          className="flex shrink-0 items-center gap-5 pr-5 font-display text-[13px] font-semibold uppercase tracking-[0.04em] md:text-[15px]"
        >
          {e.title}
          <span className="font-mono text-[12px] font-medium normal-case tracking-normal text-black/75">
            {e.city} · {e.dateLabel}
          </span>
          <span className="inline-block size-2 rotate-45 bg-black/70" />
        </span>
      ))}
    </>
  );
  return (
    <div className="relative z-10 -mt-[1px] overflow-hidden border-y border-black/20 bg-forest py-3 text-black md:py-4">
      <motion.div className="flex w-max whitespace-nowrap" style={{ x }}>
        {row}
        {row}
      </motion.div>
    </div>
  );
}
