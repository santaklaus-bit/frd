'use client';

import { Target, Users, Lightbulb, TrendingUp } from 'lucide-react';

export default function InitiativesPage() {
    const initiatives = [
        {
            icon: Target,
            title: 'Programme d\'apprentissage en milieu de travail',
            description: 'Programme d\'envergure pour les métiers du secteur de l\'environnement, visant à faciliter l\'insertion professionnelle et le développement de compétences pratiques.',
            category: 'Employabilité',
        },
        {
            icon: Users,
            title: 'Insertion socioprofessionnelle',
            description: 'Coordination de programmes dédiés à l\'employabilité et à l\'insertion socioprofessionnelle, accompagnant les individus vers des parcours professionnels porteurs de sens.',
            category: 'Développement social',
        },
        {
            icon: Lightbulb,
            title: 'Révision de normes professionnelles',
            description: 'Participation active à la révision de normes professionnelles pour assurer leur pertinence et leur alignement avec les réalités du marché du travail.',
            category: 'Normalisation',
        },
        {
            icon: TrendingUp,
            title: 'Accompagnement organisationnel',
            description: 'Soutien à plus de cinquante organisations dans la structuration de leurs projets, la recherche de financement et le renforcement de leur positionnement stratégique.',
            category: 'Conseil',
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="max-w-3xl mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Initiatives
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Depuis toujours, je crois en l&apos;importance d&apos;agir et de contribuer à créer des opportunités. Cette page présente quelques initiatives que j&apos;ai portées ou accompagnées, à la croisée de l&apos;entrepreneuriat, du développement organisationnel et de l&apos;engagement social.
                    </p>
                </div>

                <div className="space-y-8">
                    {initiatives.map((initiative, index) => (
                        <div
                            key={index}
                            className="p-8 border border-border rounded-lg bg-background hover:border-foreground/20 hover:shadow-lg transition-all"
                        >
                            <div className="flex items-start gap-6">
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                                        <initiative.icon className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground">
                                            {initiative.category}
                                        </span>
                                    </div>
                                    <h2 className="text-2xl font-semibold mb-3">
                                        {initiative.title}
                                    </h2>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {initiative.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-16 p-8 border border-border rounded-lg bg-muted/30 text-center">
                    <h3 className="text-2xl font-semibold mb-4">
                        Vous avez un projet ?
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                        Je suis toujours ouvert à de nouvelles collaborations et opportunités de contribuer à des projets à impact social.
                    </p>
                    <a
                        href="/contact"
                        className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-md font-medium hover:bg-muted transition-colors"
                    >
                        Me contacter
                    </a>
                </div>
            </div>
        </div>
    );
}
