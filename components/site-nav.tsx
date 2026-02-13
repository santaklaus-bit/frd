"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import {
  Menu,
  X as XIcon,
  Linkedin,
  Youtube,
  Instagram,
  Facebook,
} from "lucide-react";
import { useState } from "react";

// Custom TikTok Icon Component
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

// Custom Medium Icon Component
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

export function SiteNav({ lang }: { lang: "en" | "fr" }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const socialLinks = [
    {
      href: "https://www.linkedin.com/in/fariddanko/",
      icon: Linkedin,
      label: "LinkedIn",
    },
    {
      href: "https://youtube.com/@fariddanko?si=cedaP3ZmzGQuri_Y",
      icon: Youtube,
      label: "YouTube",
    },
    { href: "https://tiktok.com", icon: TikTokIcon, label: "TikTok" },
    {
      href: "https://www.instagram.com/fariddanko",
      icon: Instagram,
      label: "Instagram",
    },
    {
      href: "https://www.facebook.com/farid.danko",
      icon: Facebook,
      label: "Facebook",
    },
    { href: "https://x.com/monsieurdanko", icon: XIconLogo, label: "X" },
    { href: "https://medium.com", icon: MediumIcon, label: "Medium" },
  ];

  const leftNavItems = [
    { href: `/${lang}`, label: lang === "en" ? "Home" : "Accueil" },
    { href: `/${lang}/about`, label: lang === "en" ? "About" : "À propos" },
    { href: `/${lang}/production`, label: "PRODUCTION" },
  ];

  const rightNavItems = [
    { href: `/${lang}/blog`, label: "BLOG" },
    { href: `/${lang}/initiatives`, label: "INITIATIVES" },
  ];

  return (
    <header className="sticky top-0 z-20 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto w-full px-6">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex h-16 items-center justify-between gap-6">
          {/* Left Section: Social Icons + Navigation */}
          <div className="flex items-center gap-6">
            {/* Social Media Icons */}
            <div className="flex items-center gap-2 pr-4 border-r border-border/40">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>

            {/* Left Navigation Items */}
            <nav className="flex items-center gap-5">
              {leftNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Center - Farid Danko */}
          <Link
            href={`/${lang}`}
            className="font-bold text-xl tracking-tighter hover:opacity-80 transition-opacity absolute left-1/2 transform -translate-x-1/2 whitespace-nowrap"
          >
            FARID DANKO
          </Link>

          {/* Right Section: Blog, Initiatives, Contact, Language Toggle */}
          <div className="flex items-center gap-5">
            {/* Right Navigation Items */}
            <nav className="flex items-center gap-5">
              {rightNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors uppercase"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Contact Button */}
            <Link
              href={`/${lang}/contact`}
              className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-full hover:opacity-90 transition-opacity uppercase"
            >
              Contact
            </Link>

            {/* Language Toggle */}
            <LanguageToggle lang={lang} />

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex h-14 items-center justify-between">
          <Link
            href={`/${lang}`}
            className="font-bold text-lg tracking-tighter hover:opacity-80 transition-opacity"
          >
            FARID DANKO
          </Link>

          <div className="flex items-center gap-2">
            <LanguageToggle lang={lang} />
            <ThemeToggle />

            <button
              className="p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <XIcon className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border">
          <nav className="flex flex-col p-4 gap-3">
            {/* Social Media Icons */}
            <div className="flex items-center gap-4 pb-3 border-b border-border/40">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>

            {/* Navigation Links */}
            {[...leftNavItems, ...rightNavItems].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors py-2 uppercase"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            {/* Contact Button */}
            <Link
              href={`/${lang}/contact`}
              className="mt-2 px-6 py-2 bg-black dark:bg-white text-white dark:text-black text-xs font-bold rounded-full hover:opacity-90 transition-opacity text-center uppercase"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
