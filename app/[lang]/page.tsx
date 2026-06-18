export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Zap, TrendingUp, Users, BookOpen, FileText, Target, Lightbulb, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/hero-section";
import { getDictionary } from "@/lib/get-dictionary";
import { getBlogPosts, getData, getTestimonials } from "@/lib/content-manager";
import { Newsletter } from "@/components/newsletter";
import { TestimonialsSection } from "@/components/testimonials-section";
import { Metadata } from "next";

const formatDate = (date: Date, lang: string): string => {
  return date.toLocaleDateString(lang === "fr" ? "fr-FR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "fr");
  return {
    title: dict.seo.home.title,
    description: dict.seo.home.description,
  };
}

export default async function HomePage({
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
  ).slice(0, 2);

  const rawExpertise = await getData("expertise");
  const expertiseItems = rawExpertise.slice(0, 3).map((item: any) => ({
    title: item.title?.[lang] || item.title?.fr || "",
    desc: item.description?.[lang] || item.description?.fr || "",
    href: `/${lang}/expertise/${item.slug}`,
  }));

  const rawProjects = await getData("projects");
  const projectCards = rawProjects.slice(0, 3).map((item: any) => ({
    title: item.title?.[lang] || item.title?.fr || "",
    desc: item.description?.[lang] || item.description?.fr || "",
    image: item.image || "/farid-portrait.webp",
    href: `/${lang}/projects/${item.slug}`,
  }));

  const testimonials = await getTestimonials();

  const featuredProject = rawProjects.find((p: any) => p.isFeatured === true);
  const featuredProjectData = featuredProject ? {
    title: featuredProject.title?.[lang as "en" | "fr"] || featuredProject.title?.fr || "",
    desc: featuredProject.description?.[lang as "en" | "fr"] || featuredProject.description?.fr || "",
    caption: featuredProject.imageCaption?.[lang as "en" | "fr"] || featuredProject.imageCaption?.fr || "",
    image: featuredProject.image || "/farid-portrait.webp",
    href: `/${lang}/projects/${featuredProject.slug}`,
  } : null;

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-24">
      {/* ── 1. HERO ── */}
      <HeroSection lang={lang} dict={dict} />

      {/* ── 2. À PROPOS ── */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <div className="relative aspect-[3/4] max-h-[500px] md:max-h-none rounded-2xl md:rounded-3xl overflow-hidden group shadow-xl md:shadow-2xl">
              <Image
                src="/farid-portrait.webp"
                alt="Farid Danko"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none no-copy"
                priority
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 md:mb-6 lg:mb-8 tracking-tight uppercase">
                {dict.nav.about}
              </h2>
              <div className="space-y-3 md:space-y-4">
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base md:text-lg">
                  {dict.about.content1}
                </p>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base md:text-lg">
                  {dict.about.content3.substring(0, 220)}...
                </p>
              </div>
              <Link href={`/${lang}/about`} className="inline-block mt-6 md:mt-8">
                <Button
                  variant="outline"
                  className="gap-2 px-6 md:px-8 rounded-full font-bold uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors text-sm"
                >
                  {lang === "fr" ? "En savoir plus" : "Learn more"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. EXPERTISE ── */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4 tracking-tight uppercase">
              {dict.expertise.title}
            </h2>
            <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              {dict.expertise.description}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-12">
            {expertiseItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group p-6 md:p-8 border border-border rounded-2xl bg-background hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 uppercase tracking-tight group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  {item.desc}
                </p>
                <div className="flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground">
                  {lang === "fr" ? "Explorer" : "Explore"}
                  <ArrowRight className="h-3.5 w-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link href={`/${lang}/expertise`}>
              <Button
                variant="outline"
                className="gap-2 px-6 md:px-8 py-4 md:py-6 rounded-full font-bold uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors text-sm"
              >
                {lang === "fr" ? "Voir mon expertise" : "View my expertise"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 3. FEATURED PROJECT ── */}
      {featuredProjectData && (
        <section className="py-12 md:py-20 lg:py-28 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12 lg:mb-16 tracking-tight uppercase text-center">
              {dict.featuredProject?.title || (lang === "fr" ? "Projet mis en avant" : "Featured Project")}
            </h2>
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
              <div className="relative aspect-[4/3] rounded-2xl md:rounded-3xl overflow-hidden bg-muted shadow-xl md:shadow-2xl group">
                <Image
                  src={featuredProjectData.image}
                  alt={featuredProjectData.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {featuredProjectData.caption && (
                  <p className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4 text-white text-xs leading-snug">
                    <span className="font-bold block">{featuredProjectData.caption}</span>
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-4 md:gap-6">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold uppercase tracking-tight">
                  {featuredProjectData.title}
                </h3>
                <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed">
                  {featuredProjectData.desc}
                </p>
                <Link href={featuredProjectData.href} className="inline-block">
                  <Button className="gap-2 px-6 sm:px-8 py-5 sm:py-6 rounded-full font-bold uppercase bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-all shadow-xl text-sm sm:text-base">
                    {dict.featuredProject?.cta || (lang === "fr" ? "Découvrir le projet" : "Discover project")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 4. PROJECTS ── */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-border bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 md:mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight uppercase">
              {dict.projects.title}
            </h2>
            <Link href={`/${lang}/projects`} className="shrink-0">
              <Button
                variant="ghost"
                className="gap-2 font-bold uppercase text-sm hover:text-foreground text-muted-foreground"
              >
                {lang === "fr" ? "Voir tous les projets" : "All projects"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {projectCards.map((card, i) => (
              <Link
                key={i}
                href={card.href}
                className="group flex flex-col border border-border rounded-2xl bg-background overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <div className="relative h-40 sm:h-44 md:h-48 bg-muted overflow-hidden">
                  <Image
                    src={card.image || "/farid-portrait.webp"}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105 opacity-60"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors" />
                  <h3 className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4 text-white font-bold text-base md:text-lg uppercase tracking-tight leading-tight">
                    {card.title}
                  </h3>
                </div>
                <div className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {card.desc}
                  </p>
                  <div className="flex items-center gap-2 mt-4 md:mt-5 text-xs font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
                    {lang === "fr" ? "Lire le projet" : "Read project"}
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. BLOG ── */}
      <section className="py-12 md:py-20 lg:py-28 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 md:mb-12 lg:mb-16">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-3 tracking-tight uppercase">
                {lang === "fr" ? "Réflexions & analyses" : "Insights & analysis"}
              </h2>
              <div className="flex gap-2 md:gap-3">
                {[
                  { label: lang === "fr" ? "Projets" : "Projects", icon: FileText },
                  { label: lang === "fr" ? "Contenus" : "Content", icon: BookOpen },
                ].map((cat) => (
                  <span
                    key={cat.label}
                    className="inline-flex items-center gap-1.5 text-[10px] md:text-xs font-bold px-2.5 md:px-3 py-1 md:py-1.5 rounded-full bg-muted text-muted-foreground uppercase tracking-widest"
                  >
                    <cat.icon className="h-3 w-3" />
                    {cat.label}
                  </span>
                ))}
              </div>
            </div>
            <Link href={`/${lang}/blog`} className="shrink-0">
              <Button
                variant="ghost"
                className="gap-2 font-bold uppercase text-sm hover:text-foreground text-muted-foreground"
              >
                {lang === "fr" ? "Accéder au blog" : "Go to blog"}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
            {posts.map((post: any) => {
              const date = post.date ? new Date(post.date) : null;
              const postTitle = post.title[lang as 'fr'|'en'] || post.title.fr || post.title.en || '';
              const postDesc = post.description[lang as 'fr'|'en'] || post.description.fr || post.description.en || '';
              return (
                <Link
                  key={post.slug}
                  href={`/${lang}/blog/${post.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card hover:shadow-2xl transition-all"
                >
                  {post.thumbnail && (
                    <div className="relative h-44 sm:h-48 md:h-52 w-full overflow-hidden">
                      <Image
                        src={post.thumbnail}
                        alt={postTitle}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col p-5 sm:p-6 md:p-8">
                    <h3 className="text-lg md:text-xl font-bold tracking-tight mb-2 md:mb-3 group-hover:text-primary transition-colors leading-tight">
                      {postTitle}
                    </h3>
                    {postDesc && (
                      <p className="text-muted-foreground line-clamp-3 text-sm leading-relaxed flex-1">
                        {postDesc}
                      </p>
                    )}
                    <div className="mt-4 md:mt-5 flex items-center justify-between text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      {date && <time>{formatDate(date, lang)}</time>}
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>



      {/* ── 6. TESTIMONIALS ── */}
      <TestimonialsSection testimonials={testimonials} lang={lang as "en" | "fr"} />

      {/* Newsletter */}
      <Newsletter lang={lang} dict={dict} />
    </div>
  );
}
