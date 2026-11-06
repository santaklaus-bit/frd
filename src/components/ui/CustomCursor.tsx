"use client";
import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

/**
 * Curseur personnalisé (React Bits "Blob Cursor") : point orange + anneau qui suit avec ressort,
 * s'agrandit sur les liens/boutons. Desktop pointer fin uniquement.
 */
const subscribePointer=(listener:()=>void)=>{const media=window.matchMedia("(pointer: fine)");media.addEventListener("change",listener);return()=>media.removeEventListener("change",listener);};
export function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 300, damping: 30, mass: 0.4 });
  const ry = useSpring(y, { stiffness: 300, damping: 30, mass: 0.4 });
  const [active, setActive] = useState(false);
  const enabled = useSyncExternalStore(subscribePointer,()=>window.matchMedia("(pointer: fine)").matches,()=>false);

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-cursor");
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    const over = (e: MouseEvent) => setActive(!!(e.target as HTMLElement).closest("a, button, [data-cursor]"));
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over, { passive: true });
    return () => { window.removeEventListener("mousemove", move); window.removeEventListener("mouseover", over); document.documentElement.classList.remove("has-cursor"); };
  }, [x, y, enabled]);

  if (!enabled) return null;
  return (
    <>
      <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[100] size-2 rounded-full bg-brand mix-blend-difference" style={{ x, y, translateX: "-50%", translateY: "-50%" }} />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full border border-brand"
        style={{ x: rx, y: ry, translateX: "-50%", translateY: "-50%" }}
        animate={{ width: active ? 56 : 32, height: active ? 56 : 32, backgroundColor: active ? "rgba(237,106,61,0.18)" : "rgba(237,106,61,0)" }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      />
    </>
  );
}
