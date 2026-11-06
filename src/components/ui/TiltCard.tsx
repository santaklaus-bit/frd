"use client";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

/** Carte inclinée en 3D selon la position de la souris (React Bits "Tilted Card"). */
export function TiltCard({ children, className, max = 10, scale = 1.02 }: { children: React.ReactNode; className?: string; max?: number; scale?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 200, damping: 20 });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 200, damping: 20 });
  const s = useSpring(1, { stiffness: 200, damping: 20 });
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  return (
    <div ref={ref} className={cn("[perspective:1200px]", className)} onMouseMove={onMove} onMouseEnter={() => s.set(scale)} onMouseLeave={() => { px.set(0.5); py.set(0.5); s.set(1); }}>
      <motion.div style={{ rotateX: rx, rotateY: ry, scale: s, transformStyle: "preserve-3d" }} className="h-full w-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
