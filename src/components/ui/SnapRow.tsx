"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Rangée horizontale à glisser (scroll-snap) avec compteur "01 / 05" et barre de progression.
 * Pensée pour le mobile ; les enfants définissent leur largeur (ex. w-[82vw]).
 */
export function SnapRow({ children, count, className, label }: { children: React.ReactNode; count: number; className?: string; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      const i = max > 0 ? Math.round((el.scrollLeft / max) * (count - 1)) : 0;
      setIndex(i);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [count]);
  return (
    <div className={className}>
      <div ref={ref} data-lenis-prevent className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {children}
      </div>
      <div className="mt-5 flex items-center gap-4">
        <span className="font-display text-[13px] font-bold text-brand">{String(index + 1).padStart(2, "0")}</span>
        <span className="relative h-[2px] flex-1 overflow-hidden rounded-full bg-line">
          <span className="absolute inset-y-0 left-0 rounded-full bg-brand transition-[width] duration-300" style={{ width: `${((index + 1) / count) * 100}%` }} />
        </span>
        <span className="t-mono-sm text-muted">{String(count).padStart(2, "0")}{label ? ` · ${label}` : ""}</span>
      </div>
    </div>
  );
}
