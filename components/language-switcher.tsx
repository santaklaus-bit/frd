'use client';

import { useLanguage } from '@/lib/language-context';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LanguageSwitcher() {
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'fr' ? 'en' : 'fr');
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="gap-2"
            aria-label="Switch language"
        >
            <Globe className="h-4 w-4" />
            <span className="text-sm font-medium">{language.toUpperCase()}</span>
        </Button>
    );
}
