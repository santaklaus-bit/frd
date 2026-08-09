'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';
import { parseApiError, parseNetworkError, formatErrorForDisplay } from '@/lib/error-handler';

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

            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                // Handle already subscribed
                if (res.status === 409) {
                    toast.info("Vous êtes déjà inscrit à la newsletter !");
                    setEmail("");
                    return;
                }

                const error = parseApiError(res, data, 'fr');
                const displayMessage = formatErrorForDisplay(error);
                console.error(`[NewsletterForm] Error (${error.code}):`, error);
                toast.error(displayMessage);
                return;
            }

            toast.success("Merci ! Bienvenue dans notre newsletter. Vous recevrez nos prochains articles par email.");
            setEmail("");
        } catch (err) {
            const error = parseNetworkError(err as Error, 'fr');
            const displayMessage = formatErrorForDisplay(error);
            console.error(`[NewsletterForm] Error (${error.code}):`, error);
            toast.error(displayMessage);
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
