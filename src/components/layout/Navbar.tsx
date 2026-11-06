"use client";
import { useContent } from "@/components/cms/ContentProvider";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { navAppear, EASE_FRAMER } from "@/lib/motion";

import { Logo } from "@/components/ui/Logo";
import { ArrowIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

/**
 * Navigation haute OPUS CORP :
 * Capsule flottante centrée, verre fumé haute définition (backdrop-blur-xl),
 * micro-interactions au survol, indicateur trifonctionnel (Design / Branding / Event)
 * et bouton d'action lumineux haute couture.
 */
export function Navbar() {
  const { site } = useContent();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("lenis-stopped", open);
    return () => document.documentElement.classList.remove("lenis-stopped");
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <motion.header
        variants={navAppear}
        initial="hidden"
        animate="show"
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4 md:px-6 md:pt-5"
      >
        <div
          className={cn(
            "pointer-events-auto relative flex h-[62px] md:h-[66px] w-full max-w-6xl items-center justify-between rounded-full px-5 md:px-8 transition-all duration-500",
            scrolled
              ? "border border-white/18 bg-navy/90 shadow-[0_18px_45px_rgba(10,14,26,0.65),0_1px_0_rgba(255,255,255,0.15)] backdrop-blur-2xl"
              : "border border-white/12 bg-navy/75 shadow-[0_12px_32px_rgba(10,14,26,0.45)] backdrop-blur-xl",
          )}
        >
          {/* Logo officiel OPUS */}
          <Logo />

          {/* Navigation centrale desktop */}
          <nav
            aria-label="Navigation principale"
            onMouseLeave={() => setHovered(null)}
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex"
          >
            {site.nav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  onClick={() => setOpen(false)}
                  key={item.href}
                  href={item.href}
                  onMouseEnter={() => setHovered(item.href)}
                  className={cn(
                    "relative rounded-full px-4 py-2 font-display text-[13px] font-medium tracking-[0.06em] uppercase transition-colors duration-200",
                    active ? "text-white" : "text-white/70 hover:text-white",
                  )}
                >
                  {/* Pastille de glissement au survol */}
                  {hovered === item.href && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-white/10 backdrop-blur-md"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 32,
                      }}
                    />
                  )}

                  {/* État actif discret */}
                  {active && (
                    <span className="absolute inset-0 -z-20 rounded-full bg-white/[0.08] ring-1 ring-white/15" />
                  )}

                  <span className="relative flex items-center gap-2">
                    {item.label}
                    {active && (
                      <span
                        aria-hidden
                        className="size-1.5 rounded-full bg-gradient-to-r from-design via-branding to-event shadow-[0_0_8px_rgba(237,106,61,0.9)]"
                      />
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* CTA desktop lumineux & raffiné */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              onClick={() => setOpen(false)}
              href={site.cta.href}
              className="group relative inline-flex h-11 items-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-design via-branding to-event p-px font-display text-[13.5px] font-semibold tracking-[0.02em] text-white shadow-[0_4px_20px_rgba(237,106,61,0.25)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_28px_rgba(237,106,61,0.5)] active:scale-[0.98]"
            >
              <span className="flex h-full w-full items-center gap-2 rounded-full bg-navy/92 px-5 py-2 transition-colors duration-300 group-hover:bg-navy/50">
                <span>{site.cta.label}</span>
                <span className="grid size-5 place-items-center rounded-full bg-white/15 text-white transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-white group-hover:text-black">
                  <ArrowIcon className="size-3" />
                </span>
              </span>
            </Link>
          </div>

          {/* Bouton burger mobile */}
          <button
            type="button"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative grid size-11 place-items-center rounded-full bg-white/5 border border-white/10 lg:hidden text-white transition-colors hover:bg-white/10"
          >
            <span
              className={cn(
                "absolute h-[1.5px] w-5 bg-white transition-all duration-300",
                open ? "rotate-45" : "-translate-y-1.5",
              )}
            />
            <span
              className={cn(
                "absolute h-[1.5px] w-5 bg-white transition-opacity duration-300",
                open && "opacity-0",
              )}
            />
            <span
              className={cn(
                "absolute h-[1.5px] w-5 bg-white transition-all duration-300",
                open ? "-rotate-45" : "translate-y-1.5",
              )}
            />
          </button>
        </div>
      </motion.header>

      {/* Menu mobile plein écran / tiroir verre fumé */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col justify-between bg-navy/95 p-6 pt-24 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex flex-col gap-2 pt-4">
              <p className="t-eyebrow mb-3 text-brand">Navigation</p>
              {site.nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.05 * i,
                    duration: 0.35,
                    ease: EASE_FRAMER,
                  }}
                >
                  <Link
                    onClick={() => setOpen(false)}
                    href={item.href}
                    className="flex items-center justify-between border-b border-white/10 py-3.5 font-display text-[26px] font-semibold tracking-[-0.02em] text-white transition-colors hover:text-brand"
                  >
                    <span>{item.label}</span>
                    {isActive(item.href) ? (
                      <span className="size-2.5 rounded-full bg-brand shadow-[0_0_10px_rgba(237,106,61,0.8)]" />
                    ) : (
                      <span className="t-mono text-[14px] text-white/40">
                        0{i + 1}
                      </span>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="flex flex-col gap-5 border-t border-white/10 pt-6"
            >
              <Link
                onClick={() => setOpen(false)}
                href={site.cta.href}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-opus-gradient font-display text-[15px] font-semibold text-white shadow-[0_8px_24px_rgba(237,106,61,0.35)]"
              >
                <span>{site.cta.label}</span>
                <ArrowIcon className="size-4" />
              </Link>

              <div className="flex items-center justify-between text-white/70 t-mono-sm">
                <span>{site.city}</span>
                {site.phone && (
                  <a
                    href={site.phoneHref || undefined}
                    className="text-brand hover:underline"
                  >
                    {site.phone}
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
