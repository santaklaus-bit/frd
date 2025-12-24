'use client';

import { Camera } from 'lucide-react';

export default function LifestylePage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="max-w-3xl mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Lifestyle & Perspectives
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        Contenus plus personnels qui montrent l'envers du décor : mon quotidien, mon parcours, mes inspirations.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div
                            key={i}
                            className="group aspect-[4/5] border border-border rounded-lg overflow-hidden bg-background hover:border-foreground/20 transition-all cursor-pointer"
                        >
                            <div className="w-full h-full bg-muted flex flex-col items-center justify-center p-4">
                                <Camera className="h-10 w-10 text-muted-foreground/30 mb-2" />
                                <p className="text-sm text-muted-foreground text-center">
                                    Moment {i}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
