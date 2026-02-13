import { Metadata } from "next";
import { getDictionary } from "@/lib/get-dictionary";
import { docs, meta } from "@/.source";
import { loader } from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx";
import Link from "next/link";
import Image from "next/image";

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
    alternates: {
      canonical: `/${lang}/blog`,
    },
  };
}

const blogSource = loader({
  baseUrl: "/blog",
  source: createMDXSource(docs, meta),
});

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function BlogPage() {
  const posts = blogSource.getPages();

  return (
    <div className="container max-w-6xl py-12 lg:py-16">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Blog</h1>
        <p className="text-lg text-muted-foreground">
          Articles, réflexions et perspectives sur l&apos;entrepreneuriat
          social, le développement durable et l&apos;impact collectif.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const date = post.data.date ? new Date(post.data.date) : null;

          return (
            <Link
              key={post.url}
              href={post.url}
              className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card hover:shadow-lg transition-all"
            >
              {post.data.thumbnail && (
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={post.data.thumbnail}
                    alt={post.data.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold tracking-tight mb-2 group-hover:text-primary transition-colors">
                    {post.data.title}
                  </h2>
                  {post.data.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {post.data.description}
                    </p>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  {date && <time>{formatDate(date)}</time>}
                  {post.data.tags && post.data.tags.length > 0 && (
                    <div className="flex gap-2">
                      {post.data.tags.slice(0, 2).map((tag: string) => (
                        <span
                          key={tag}
                          className="rounded-md bg-muted px-2 py-1 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
