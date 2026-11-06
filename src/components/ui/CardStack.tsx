"use client";
import { useState } from "react";
import { motion, type PanInfo } from "motion/react";

/**
 * Pile de cartes à swiper (inspiré de React Bits "Stack") :
 * la carte du dessus se glisse à gauche/droite → passe en dessous, la suivante monte.
 */
export function CardStack<T>({ items, render, keyOf, aspect = "4 / 5", onChange }: { items: T[]; render: (item: T, i: number) => React.ReactNode; keyOf: (item: T) => string; aspect?: string; onChange?: (index: number) => void }) {
  const [order, setOrder] = useState(items.map((_, i) => i));
  const cycle = () => {
    setOrder((o) => {
      const next = [...o.slice(1), o[0]];
      onChange?.(next[0]);
      return next;
    });
  };
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 80 || Math.abs(info.velocity.x) > 500) cycle();
  };
  const visible = 3;
  return (
    <div className="relative w-full" style={{ aspectRatio: aspect }}>
      {order.slice(0, visible).map((itemIndex, depth) => {
        const item = items[itemIndex];
        const top = depth === 0;
        return (
          <motion.div
            key={keyOf(item)}
            className="absolute inset-0 origin-bottom overflow-hidden rounded-xl bg-mint-100 will-change-transform"
            style={{ zIndex: visible - depth, touchAction: "pan-y" }}
            animate={{ scale: 1 - depth * 0.06, y: depth * -18, rotate: depth === 0 ? 0 : depth % 2 ? -3 : 3, opacity: 1 - depth * 0.15 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            drag={top ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.9}
            onDragEnd={top ? onDragEnd : undefined}
            whileDrag={{ rotate: 0, scale: 1.02, cursor: "grabbing" }}
          >
            {render(item, itemIndex)}
          </motion.div>
        );
      })}
    </div>
  );
}
