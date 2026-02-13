import { getDictionary } from "@/lib/get-dictionary";
import Image from "next/image";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "fr");

  return {
    title: dict.seo.about.title,
    description: dict.seo.about.description,
    alternates: {
      canonical: `/${lang}/about`,
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "fr");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-6 py-24 lg:py-40">
        <div className="grid lg:grid-cols-2 gap-24 items-start">
          {/* Left Side: Consolidated Block Content */}
          <div className="space-y-16">
            <div>
              <h1 className="text-6xl md:text-8xl font-bold mb-16 uppercase tracking-tighter leading-[0.9]">
                {dict.about.title}
              </h1>
              <div className="space-y-10 text-2xl md:text-3xl leading-relaxed font-medium text-muted-foreground">
                <p className="text-foreground">{dict.about.content1}</p>
                <p>{dict.about.content2}</p>
                <p>{dict.about.content3}</p>
                <p>{dict.about.content4}</p>
                <p>{dict.about.content5}</p>
                <p>{dict.about.content6}</p>
                <p>{dict.about.content7}</p>
              </div>
            </div>

            {/* Signature Section */}
            <div className="pt-16 border-t border-border/40">
              <div className="relative w-80 h-40 opacity-90 dark:invert mb-4">
                <Image
                  src="/farid-signature.png"
                  alt="Farid Danko Signature"
                  fill
                  className="object-contain object-left"
                  priority
                />
                {/* Fallback if image missing */}
                <div className="absolute inset-0 flex items-center justify-start text-4xl font-serif italic text-muted-foreground/10 pointer-events-none select-none">
                  Farid Danko
                </div>
              </div>
              <p className="text-lg font-bold uppercase tracking-[0.4em] text-muted-foreground/60">
                Farid Danko
              </p>
            </div>
          </div>

          {/* Right Side: Sticky Photo */}
          <div className="lg:sticky lg:top-32 h-[85vh] rounded-[3.5rem] bg-muted overflow-hidden shadow-2xl group">
            <Image
              src="/farid-portrait.png"
              alt="Farid Danko Portrait"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              priority
            />
            {/* Overlay with subtle gradient for premium feel */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

            {/* Fallback if image missing */}
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground italic bg-muted z-[-1]">
              [Photo de Farid Danko]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
