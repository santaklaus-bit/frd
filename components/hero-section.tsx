"use client";

import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function HeroSection({ lang, dict }: { lang: string; dict: any }) {
  return (
    <section className="relative h-[90vh] flex items-center justify-center overflow-hidden border-b border-border/40">
      <div className="absolute inset-0 -z-10">
        <FlickeringGrid
          className="w-full h-full"
          squareSize={4}
          gridGap={6}
          color="#60A5FA"
          maxOpacity={0.5}
          flickerChance={0.1}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center space-y-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h1 className="text-[12vw] md:text-[10vw] lg:text-[12rem] font-bold tracking-tighter uppercase leading-[0.8] mb-8">
            {dict.home.title}
          </h1>
          <p className="text-sm md:text-base font-bold uppercase tracking-[0.6em] text-muted-foreground opacity-60">
            {dict.home.subtitle}
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
          className="text-2xl md:text-4xl font-medium leading-tight text-muted-foreground/80 max-w-4xl mx-auto tracking-tight"
        >
          {dict.home.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="pt-8"
        >
          <Link href={`/${lang}/about`}>
            <Button
              size="lg"
              className="px-16 py-10 rounded-full text-xl font-bold uppercase tracking-widest hover:scale-105 transition-all shadow-2xl bg-black text-white dark:bg-white dark:text-black border-none"
            >
              {dict.home.cta}
              <ArrowRight className="ml-4 h-8 w-8" />
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background pointer-events-none" />
    </section>
  );
}
