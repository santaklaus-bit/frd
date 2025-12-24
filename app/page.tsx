import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Briefcase, Video, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroSection } from '@/components/hero-section';
import { docs, meta } from "@/.source";
import { loader } from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx";

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

export default function HomePage() {
  const posts = blogSource.getPages().sort((a, b) => {
    return new Date(b.data.date ?? 0).getTime() - new Date(a.data.date ?? 0).getTime();
  }).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />

      {/* About Preview Section */}
      <section className="py-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                À propos
              </h2>
              <div className="prose prose-lg dark:prose-invert">
                <p className="text-muted-foreground leading-relaxed">
                  Je suis un entrepreneur social animé par un désir profond d&apos;être utile à l&apos;humanité. Depuis l&apos;âge de dix ans, je ressens le besoin de créer des opportunités là où elles manquent, de transformer des idées en solutions concrètes et de contribuer à un monde plus juste.
                </p>
                <p className="text-muted-foreground leading-relaxed mt-4">
                  Fort d&apos;un parcours en sciences politiques et en droit, j&apos;ai développé mes compétences à travers des formations spécialisées en économie circulaire, développement durable et intervention rurale.
                </p>
              </div>
              <Link href="/about" className="inline-block mt-6">
                <Button variant="outline" className="gap-2">
                  En savoir plus
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative h-[400px] rounded-lg bg-muted flex items-center justify-center">
              <Briefcase className="h-24 w-24 text-muted-foreground/20" />
            </div>
          </div>
        </div>
      </section>

      {/* Production Section */}
      <section className="py-20 border-b border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Production
            </h2>
            <p className="text-lg text-muted-foreground">
              Des idées, des voix, des réalités, des visions
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              { title: 'Entrevues', href: '/production/interviews' },
              { title: 'Podcasts / Audio', href: '/production/podcasts' },
              { title: 'Capsules & Réflexions', href: '/production/capsules' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group p-6 border border-border rounded-lg bg-background hover:border-foreground/20 transition-all"
              >
                <Video className="h-8 w-8 mb-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link href="/production">
              <Button variant="outline" className="gap-2">
                Voir toutes les productions
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Initiatives Section */}
      <section className="py-20 border-b border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Initiatives
            </h2>
            <p className="text-lg text-muted-foreground">
              Projets à impact social et entrepreneurial
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="p-8 border border-border rounded-lg bg-background hover:border-foreground/20 transition-all"
              >
                <Target className="h-8 w-8 mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-3">
                  Initiative à venir
                </h3>
                <p className="text-muted-foreground">
                  Détails à venir sur cette initiative à impact social.
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/initiatives">
              <Button variant="outline" className="gap-2">
                Découvrir les initiatives
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Blog
            </h2>
            <p className="text-lg text-muted-foreground">
              Articles et réflexions récents
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
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
                  <div className="flex flex-1 flex-col p-6 text-left">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold tracking-tight mb-2 group-hover:text-primary transition-colors">
                        {post.data.title}
                      </h3>
                      {post.data.description && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {post.data.description}
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

          <div className="text-center">
            <Link href="/blog">
              <Button variant="outline" className="gap-2">
                Voir tous les articles
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
