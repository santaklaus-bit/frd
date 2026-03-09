import { Metadata } from "next";
import { getDictionary } from "@/lib/get-dictionary";
import Link from "next/link";
import Image from "next/image";
import { getBlogPosts } from "@/lib/content-manager";

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

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("fr-FR", {
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
  const posts = await getBlogPosts();
  const { lang } = await params;

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
          const date = post.date ? new Date(post.date) : null;
          const url = `/${lang}/blog/${post.slug}`;

          return (
            <Link
              key={post.slug}
              href={url}
              className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card hover:shadow-lg transition-all"
            >
              {post.thumbnail && (
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold tracking-tight mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  {post.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {post.description}
                    </p>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                  {date && <time>{formatDate(date)}</time>}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
