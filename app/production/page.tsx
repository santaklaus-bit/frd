'use client';

import Link from 'next/link';
import { Video, Mic, Film, MapPin, Camera, ArrowRight } from 'lucide-react';

export default function ProductionPage() {
    const sections = [
        {
            title: 'Entrevues',
            description: 'Conversations filmées ou audio avec des personnes inspirantes, expertes ou actrices du changement.',
            href: '/production/interviews',
            icon: Video,
        },
        {
            title: 'Podcasts / Audio',
            description: 'Contenus audio ou discussions plus libres, intimes ou analytiques.',
            href: '/production/podcasts',
            icon: Mic,
        },
        {
            title: 'Capsules & Réflexions',
            description: 'Vidéos ou extraits courts où je partage une idée, une réflexion ou une observation.',
            href: '/production/capsules',
            icon: Film,
        },
        {
            title: 'Sur le terrain',
            description: 'Productions réalisées en contexte : immersion dans une communauté, observation d\'un projet, mission sur le terrain.',
            href: '/production/field',
            icon: MapPin,
        },
        {
            title: 'Lifestyle & Perspectives',
            description: 'Contenus plus personnels qui montrent l\'envers du décor : mon quotidien, mon parcours, mes inspirations.',
            href: '/production/lifestyle',
            icon: Camera,
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="max-w-3xl mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Production</h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Je produis ici du contenu pour transmettre: Des idées, des voix, des réalités, des visions.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sections.map((section) => (
                        <Link
                            key={section.href}
                            href={section.href}
                            className="group p-8 border border-border rounded-lg bg-background hover:border-foreground/20 hover:shadow-lg transition-all"
                        >
                            <section.icon className="h-12 w-12 mb-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                            <h2 className="text-2xl font-semibold mb-3">{section.title}</h2>
                            <p className="text-muted-foreground leading-relaxed mb-4">
                                {section.description}
                            </p>
                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground group-hover:text-foreground">
                                Explorer
                                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
