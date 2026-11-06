"use client";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Carte avec halo orange OPUS qui suit la souris (React Bits "Spotlight Card"). */
export function SpotlightCard({ children, className, color = "rgba(237,106,61,0.2)" }: { children: React.ReactNode; className?: string; color?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [p, setP] = useState({ x: -999, y: -999, on: false });
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (r) setP({ x: e.clientX - r.left, y: e.clientY - r.top, on: true });
  };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={() => setP((s) => ({ ...s, on: false }))} className={cn("relative overflow-hidden", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{ opacity: p.on ? 1 : 0, background: `radial-gradient(420px circle at ${p.x}px ${p.y}px, ${color}, transparent 45%)` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-500"
        style={{ opacity: p.on ? 1 : 0, padding: 1, background: `radial-gradient(300px circle at ${p.x}px ${p.y}px, rgba(248,177,51,0.85), transparent 60%)`, WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)", WebkitMaskComposite: "xor", maskComposite: "exclude" }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
