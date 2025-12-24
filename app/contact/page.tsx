'use client';

import { ContactForm } from '@/components/contact-form';
import { Mail, Linkedin, Twitter } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-5xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Contact
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        N&apos;hésitez pas à me contacter pour toute demande de collaboration, entrevue ou message général.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    {/* Contact Form - Takes 2 columns */}
                    <div className="md:col-span-2">
                        <div className="p-8 border border-border rounded-lg bg-background">
                            <ContactForm />
                        </div>
                    </div>

                    {/* Contact Info Sidebar */}
                    <div className="space-y-6">
                        <div className="p-6 border border-border rounded-lg bg-muted/30">
                            <h3 className="font-semibold mb-4">
                                Informations de contact
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                    <Mail className="h-4 w-4" />
                                    <span>contact@fariddanko.com</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-6 border border-border rounded-lg bg-muted/30">
                            <h3 className="font-semibold mb-4">
                                Réseaux sociaux
                            </h3>
                            <div className="space-y-3">
                                <a
                                    href="https://linkedin.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <Linkedin className="h-4 w-4" />
                                    <span>LinkedIn</span>
                                </a>
                                <a
                                    href="https://twitter.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <Twitter className="h-4 w-4" />
                                    <span>Twitter</span>
                                </a>
                            </div>
                        </div>

                        <div className="p-6 border border-border rounded-lg bg-muted/30">
                            <h3 className="font-semibold mb-2">
                                Temps de réponse
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Je m&apos;efforce de répondre à toutes les demandes dans un délai de 48 heures.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
