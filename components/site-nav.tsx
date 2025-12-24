'use client';

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function SiteNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const leftNavItems = [
    { href: "/about", label: "À propos" },
    { href: "/production", label: "Production" },
  ];

  const rightNavItems = [
    { href: "/initiatives", label: "Initiatives" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-20 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto w-full px-6">
        {/* Desktop Navigation */}
        <div className="hidden md:flex h-14 items-center justify-center gap-8">
          {/* Left Navigation Items */}
          <nav className="flex items-center gap-6">
            {leftNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Center - Farid Danko */}
          <Link
            href="/"
            className="font-semibold text-lg tracking-tight hover:opacity-80 transition-opacity px-6"
          >
            Farid Danko
          </Link>

          {/* Right Navigation Items */}
          <nav className="flex items-center gap-6">
            {rightNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Theme Toggle */}
          <div className="ml-2">
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex h-14 items-center justify-between">
          <Link
            href="/"
            className="font-semibold text-lg tracking-tight hover:opacity-80 transition-opacity"
          >
            Farid Danko
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border">
          <nav className="flex flex-col p-4 gap-2">
            {[...leftNavItems, ...rightNavItems].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
