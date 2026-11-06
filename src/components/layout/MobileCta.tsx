"use client";
import { useContent } from "@/components/cms/ContentProvider";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import { ArrowIcon } from "@/components/ui/Icons";

/** CTA flottant mobile : apparaît après le hero, disparaît sur la page de réservation. */
export function MobileCta() {
  const { site } = useContent();
  const pathname = usePathname();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 0.8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  if (pathname === "/reserver") return null;
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", duration: 0.6, bounce: 0 }}
          className="fixed inset-x-5 bottom-5 z-40 md:hidden"
        >
          <Link
            href={site.cta.href}
            className="flex h-14 items-center justify-between rounded-full bg-brand pl-6 pr-2 font-mono text-[15px] font-medium text-black shadow-[0_12px_40px_rgba(10,14,26,0.55)]"
          >
            {site.cta.label}
            <span className="grid size-10 place-items-center rounded-full bg-black text-brand">
              <ArrowIcon className="size-5" />
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
