'use client';

import { NewsletterForm } from '@/components/newsletter-form';
import Link from 'next/link';
import { Linkedin, Twitter, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Newsletter Section */}
        <div className="mb-8 pb-8 border-b border-border">
          <h3 className="text-lg font-semibold mb-2">Inscrivez-vous à ma newsletter</h3>
          <NewsletterForm />
        </div>

        {/* Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Farid Danko. Tous droits réservés.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Contact"
            >
              <Mail className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
