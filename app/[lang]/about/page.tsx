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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-10 md:gap-16 lg:gap-24 items-start">
          {/* Left Side: Consolidated Block Content */}
          <div className="space-y-8 md:space-y-12 lg:space-y-16">
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tighter uppercase leading-[0.9] text-balance">
                {dict.about.title}
              </h1>
              <div className="mt-10 md:mt-14 space-y-4 md:space-y-6 lg:space-y-8 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed font-normal text-muted-foreground">
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
            <div className="pt-10 md:pt-16 border-t border-border/40">
              <div className="relative w-56 sm:w-64 md:w-80 h-28 sm:h-32 md:h-40 opacity-90 dark:invert mb-4">
                <Image
                  src="/farid-signature.png"
                  alt="Farid Danko Signature"
                  fill
                  className="object-contain object-left"
                  priority
                />
                <div className="absolute inset-0 flex items-center justify-start text-4xl font-serif italic text-muted-foreground/10 pointer-events-none select-none">
                  Farid Danko
                </div>
              </div>
              <p className="text-base md:text-lg font-bold uppercase tracking-[0.4em] text-muted-foreground/60">
                Farid Danko
              </p>
            </div>
          </div>

          {/* Right Side: Sticky Photo */}
          <div className="order-first lg:order-last lg:sticky lg:top-32 h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[85vh] rounded-2xl sm:rounded-[2rem] lg:rounded-[3.5rem] bg-muted overflow-hidden shadow-xl md:shadow-2xl group w-full">
            <Image
              src="/farid-portrait.webp"
              alt="Farid Danko Portrait"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground italic bg-muted z-[-1]">
              [Photo de Farid Danko]
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
