'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FlickeringGrid } from '@/components/magicui/flickering-grid';

export function HeroSection() {
    return (
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
    );
}
