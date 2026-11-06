"use client";
import { useRef, useState } from "react";
import { motion } from "motion/react";

/** Effet magnétique (React Bits "Magnet") : l'élément est attiré par le curseur à proximité. */
export function Magnet({ children, strength = 0.35, padding = 40, className }: { children: React.ReactNode; strength?: number; padding?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    const dx = e.clientX - cx, dy = e.clientY - cy;
    if (Math.abs(dx) < r.width / 2 + padding && Math.abs(dy) < r.height / 2 + padding) setPos({ x: dx * strength, y: dy * strength });
    else setPos({ x: 0, y: 0 });
  };
  return (
    <div ref={ref} className={className} onMouseMove={onMove} onMouseLeave={() => setPos({ x: 0, y: 0 })} style={{ padding }}>
      <motion.div animate={pos} transition={{ type: "spring", stiffness: 200, damping: 18, mass: 0.5 }} style={{ margin: -padding, padding }}>
        {children}
      </motion.div>
    </div>
  );
}
