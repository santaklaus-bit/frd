export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Download, Headphones, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getBlogPostByAnySlug } from "@/lib/content-manager";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getMDXComponents } from "@/mdx-components";
import { TableOfContents } from "@/components/table-of-contents";

import { siteConfig } from "@/lib/site";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug, lang } = await params;
  const page = await getBlogPostByAnySlug(slug);

  if (!page) notFound();
  
  const title = page.title[lang as 'fr'|'en'] || page.title.fr || page.title.en || "";
  const description = page.description[lang as 'fr'|'en'] || page.description.fr || page.description.en || "";
  const caption = page.imageCaption[lang as 'fr'|'en'] || page.imageCaption.fr || page.imageCaption.en || "";

  const imageUrl = page.thumbnail 
    ? (page.thumbnail.startsWith("http") ? page.thumbnail : `${siteConfig.url}${page.thumbnail.startsWith("/") ? "" : "/"}${page.thumbnail}`)
    : undefined;

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description: description || "",
      images: imageUrl ? [{ url: imageUrl, alt: caption || title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: description || "",
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { HashScrollHandler } from "@/components/hash-scroll-handler";
import { RelatedPosts } from "@/components/related-posts";

// @ts-ignore
import edjsParser from "editorjs-html";
import { customParsers } from "@/lib/editor-parsers";

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

  const page = await getBlogPostByAnySlug(slug);

  if (!page) {
    notFound();
  }

  const date = new Date(page.date);
  const formattedDate = formatDate(date, lang);
  
  const title = page.title[lang as 'fr'|'en'] || page.title.fr || page.title.en || "";
  const description = page.description[lang as 'fr'|'en'] || page.description.fr || page.description.en || "";
  const caption = page.imageCaption[lang as 'fr'|'en'] || page.imageCaption.fr || page.imageCaption.en || "";
  const readTime = page.readTime[lang as 'fr'|'en'] || page.readTime.fr || page.readTime.en || "";
  const wordCount = page.wordCount[lang as 'fr'|'en'] || page.wordCount.fr || page.wordCount.en || 0;
  const pdfUrl = page.pdfUrl[lang as 'fr'|'en'] || page.pdfUrl.fr || page.pdfUrl.en || "";
  const audioUrl = page.audioUrl[lang as 'fr'|'en'] || page.audioUrl.fr || page.audioUrl.en || "";
  const content = page.content[lang as 'fr'|'en'] || page.content.fr || page.content.en || "";

  const author = {
    name: (page as any).authorName || "Farid DANKO", // fallback to site creator
    position: lang === "fr" ? "Auteur" : "Author",
    avatar: (page as any).authorPhoto || "/farid-portrait.webp", // fallback photo
  };

  // Editor.js Check & Parse
  let isEditorJs = false;
  let renderedHtml = "";
  
  if (content && (content.startsWith("{") || content.startsWith('{"'))) {
    try {
      const parsed = JSON.parse(content);
      if (parsed && parsed.blocks && Array.isArray(parsed.blocks)) {
        isEditorJs = true;
        const parser = edjsParser(customParsers);
        const htmlBlocks = parser.parse(parsed);
        renderedHtml = Array.isArray(htmlBlocks) ? htmlBlocks.join("") : (htmlBlocks as string);
      }
    } catch (e) {
      console.warn("Content looks like JSON but failed to parse as EditorJS:", e);
    }
  }

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
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-balance leading-tight uppercase">
                {title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-4 border-t border-border/40">
                <img
                  src={author.avatar}
                  alt={author.name}
                  className="rounded-full w-8 h-8 flex-shrink-0 border border-border object-cover"
                />
                <span className="text-sm font-semibold tracking-tight text-foreground">{author.name}</span>
                <span className="text-muted-foreground/40 hidden sm:inline">•</span>
                <time className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  {formattedDate}
                </time>
                {readTime && (
                  <>
                    <span className="text-muted-foreground/40 hidden sm:inline">•</span>
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {readTime}
                    </span>
                  </>
                )}
                {wordCount && (
                  <>
                    <span className="text-muted-foreground/40 hidden sm:inline">•</span>
                    <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      <FileText className="w-3.5 h-3.5" />
                      {wordCount} {lang === "fr" ? "mots" : "words"}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10">
        <div className="grid lg:grid-cols-[1fr_300px] gap-12 lg:gap-20">
          <main className="space-y-12">
            {/* Audio Player Section */}
            {audioUrl && (
              <div className="bg-card/50 backdrop-blur-md border border-border/40 rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-xl">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Headphones className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <p className="text-sm font-bold uppercase tracking-wider text-foreground">
                    {lang === "fr" ? "Écouter l'article" : "Listen to article"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {lang === "fr" ? "Lecture audio par l'auteur" : "Audio narration by author"}
                  </p>
                </div>
                <audio controls className="w-full sm:w-64 h-10 custom-audio-player">
                  <source src={audioUrl} type="audio/mpeg" />
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            {page.thumbnail && (
              <div className="space-y-4">
                <div className={`relative rounded-3xl overflow-hidden border border-border/40 shadow-2xl group bg-muted/30 ${page.thumbnail.toLowerCase().endsWith('.pdf') ? 'h-[80vh]' : ''}`}>
                  {page.thumbnail.toLowerCase().endsWith('.pdf') ? (
                    <iframe
                      src={page.thumbnail}
                      title={title}
                      className="w-full h-full border-none"
                    />
                  ) : (
                    <img
                      src={page.thumbnail}
                      alt={title}
                      className="w-full h-auto max-h-[700px] object-contain transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                {caption && (
                  <p className="text-sm text-muted-foreground italic px-2 border-l-2 border-primary/30 py-1">
                    {caption}
                  </p>
                )}
              </div>
            )}

            {/* Document Download/Preview Section for Mobile */}
            {pdfUrl && (
              <div className="lg:hidden p-6 rounded-3xl border border-border/40 bg-card shadow-lg space-y-4 mb-12">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
                    <FileText className="w-5 h-5" />
                  </div>
                  <p className="text-sm font-bold uppercase tracking-wider">Document</p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {lang === "fr" 
                    ? "Consultez ou téléchargez le document joint à cet article." 
                    : "View or download the document attached to this article."}
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button asChild variant="outline" className="flex-1 rounded-2xl h-12 font-bold uppercase tracking-widest text-[10px]">
                    <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                      {lang === "fr" ? "Prévisualiser" : "Preview"}
                    </a>
                  </Button>
                  <Button asChild className="flex-1 rounded-2xl h-12 bg-foreground text-background font-bold uppercase tracking-widest text-[10px] shadow-lg hover:opacity-90">
                    <a href={pdfUrl} download target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      {lang === "fr" ? "Télécharger" : "Download"}
                    </a>
                  </Button>
                </div>
              </div>
            )}

            <div className="prose dark:prose-invert max-w-none 
              prose-headings:font-semibold prose-headings:tracking-tighter prose-headings:uppercase 
              prose-p:text-muted-foreground/90 prose-p:leading-relaxed prose-lg
              prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-r-2xl prose-blockquote:italic
              article-content-premium">
              {isEditorJs ? (
                <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
              ) : (
                <MDXRemote source={content} components={getMDXComponents()} />
              )}
            </div>

            {/* ── SUGGESTED ARTICLES ── */}
            <RelatedPosts currentSlug={slug} lang={lang} />
          </main>

          <aside className="hidden lg:block">
            <div className="sticky top-32 space-y-10">
              {/* PDF Download Button */}
              {pdfUrl && (
                <div className="p-6 rounded-3xl border border-border/40 bg-card shadow-lg space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-red-500/10 text-red-500">
                      <FileText className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-bold uppercase tracking-wider">Document</p>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {lang === "fr" 
                      ? "Consultez ou téléchargez le document joint à cet article." 
                      : "View or download the document attached to this article."}
                  </p>
                  <div className="flex flex-col gap-3">
                    <Button asChild variant="outline" className="w-full rounded-2xl h-12 font-bold uppercase tracking-widest text-[10px]">
                      <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                        {lang === "fr" ? "Prévisualiser" : "Preview"}
                      </a>
                    </Button>
                    <Button asChild className="w-full rounded-2xl h-12 bg-foreground text-background font-bold uppercase tracking-widest text-[10px] shadow-lg hover:opacity-90">
                      <a href={pdfUrl} download target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" />
                        {lang === "fr" ? "Télécharger" : "Download"}
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              <TableOfContents />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
