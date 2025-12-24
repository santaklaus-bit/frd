'use client';

import Link from 'next/link';
import { ArrowRight, Briefcase, Video, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlickeringGrid } from '@/components/magicui/flickering-grid';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center border-b border-border">
        <div className="absolute top-0 left-0 z-0 w-full h-full [mask-image:linear-gradient(to_bottom,transparent_5%,black_50%,transparent_95%)]">
          <FlickeringGrid
            className="absolute top-0 left-0 size-full"
            squareSize={4}
            gridGap={6}
            color="#6B7280"
            maxOpacity={0.2}
            flickerChance={0.05}
          />
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h1 className="font-bold text-5xl md:text-6xl lg:text-7xl tracking-tight mb-6">
            Farid Danko
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4">
            Entrepreneur social • Conseiller en développement organisationnel
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Je mets mon expertise au service de celles et ceux qui souhaitent entreprendre autrement — avec clarté, cohérence et impact.
          </p>
          <Link href="/about">
            <Button size="lg" className="gap-2">
              Découvrir mon parcours
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

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

      {/* Collaborations Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Collaborations & Clients
            </h2>
            <p className="text-lg text-muted-foreground mb-12">
              Accompagnement de projets à impact
            </p>
            <div className="flex flex-wrap justify-center gap-8 items-center opacity-60">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="w-32 h-16 border border-border rounded-lg flex items-center justify-center text-sm text-muted-foreground"
                >
                  Client {i}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
