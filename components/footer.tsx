"use client";

import { Newsletter } from "@/components/newsletter";
import Link from "next/link";
import { Youtube, Instagram } from "lucide-react";

// Custom TikTok Icon Component (same as in SiteNav)
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

// Custom Medium Icon Component (same as in SiteNav)
const MediumIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z" />
  </svg>
);

// Custom X Icon Component
const XIconLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

export default function Footer({ lang, dict }: { lang: string; dict: any }) {
  const socialLinks = [
    {
      href: "https://www.instagram.com/monsieurdanko",
      icon: Instagram,
      label: "Instagram",
    },
    { href: "https://x.com/monsieurdanko", icon: XIconLogo, label: "X" },
    {
      href: "https://youtube.com/@monsieurdanko?si=ZYnmBFf318qSpnWq",
      icon: Youtube,
      label: "YouTube",
    },
    {
      href: "https://www.tiktok.com/@monsieurdanko",
      icon: TikTokIcon,
      label: "TikTok",
    },
  ];

  return (
    <footer className="bg-background border-t border-border/40 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-16">
          {/* Logo & Info */}
          <div className="space-y-4 md:space-y-6 max-w-sm">
            <Link
              href={`/${lang}`}
              className="hover:opacity-80 transition-opacity"
            >
              <img
                src="/logo.png"
                alt="Farid Danko"
                className="h-10 w-auto invert dark:invert-0"
              />
            </Link>
            <p className="text-muted-foreground leading-relaxed font-medium">
              {lang === "fr"
                ? "Entrepreneur social passionné par l'impact collectif et le développement durable."
                : "Social entrepreneur passionate about collective impact and sustainable development."}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 md:gap-16 w-full lg:w-auto">
            <div className="space-y-4 md:space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                Navigation
              </h4>
              <nav className="flex flex-col gap-4">
                <Link
                  href={`/${lang}`}
                  className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors"
                >
                  {dict.nav.home}
                </Link>
                <Link
                  href={`/${lang}/about`}
                  className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors"
                >
                  {dict.nav.about}
                </Link>
                <Link
                  href={`/${lang}/expertise`}
                  className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors"
                >
                  {dict.nav.expertise}
                </Link>
              </nav>
            </div>
            <div className="space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {lang === "fr" ? "Ressources" : "Resources"}
              </h4>
              <nav className="flex flex-col gap-4">
                <Link
                  href={`/${lang}/blog`}
                  className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors"
                >
                  {dict.nav.blog}
                </Link>
                <Link
                  href={`/${lang}/projects`}
                  className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors"
                >
                  {dict.nav.projects}
                </Link>
                <Link
                  href={`/${lang}/contact`}
                  className="text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors"
                >
                  {dict.nav.contact}
                </Link>
              </nav>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-4 md:space-y-6 w-full lg:w-auto">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Social
            </h4>
            <div className="flex flex-wrap gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-muted/50 border border-border/40 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all hover:scale-110"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-16 md:mt-24 pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-muted-foreground">
            &copy; {new Date().getFullYear()} Farid DANKO.{" "}
            {lang === "fr" ? "Tous droits réservés." : "All rights reserved."}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
            <Link
              href="#"
              className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
