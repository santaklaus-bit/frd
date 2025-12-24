'use client';

import { GraduationCap, Briefcase, Award, Users } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-6 py-20">
                <h1 className="text-4xl md:text-5xl font-bold mb-8">À propos de moi</h1>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                        Je suis un entrepreneur social animé par un désir profond d&apos;être utile à l&apos;humanité. Depuis l&apos;âge de dix ans, je ressens le besoin de créer des opportunités là où elles manquent, de transformer des idées en solutions concrètes et de contribuer à un monde plus juste.
                    </p>

                    <div className="my-12 p-6 border border-border rounded-lg bg-muted/30">
                        <div className="flex items-start gap-4">
                            <Briefcase className="h-6 w-6 mt-1 text-muted-foreground flex-shrink-0" />
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">Parcours</h2>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    Issu d&apos;un milieu entrepreneurial, avec des parents entrepreneurs, j&apos;ai grandi avec un sens aigu des responsabilités nourri par la curiosité, la débrouillardise et l&apos;engagement envers des valeurs humaines fortes telles que la générosité, l&apos;écoute active et le partage. Ces principes ont façonné mon approche du leadership, toujours centrée sur l&apos;impact collectif.
                                </p>
                                <p className="text-muted-foreground leading-relaxed mb-4">
                                    En tant que générateur prolifique d&apos;idées et bâtisseur de projets, j&apos;ai aidé plus de cinquante personnes et organisations à clarifier leur vision, structurer leurs initiatives et poser les bases de projets porteurs de sens. Je me spécialise dans la création d&apos;entreprises, le développement organisationnel, la gestion de projets, le positionnement stratégique et la gestion du changement.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    J&apos;ai également accompagné plusieurs organisations — tant à but non lucratif que dans le secteur privé — dans la recherche de financement auprès d&apos;institutions bancaires, de bailleurs de fonds et par le biais d&apos;appels à projets. Mon rôle est d&apos;apporter un soutien, de structurer les idées et de renforcer le positionnement stratégique pour maximiser les chances de succès.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="my-12 p-6 border border-border rounded-lg bg-muted/30">
                        <div className="flex items-start gap-4">
                            <GraduationCap className="h-6 w-6 mt-1 text-muted-foreground flex-shrink-0" />
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">Formation</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    En plus de ma formation académique en sciences politiques et en droit à l&apos;Université du Québec à Montréal (UQAM), j&apos;ai développé mes compétences à travers des formations spécialisées en économie circulaire, développement durable, intervention rurale et accompagnement international, notamment auprès de l&apos;Organisation internationale du travail. Ces expériences m&apos;ont permis de développer une approche humaine et systémique, solidement ancrée dans les réalités pratiques.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="my-12 p-6 border border-border rounded-lg bg-muted/30">
                        <div className="flex items-start gap-4">
                            <Award className="h-6 w-6 mt-1 text-muted-foreground flex-shrink-0" />
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">Expertise</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    J&apos;ai dirigé des projets d&apos;envergure, notamment le Programme d&apos;apprentissage en milieu de travail pour des métiers du secteur de l&apos;environnement, coordonné des programmes liés à l&apos;employabilité et à l&apos;insertion socioprofessionnelle, et participé à des révisions de normes professionnelles. Mon expertise inclut également la gestion du changement en milieu organisationnel et la structuration de projets à impact social.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="my-12 p-6 border border-border rounded-lg bg-muted/30">
                        <div className="flex items-start gap-4">
                            <Users className="h-6 w-6 mt-1 text-muted-foreground flex-shrink-0" />
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">Affiliations professionnelles</h2>
                                <p className="text-muted-foreground leading-relaxed">
                                    Je suis membre d&apos;ordres professionnels du Québec, ce qui témoigne de mon engagement envers des standards élevés en matière de gouvernance, de conseil en gestion et de professionnalisme.
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="text-xl text-muted-foreground leading-relaxed mt-12 font-medium">
                        Aujourd&apos;hui, je mets cette expertise au service de celles et ceux qui souhaitent entreprendre autrement — avec clarté, cohérence et impact.
                    </p>
                </div>
            </div>
        </div>
    );
}
