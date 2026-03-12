'use client';

import { Mic } from 'lucide-react';

export default function PodcastsPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="max-w-3xl mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Podcasts / Audio
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Contenus audio ou discussions plus libres, intimes ou analytiques.
                    </p>
                </div>

                <div className="space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="flex items-center gap-4 p-6 border border-border rounded-lg bg-background hover:border-foreground/20 transition-all"
                        >
                            <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                                <Mic className="h-6 w-6 text-muted-foreground/30" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold mb-1">
                                    Épisode {i}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Contenu à venir prochainement.
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
