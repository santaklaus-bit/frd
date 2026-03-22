import { Metadata } from "next";
import { getDictionary } from "@/lib/get-dictionary";
import { getBlogPosts } from "@/lib/content-manager";
import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "fr");

  return {
    title: dict.seo.blog.title,
    description: dict.seo.blog.description,
    alternates: { canonical: `/${lang}/blog` },
  };
}

const formatDate = (date: Date, lang: string): string => {
  return date.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};



export default async function BlogPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "fr");

  const postsSource = await getBlogPosts();
  const posts = postsSource.sort(
    (a: any, b: any) =>
      new Date(b.date ?? 0).getTime() -
      new Date(a.date ?? 0).getTime()
  );

  const isFr = lang === "fr";
  const featured = posts[0] ?? null;
  const rest = posts.slice(1);

  return (
    <div className="min-h-screen bg-background">
      {/* ── VERTICAL SIDEBAR LABEL ── */}
      <div
        aria-hidden
        className="hidden lg:flex fixed left-0 top-0 h-screen w-12 items-center justify-center z-10 pointer-events-none"
      >
        <span
          className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/40 select-none"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          Farid Danko — Blog
        </span>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 xl:px-24 lg:pl-20">
        {/* ── PAGE HEADER ── */}
        <header className="pt-16 md:pt-24 pb-12 md:pb-20 border-b border-border/50">
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] text-muted-foreground/60 mb-4">
            {isFr ? "Réflexions & Analyses" : "Insights & Analysis"}
          </p>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none uppercase">
            Blog
          </h1>
        </header>



        {/* ── FEATURED ARTICLE ── */}
        {featured && (
          <section className="py-16 md:py-24 border-b border-border/40">
            <article className="group grid md:grid-cols-2 gap-10 md:gap-16 items-start">
              {/* Image */}
              {featured.thumbnail ? (
                <div className="relative aspect-[3/2] overflow-hidden bg-muted">
                  <Image
                    src={featured.thumbnail}
                    alt={featured.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                </div>
              ) : (
                <div className="relative aspect-[3/2] bg-muted/60" />
              )}

              {/* Content */}
              <div className="flex flex-col justify-center gap-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/60">
                  {isFr ? "Article à la une" : "Featured article"}
                </p>
                <Link href={`/${lang}/blog/${featured.slug}`} className="w-fit">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight hover:underline">
                    {featured.title}
                  </h2>
                </Link>
                {featured.description && (
                  <p className="text-muted-foreground leading-relaxed line-clamp-3">
                    {featured.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-muted-foreground/70 font-medium uppercase tracking-widest">
                  {featured.date && (
                    <time>{formatDate(new Date(featured.date), lang)}</time>
                  )}
                  {featured.readTime && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      {featured.readTime}
                    </span>
                  )}
                </div>
              </div>
            </article>
          </section>
        )}

        {/* ── ARTICLE GRID ── */}
        {rest.length > 0 && (
          <section className="py-16 md:py-24">
            <div className="grid md:grid-cols-2 gap-x-12 lg:gap-x-20 gap-y-16 md:gap-y-24">
              {rest.map((post: any, idx: number) => {
                const date = post.date ? new Date(post.date) : null;

                return (
                  <article key={post.slug} className="group flex flex-col gap-6">
                    {/* Image */}
                    <div className="relative aspect-[3/2] overflow-hidden bg-muted/60">
                      {post.thumbnail ? (
                        <Image
                          src={post.thumbnail}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-3">
                      <Link href={`/${lang}/blog/${post.slug}`} className="w-fit">
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight leading-snug hover:underline">
                          {post.title}
                        </h2>
                      </Link>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground/60 font-medium uppercase tracking-widest">
                        {date && <time>{formatDate(date, lang)}</time>}
                        {post.readTime && (
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3" />
                            {post.readTime}
                          </span>
                        )}
                      </div>
                      {post.description && (
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                          {post.description}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>

            {/* ── EMPTY STATE ── */}
            {rest.length === 0 && !featured && (
              <div className="py-32 text-center">
                <p
                  className="text-3xl text-muted-foreground/50 font-light"
                >
                  {isFr ? "Aucun article pour l'instant." : "No articles yet."}
                </p>
              </div>
            )}
          </section>
        )}

        {/* ── EMPTY STATE (no posts at all) ── */}
        {posts.length === 0 && (
          <div className="py-40 text-center">
            <p className="text-3xl text-muted-foreground/50 font-light">
              {isFr ? "Aucun article pour l'instant." : "No articles yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
