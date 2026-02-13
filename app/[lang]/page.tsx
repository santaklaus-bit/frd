import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Briefcase, Video, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/hero-section";
import { docs, meta } from "@/.source";
import { loader } from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx";
import { getDictionary } from "@/lib/get-dictionary";

const blogSource = loader({
  baseUrl: "/blog",
  source: createMDXSource(docs, meta),
});

const formatDate = (date: Date, lang: string): string => {
  return date.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

import { Newsletter } from "@/components/newsletter";

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "fr");

  const posts = blogSource
    .getPages()
    .sort((a, b) => {
      return (
        new Date(b.data.date ?? 0).getTime() -
        new Date(a.data.date ?? 0).getTime()
      );
    })
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Hero Section */}
      <HeroSection lang={lang} dict={dict} />

      {/* About Preview Section */}
      <section className="py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-8 tracking-tight uppercase">
                {dict.nav.about}
              </h2>
              <div className="prose prose-lg dark:prose-invert">
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {dict.about.content1}
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4 text-lg">
                  {dict.about.content2.substring(0, 200)}...
                </p>
              </div>
              <Link href={`/${lang}/about`} className="inline-block mt-8">
                <Button
                  variant="outline"
                  className="gap-2 px-8 rounded-full font-bold uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                >
                  {lang === "fr" ? "En savoir plus" : "Learn more"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative h-[600px] rounded-[2.5rem] overflow-hidden group shadow-2xl">
              <Image
                src="/farid-portrait.png"
                alt="Farid Danko"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* Production Section */}
      <section className="py-24 border-b border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 tracking-tight uppercase">
              {dict.production.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {dict.production.description}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              {
                title: dict.production.subpages.interviews.title,
                href: `/${lang}/production/interviews`,
              },
              {
                title: dict.production.subpages.podcasts.title,
                href: `/${lang}/production/podcasts`,
              },
              {
                title: dict.production.subpages.capsules.title,
                href: `/${lang}/production/capsules`,
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group p-8 border border-border rounded-2xl bg-background hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <Video className="h-10 w-10 mb-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <div className="flex items-center text-muted-foreground font-semibold group-hover:text-foreground">
                  {lang === "fr" ? "Découvrir" : "Explore"}
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link href={`/${lang}/production`}>
              <Button
                variant="outline"
                className="gap-2 px-10 py-6 rounded-full font-bold uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
              >
                {lang === "fr"
                  ? "Voir toutes les productions"
                  : "View all productions"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Initiatives Section */}
      <section className="py-24 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 tracking-tight uppercase">
              {dict.initiatives.title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {dict.initiatives.description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {[
              {
                title:
                  lang === "fr"
                    ? "Programme d'apprentissage"
                    : "Learning Programme",
                desc:
                  lang === "fr"
                    ? "Programme pour les métiers du secteur de l'environnement."
                    : "Environmental sector trades programme.",
              },
              {
                title:
                  lang === "fr"
                    ? "Insertion socioprofessionnelle"
                    : "Socio-professional Integration",
                desc:
                  lang === "fr"
                    ? "Coordination de programmes d'employabilité."
                    : "Employability programmes coordination.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-10 border border-border rounded-2xl bg-background hover:shadow-lg transition-all group"
              >
                <Target className="h-12 w-12 mb-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href={`/${lang}/initiatives`}>
              <Button
                variant="outline"
                className="gap-2 px-10 py-6 rounded-full font-bold uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
              >
                {lang === "fr"
                  ? "Découvrir les initiatives"
                  : "Explore initiatives"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 tracking-tight uppercase">
              {dict.nav.blog}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {lang === "fr"
                ? "Articles et réflexions récents"
                : "Recent articles and reflections"}
            </p>
          </div>

          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 mb-16">
            {posts.map((post) => {
              const date = post.data.date ? new Date(post.data.date) : null;

              return (
                <Link
                  key={post.url}
                  href={`/${lang}${post.url}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card hover:shadow-2xl transition-all"
                >
                  {post.data.thumbnail && (
                    <div className="relative h-60 w-full overflow-hidden">
                      <Image
                        src={post.data.thumbnail}
                        alt={post.data.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-8 text-left">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold tracking-tight mb-4 group-hover:text-primary transition-colors leading-tight">
                        {post.data.title}
                      </h3>
                      {post.data.description && (
                        <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed">
                          {post.data.description}
                        </p>
                      )}
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        {date && <time>{formatDate(date, lang)}</time>}
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center">
            <Link href={`/${lang}/blog`}>
              <Button
                variant="outline"
                className="gap-2 px-10 py-6 rounded-full font-bold uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
              >
                {lang === "fr" ? "Voir tous les articles" : "View all articles"}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <Newsletter lang={lang} dict={dict} />
    </div>
  );
}
