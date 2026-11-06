"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { OpusLogo, OpusMountain } from "@/components/ui/OpusLogo";

/**
 * Planche de marque en bas de page, reprise de la planche « Colors » de la charte (plan 4 de « Opus Logo To-dos.ai ») :
 * dégradé jaune → orange → rouge, silhouette de montagne marine, logo blanc qui monte en parallaxe.
 */
export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end end"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["35%", "0%"]);
  const mountainY = useTransform(scrollYProgress, [0, 1], ["18%", "0%"]);
  return (
    <div
      ref={ref}
      aria-hidden
      className="bg-opus-gradient relative h-[clamp(260px,42vw,600px)] select-none overflow-hidden"
    >
      <div className="wrap relative z-10 flex h-full items-start pt-[5vw]">
        <motion.div
          style={{ y }}
          className="flex items-center gap-4 text-white md:gap-8"
        >
          <OpusLogo
            variant="mark"
            title=""
            className="w-[clamp(170px,34vw,520px)]"
          />
          <span className="t-eyebrow flex flex-col gap-2 md:gap-3">
            <span>Design</span>
            <span>Branding</span>
            <span>Event</span>
          </span>
        </motion.div>
      </div>
      <motion.div
        style={{ y: mountainY }}
        className="absolute inset-x-0 bottom-0 h-[48%] text-navy"
      >
        <OpusMountain className="h-full w-full" />
      </motion.div>
    </div>
  );
}
