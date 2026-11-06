"use client";
import { ReactLenis } from "lenis/react";

/** Smooth scroll Lenis (le site de référence embarque Lenis 1.1.9). */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
