'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';

export function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            if (res.status === 409) {
                toast.success("Vous êtes déjà inscrit !");
                setEmail("");
                return;
            }

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                console.error("[NewsletterForm] API error:", data);
                if (res.status === 400 && data.errors && Array.isArray(data.errors)) {
                    data.errors.forEach((err: any) => toast.error(err.message));
                } else {
                    toast.error("Une erreur est survenue.");
                }
                return;
            }

            toast.success("Merci pour votre inscription !");
            setEmail("");
        } catch (err) {
            console.error("[NewsletterForm] ctx:", err);
            toast.error("Erreur de connexion.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md">
            <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse e-mail"
                    required
                    className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
            </div>
            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Inscription...' : 'S\'inscrire'}
            </Button>
        </form>
    );
}
