'use client';

import { MapPin } from 'lucide-react';

export default function FieldPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="max-w-3xl mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Sur le terrain
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Expertises réalisées en contexte : immersion dans une communauté, observation d&apos;un projet, mission sur le terrain.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {[1, 2].map((i) => (
                        <div
                            key={i}
                            className="group border border-border rounded-lg overflow-hidden bg-background hover:border-foreground/20 transition-all"
                        >
                            <div className="aspect-video bg-muted flex items-center justify-center">
                                <MapPin className="h-12 w-12 text-muted-foreground/30" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">
                                    Projet terrain {i}
                                </h3>
                                <p className="text-muted-foreground">
                                    Documentation d&apos;une initiative sur le terrain.
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
