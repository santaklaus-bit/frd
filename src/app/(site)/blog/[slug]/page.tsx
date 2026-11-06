import type { Metadata } from "next";
import Image from "next/image";
import { notFound, permanentRedirect } from "next/navigation";
import { publicContent, redirectTarget } from "@/lib/cms/content";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { ArticleBody } from "@/components/cms/ArticleBody";
import { Articles } from "@/components/sections/Articles";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { articles } = await publicContent();
  const a = articles.find((x) => x.slug === slug);
  return {
    title: a ? a.seoTitle || `${a.title} — OPUS CORP` : "Article",
    description: a?.seoDescription || a?.excerpt,
    openGraph: a ? { images: [{ url: a.image, alt: a.alt }] } : undefined,
  };
}

/** Article [SIMULÉ] — corps de texte placeholder. */
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { articles } = await publicContent();
  const a = articles.find((x) => x.slug === slug);
  if (!a) {
    const target = redirectTarget("articles", slug);
    if (target) permanentRedirect(`/blog/${target}`);
    notFound();
  }
  return (
    <>
      <PageHero
        title={a.title}
        eyebrow={`${a.category} — ${a.dateLabel}`}
        subtitle={a.excerpt}
        size="big"
      />
      <section className="wrap pb-24">
        <Reveal className="relative aspect-[4/5] overflow-hidden rounded-lg md:aspect-[1376/640]">
          <Image
            src={a.image}
            alt={a.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </Reveal>
        <Reveal
          delay={0.2}
          className="mx-auto mt-16 flex max-w-[760px] flex-col gap-6"
        >
          <p className="h-quote text-white">{a.intro}</p>
          {a.blocks.length ? (
            <ArticleBody blocks={a.blocks} />
          ) : (
            a.body.map((para, i) => (
              <p key={i} className="t-body text-slate">
                {para}
              </p>
            ))
          )}
        </Reveal>
      </section>
      <Articles />
    </>
  );
}
