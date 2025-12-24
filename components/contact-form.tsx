'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function ContactForm() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        requestType: 'general',
        message: '',
    });

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        // TODO: Integrate with email service or backend API
        setTimeout(() => {
            console.log('Contact form submission:', formData);
            setStatus('success');
            setFormData({
                fullName: '',
                email: '',
                requestType: 'general',
                message: '',
            });
            setTimeout(() => setStatus('idle'), 5000);
        }, 1000);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
                <label htmlFor="fullName" className="block text-sm font-medium mb-2">
                    Nom complet <span className="text-muted-foreground">(obligatoire)</span>
                </label>
                <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Votre nom complet"
                    required
                    className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
            </div>

            {/* Email */}
            <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Adresse e-mail <span className="text-muted-foreground">(obligatoire)</span>
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    required
                    className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
            </div>

            {/* Request Type */}
            <div>
                <label htmlFor="requestType" className="block text-sm font-medium mb-2">
                    Type de demande
                </label>
                <select
                    id="requestType"
                    name="requestType"
                    value={formData.requestType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                    <option value="general">Message général</option>
                    <option value="collaboration">Collaboration / événement</option>
                    <option value="media">Média / entrevue</option>
                </select>
            </div>

            {/* Message */}
            <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Votre message..."
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-md border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                size="lg"
                disabled={status === 'loading'}
                className="w-full"
            >
                {status === 'loading' ? 'Envoi en cours...' : 'Envoyer'}
            </Button>

            {/* Status Messages */}
            {status === 'success' && (
                <div className="p-4 rounded-md bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-800 dark:text-green-200">
                        Message envoyé avec succès !
                    </p>
                </div>
            )}

            {status === 'error' && (
                <div className="p-4 rounded-md bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-800 dark:text-red-200">
                        Une erreur est survenue. Veuillez réessayer.
                    </p>
                </div>
            )}
        </form>
    );
}
