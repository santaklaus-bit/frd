'use client';

import { Film } from 'lucide-react';

export default function CapsulesPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="max-w-3xl mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Capsules & Réflexions
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Vidéos ou extraits courts où je partage une idée, une réflexion ou une observation.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div
                            key={i}
                            className="group aspect-square border border-border rounded-lg overflow-hidden bg-background hover:border-foreground/20 transition-all cursor-pointer"
                        >
                            <div className="w-full h-full bg-muted flex flex-col items-center justify-center p-4">
                                <Film className="h-8 w-8 text-muted-foreground/30 mb-2" />
                                <p className="text-xs text-muted-foreground text-center">
                                    Capsule {i}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
