import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getBlogPost } from "@/lib/content-manager";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getMDXComponents } from "@/mdx-components";
import { AuthorCard } from "@/components/author-card";
import { authors } from "@/lib/authors";
import { TableOfContents } from "@/components/table-of-contents";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getBlogPost(slug);

  if (!page) notFound();

  return {
    title: page.title,
    description: page.description,
    openGraph: {
      type: "article",
      title: page.title,
      description: page.description || "",
      images: page.thumbnail ? [page.thumbnail] : [],
    },
  };
}

import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { HashScrollHandler } from "@/components/hash-scroll-handler";

interface PageProps {
  params: Promise<{ slug: string; lang: string }>;
}

const formatDate = (date: Date, lang: string): string => {
  return date.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default async function BlogPost({ params }: PageProps) {
  const { slug, lang } = await params;

  if (!slug || slug.length === 0) {
    notFound();
  }

  const page = await getBlogPost(slug);

  if (!page) {
    notFound();
  }

  const date = new Date(page.date);
  const formattedDate = formatDate(date, lang);
  const author = authors.dillion; // Default author as per existing code patterns

  return (
    <div className="min-h-screen bg-background relative">
      <HashScrollHandler />
      <div className="absolute top-0 left-0 z-0 w-full h-[200px] [mask-image:linear-gradient(to_top,transparent_25%,black_95%)]">
        <FlickeringGrid
          className="absolute top-0 left-0 size-full"
          squareSize={4}
          gridGap={6}
          color="#6B7280"
          maxOpacity={0.2}
          flickerChance={0.05}
        />
      </div>

      <div className="border-b border-border relative z-10 bg-background/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-12 md:py-20">
          <div className="flex flex-col gap-8">
            <Button variant="ghost" asChild className="w-fit -ml-4 hover:bg-muted/50">
              <Link href={`/${lang}/blog`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-bold uppercase text-xs tracking-widest">
                <ArrowLeft className="w-4 h-4" />
                {lang === "fr" ? "Retour aux articles" : "Back to articles"}
              </Link>
            </Button>

            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-semibold tracking-tighter text-balance leading-[0.9] uppercase">
                {page.title}
              </h1>

              <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-border/40">
                <AuthorCard author={author} />
                <div className="h-8 w-px bg-border/40 hidden sm:block" />
                <time className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  {formattedDate}
                </time>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10">
        <div className="grid lg:grid-cols-[1fr_250px] gap-12 lg:gap-20">
          <main className="space-y-12">
            {page.thumbnail && (
              <div className="relative aspect-video rounded-3xl overflow-hidden border border-border/40 shadow-2xl group">
                <Image
                  src={page.thumbnail}
                  alt={page.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
              </div>
            )}
            <div className="prose dark:prose-invert max-w-none prose-headings:font-serif prose-headings:font-semibold prose-headings:tracking-tighter prose-headings:uppercase prose-p:text-muted-foreground prose-p:leading-relaxed prose-lg">
              <MDXRemote source={page.content} components={getMDXComponents()} />
            </div>
          </main>

          <aside className="hidden lg:block">
            <div className="sticky top-32 space-y-10">
              <TableOfContents />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
