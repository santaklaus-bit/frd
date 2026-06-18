"use client";

import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function HeroSection({ lang, dict }: { lang: string; dict: any }) {
  const [isClient, setIsClient] = useState(false);
  const [decorations, setDecorations] = useState<any[]>([]);

  useEffect(() => {
    setIsClient(true);
    // Generate static random values only on client to avoid hydration mismatch
    const newDecorations = [...Array(8)].map((_, i) => ({
      width: Math.random() * 300 + 150,
      height: Math.random() * 300 + 150,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      moveX: Math.random() * 120 - 60,
      moveY: Math.random() * 120 - 60,
      duration: Math.random() * 15 + 10,
    }));
    setDecorations(newDecorations);
  }, []);

  return (
    <section
      className="relative h-[90vh] flex items-center justify-center overflow-hidden border-b border-border/40 bg-white dark:bg-white"
      aria-label="Introduction"
    >
      <div className="absolute inset-0 z-0">
        <FlickeringGrid
          className="w-full h-full opacity-10"
          squareSize={4}
          gridGap={6}
          color="#000000"
          maxOpacity={0.08}
          flickerChance={0.01}
        />
        {/* Radial Gradient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.02),transparent_50%)]" />

        {/* Floating Decorative Elements */}
        {isClient && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {decorations.map((dec, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-blue-500/15 blur-2xl"
                style={{
                  width: dec.width,
                  height: dec.height,
                  left: dec.left,
                  top: dec.top,
                }}
                animate={{
                  x: [0, dec.moveX],
                  y: [0, dec.moveY],
                  scale: [1, 1.15, 1],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: dec.duration,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center space-y-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center mx-auto"
          style={{ width: "fit-content", maxWidth: "100%" }}
        >
          <h1 className="text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-[8rem] font-serif font-semibold tracking-tighter uppercase leading-[0.8] mb-4 sm:mb-6 whitespace-nowrap text-black">
            {dict.home.title}
          </h1>
          <p className="w-full text-center text-[1.8vw] sm:text-[1.4vw] md:text-[1vw] lg:text-[1rem] font-bold uppercase tracking-[0.08em] sm:tracking-[0.12em] md:tracking-[0.2em] lg:tracking-[0.25em] text-black/70 leading-tight whitespace-nowrap">
            {dict.home.subtitle}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="text-[4vw] sm:text-xl md:text-2xl font-normal leading-tight text-black/70 max-w-4xl mx-auto tracking-tight px-4"
        >
          {dict.home.description}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="pt-4 sm:pt-6 md:pt-8"
        >
          <Link href={`/${lang}${dict.home.cta_href ?? '/about'}`}>
            <Button
              size="lg"
              className="px-6 py-4 sm:px-10 sm:py-5 md:px-12 md:py-6 h-auto rounded-full text-xs sm:text-sm md:text-base font-bold uppercase tracking-widest hover:scale-105 hover:bg-black/90 hover:text-white dark:hover:bg-white/90 dark:hover:text-black transition-all shadow-lg bg-black text-white dark:bg-white dark:text-black border-none group cursor-pointer"
            >
              <span className="truncate">{dict.home.cta}</span>
              <ArrowRight className="ml-2 sm:ml-3 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform shrink-0" />
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Animated Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">
          Scroll
        </span>
        <div className="w-[22px] h-[36px] rounded-full border-2 border-black/20 p-1 flex justify-center">
          <motion.div
            animate={{
              y: [0, 12, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-1 h-2 bg-black/40 rounded-full"
          />
        </div>
      </motion.div>

      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/40 dark:to-white/40 pointer-events-none" />
    </section>
  );
}
