'use client';

import { Video } from 'lucide-react';

export default function InterviewsPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="max-w-3xl mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Entrevues
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Conversations filmées ou audio avec des personnes inspirantes, expertes ou actrices du changement.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="group border border-border rounded-lg overflow-hidden bg-background hover:border-foreground/20 transition-all"
                        >
                            <div className="aspect-video bg-muted flex items-center justify-center">
                                <Video className="h-12 w-12 text-muted-foreground/30" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-semibold mb-2">
                                    Entrevue à venir {i}
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
