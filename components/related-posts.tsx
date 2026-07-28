import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowUpRight } from "lucide-react";
import { getBlogPosts } from "@/lib/content-manager";
import { isPdfUrl } from "@/lib/documents";

interface RelatedPostsProps {
  /** Slug of the article currently being read — excluded from the suggestions */
  currentSlug: string;
  lang: string;
  limit?: number;
}

const STOP_WORDS = new Set([
  // fr
  "le", "la", "les", "un", "une", "des", "du", "de", "et", "ou", "en", "au", "aux",
  "dans", "pour", "par", "sur", "avec", "sans", "que", "qui", "quoi", "dont", "est",
  "sont", "ce", "cet", "cette", "ces", "son", "sa", "ses", "leur", "leurs", "plus",
  "pas", "ne", "nous", "vous", "ils", "elles", "comme", "mais", "aussi", "tout",
  // en
  "the", "a", "an", "and", "or", "of", "to", "in", "on", "for", "with", "without",
  "is", "are", "this", "that", "these", "those", "its", "their", "from", "as",
  "at", "by", "be", "it", "not", "but", "also", "all", "how", "what", "why",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !STOP_WORDS.has(word));
}

function pick(field: any, lang: string): string {
  if (!field) return "";
  return field[lang] || field.fr || field.en || "";
}

const formatDate = (date: Date, lang: string): string =>
  date.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

/**
 * Suggests further reading at the bottom of an article.
 * Ranks the other posts by keyword overlap with the current one, then falls
 * back to the most recent ones so the section is never empty.
 */
export async function RelatedPosts({ currentSlug, lang, limit = 3 }: RelatedPostsProps) {
  const allPosts = await getBlogPosts();

  const current = allPosts.find(
    (p: any) => p.slug === currentSlug || p.slugEn === currentSlug
  );
  const others = allPosts.filter(
    (p: any) => p.slug !== currentSlug && p.slugEn !== currentSlug
  );

  if (others.length === 0) return null;

  const currentTokens = new Set(
    current
      ? tokenize(`${pick(current.title, lang)} ${pick(current.description, lang)}`)
      : []
  );

  const ranked = others
    .map((post: any) => {
      const tokens = tokenize(
        `${pick(post.title, lang)} ${pick(post.description, lang)}`
      );
      const score = tokens.reduce(
        (total, token) => total + (currentTokens.has(token) ? 1 : 0),
        0
      );
      return { post, score, time: new Date(post.date ?? 0).getTime() };
    })
    .sort((a, b) => (b.score - a.score) || (b.time - a.time))
    .slice(0, limit)
    .map((entry) => entry.post);

  const isFr = lang === "fr";

  return (
    <section className="mt-24 pt-16 border-t border-border/40 not-prose">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div className="space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60">
            {isFr ? "Pour aller plus loin" : "Keep reading"}
          </p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight uppercase">
            {isFr ? "Articles suggérés" : "Suggested articles"}
          </h2>
        </div>
        <Link
          href={`/${lang}/blog`}
          className="group inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
        >
          {isFr ? "Tous les articles" : "All articles"}
          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {ranked.map((post: any) => {
          const title = pick(post.title, lang);
          const description = pick(post.description, lang);
          const readTime = pick(post.readTime, lang);
          const date = post.date ? new Date(post.date) : null;

          return (
            <Link
              key={post.slug}
              href={`/${lang}/blog/${post.slug}`}
              className="group flex flex-col gap-4"
            >
              <div className="relative aspect-[3/2] overflow-hidden rounded-2xl bg-muted/60 border border-border/40">
                {post.thumbnail && !isPdfUrl(post.thumbnail) ? (
                  <Image
                    src={post.thumbnail}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-muted" />
                )}
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold leading-snug tracking-tight group-hover:underline">
                  {title}
                </h3>
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  {date && <time>{formatDate(date, lang)}</time>}
                  {readTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {readTime}
                    </span>
                  )}
                </div>
                {description && (
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {description}
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
