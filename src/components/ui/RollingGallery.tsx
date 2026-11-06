"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useAnimationFrame, useMotionValue, type PanInfo } from "motion/react";

/**
 * Galerie 3D cylindrique (inspirée de React Bits "Rolling Gallery") :
 * les images sont réparties sur un cylindre en rotation lente ; glisser pour tourner.
 */
export function RollingGallery({ images, height = 260 }: { images: { src: string; alt: string; label?: string; sub?: string }[]; height?: number }) {
  const n = images.length;
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(360);
  useEffect(() => {
    const m = () => setWidth(ref.current?.clientWidth ?? 360);
    m();
    window.addEventListener("resize", m);
    return () => window.removeEventListener("resize", m);
  }, []);
  const faceW = Math.min(width * 0.56, 240);
  const radius = ((faceW * n) / (2 * Math.PI)) * 1.05;
  const rotation = useMotionValue(0);
  const dragging = useRef(false);
  useAnimationFrame((_, delta) => {
    if (!dragging.current) rotation.set(rotation.get() - delta * 0.008);
  });
  const onDrag = (_: unknown, info: PanInfo) => rotation.set(rotation.get() + info.delta.x * 0.25);
  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ height, perspective: 1600, perspectiveOrigin: "50% 45%" }}>
      <motion.div
        className="absolute inset-0"
        style={{ transformStyle: "preserve-3d", rotateY: rotation, touchAction: "pan-y" }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0}
        dragMomentum={false}
        onDragStart={() => (dragging.current = true)}
        onDrag={onDrag}
        onDragEnd={() => (dragging.current = false)}
      >
        {images.map((img, i) => (
          <div
            key={img.src + i}
            className="absolute left-1/2 top-1/2 overflow-hidden rounded-lg border border-white/10 bg-mint-100"
            style={{ width: faceW, height: height * 0.78, transform: `translate(-50%, -50%) rotateY(${(360 / n) * i}deg) translateZ(${radius}px)`, backfaceVisibility: "hidden" }}
          >
            <Image src={img.src} alt={img.alt} fill sizes="300px" className="pointer-events-none object-cover" draggable={false} />
            {img.label && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3">
                <p className="font-hanken text-[15px] font-bold uppercase leading-tight text-white">{img.label}</p>
                {img.sub && <p className="t-mono-sm text-white/70">{img.sub}</p>}
              </div>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
