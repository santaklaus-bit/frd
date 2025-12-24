'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

export function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        // TODO: Integrate with email service provider
        setTimeout(() => {
            console.log('Newsletter subscription:', email);
            setStatus('success');
            setEmail('');
            setTimeout(() => setStatus('idle'), 3000);
        }, 1000);
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
            <Button type="submit" disabled={status === 'loading'}>
                {status === 'loading' ? 'Inscription...' : 'S\'inscrire'}
            </Button>
            {status === 'success' && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                    Merci pour votre inscription !
                </p>
            )}
            {status === 'error' && (
                <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                    Une erreur est survenue. Veuillez réessayer.
                </p>
            )}
        </form>
    );
}
