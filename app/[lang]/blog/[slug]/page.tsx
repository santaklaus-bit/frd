import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getBlogPost } from "@/lib/content-manager";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getMDXComponents } from "@/mdx-components";

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

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
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
  const formattedDate = formatDate(date);

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

      <div className="space-y-4 border-b border-border relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col gap-6 p-6">
          <div className="flex flex-wrap items-center gap-3 gap-y-5 text-sm text-muted-foreground">
            <Button variant="outline" asChild className="h-6 w-6">
              <Link href={`/${lang}/blog`}>
                <ArrowLeft className="w-4 h-4" />
                <span className="sr-only">Back to all articles</span>
              </Link>
            </Button>
            <time className="font-medium text-muted-foreground">
              {formattedDate}
            </time>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold tracking-tighter text-balance">
            {page.title}
          </h1>

          {page.description && (
            <p className="text-muted-foreground max-w-4xl md:text-lg md:text-balance">
              {page.description}
            </p>
          )}
        </div>
      </div>
      <div className="flex divide-x divide-border relative max-w-7xl mx-auto px-4 md:px-0 z-10">
        <div className="absolute max-w-7xl mx-auto left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] lg:w-full h-full border-x border-border p-0 pointer-events-none" />
        <main className="w-full p-0 overflow-hidden border-r-0">
          {page.thumbnail && (
            <div className="relative w-full h-[500px] overflow-hidden object-cover border border-transparent border-r-0">
              <Image
                src={page.thumbnail}
                alt={page.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          <div className="p-6 lg:p-10 border-r-0">
            <div className="prose dark:prose-invert max-w-none prose-headings:scroll-mt-8 prose-headings:font-semibold prose-a:no-underline prose-headings:tracking-tight prose-headings:text-balance prose-p:tracking-tight prose-p:text-balance prose-lg">
              <MDXRemote source={page.content} components={getMDXComponents()} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
