"use client";
import { useContent } from "@/components/cms/ContentProvider";
import Link from "next/link";
import { TO_CONFIRM } from "@/data/site";
import { Counter } from "@/components/ui/Counter";

import { Reveal } from "@/components/ui/Reveal";
import { FooterWordmark } from "./FooterWordmark";

// Colonne « Pages internes » du template (liens Détail événement / Détail article) remplacée par les coordonnées OPUS (GLO.CON).

/** Pied de page (GLO.PIE) : accroche + colonnes de liens, grille 3 colonnes bordurée, copyright, planche de marque (charte). Compteur = nombre de projets EVT fournis (GLO.PIE.14). */
export function Footer() {
  const { site, events } = useContent();
  const mainPages = site.nav;
  const contact = [
    ...(site.email
      ? [{ label: site.email, href: `mailto:${site.email}` }]
      : []),
    ...(site.phone
      ? [{ label: site.phone, href: site.phoneHref || `tel:${site.phone}` }]
      : []),
    ...(site.whatsapp ? [{ label: "WhatsApp", href: site.whatsapp }] : []),
    { label: site.cta.label, href: site.cta.href },
  ];
  return (
    <footer className="relative overflow-hidden border-t border-line bg-navy text-white">
      <div className="wrap pt-16 md:pt-24">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <Reveal>
            <p className="t-eyebrow mb-5 text-brand">{site.motto}</p>
            <h2 className="h-section-sm max-w-[720px] text-white">
              Donnez vie à votre prochaine expérience de marque.
            </h2>
          </Reveal>
          <Reveal delay={0.3} className="grid grid-cols-2 gap-10 md:gap-16">
            <FooterCol title="Pages" links={mainPages} />
            <FooterCol title="Contact" links={contact} />
          </Reveal>
        </div>

        <Reveal
          delay={0.2}
          className="mt-14 grid grid-cols-1 border-t border-white/25 md:mt-20 md:grid-cols-3"
        >
          <FooterCell
            head={site.email ?? `E-mail : ${TO_CONFIRM.toLowerCase()}`}
            headHref={site.email ? `mailto:${site.email}` : "/reserver"}
            text="Nous concevons et réalisons des expériences de marque, de l'idée au déploiement."
            className="md:border-r"
          />
          <FooterCell
            head={site.cta.label}
            headHref={site.cta.href}
            highlight
            text="Concept, scénographie, communication et coordination : chaque intervention est définie selon votre projet."
            className="md:border-r"
          />
          <div className="flex flex-col border-b border-white/25 md:border-b-0">
            <Link
              href="/evenements"
              className="block border-b border-white/25 py-3 text-center font-mono text-[15px] font-semibold tracking-[-0.04em] transition-colors hover:bg-white/10"
            >
              Découvrir les événements
            </Link>
            <div className="flex min-h-[220px] items-end justify-between gap-6 px-1 pb-6 pt-24">
              <Counter
                to={events.length}
                duration={2.4}
                className="text-opus-gradient font-display text-[80px] font-semibold leading-[0.9]"
              />
              <p className="t-mono-sm max-w-[170px] text-right text-white/80">
                projets conçus et réalisés en 2026.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col gap-3 border-t border-white/25 py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <span aria-hidden className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-navy ring-1 ring-white/30" />
              <span className="size-2.5 rounded-full bg-design" />
              <span className="size-2.5 rounded-full bg-branding" />
              <span className="size-2.5 rounded-full bg-event" />
            </span>
            <p className="t-mono-sm text-white/80">
              ©{new Date().getFullYear()} {site.name} —{" "}
              {site.address
                ? `${site.address.line1}, ${site.address.line2}`
                : site.city}
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            {site.socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                className="t-mono-sm text-white/80 transition-colors hover:text-brand"
              >
                {s.label}
              </a>
            ))}
            <Link
              href="/mentions-legales"
              className="t-mono-sm text-white/80 transition-colors hover:text-brand"
            >
              Mentions légales
            </Link>
          </div>
        </div>
      </div>

      {/* Planche de marque (charte « Colors ») */}
      <FooterWordmark />
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <p className="t-eyebrow mb-5 text-white">{title}</p>
      <ul className="flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.label}>
            {l.href.startsWith("/") ? (
              <Link
                href={l.href}
                className="t-mono-sm text-white/80 transition-colors hover:text-brand"
              >
                {l.label}
              </Link>
            ) : (
              <a
                href={l.href}
                {...(l.href.startsWith("http")
                  ? { target: "_blank", rel: "noreferrer" }
                  : {})}
                className="t-mono-sm text-white/80 transition-colors hover:text-brand"
              >
                {l.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterCell({
  head,
  headHref,
  text,
  highlight,
  className,
}: {
  head: string;
  headHref: string;
  text: string;
  highlight?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col border-b border-white/25 md:border-b-0 ${className ?? ""}`}
    >
      <Link
        href={headHref}
        className={`block border-b border-white/25 py-3 text-center font-mono text-[15px] font-semibold tracking-[-0.04em] transition-colors ${highlight ? "bg-brand text-black hover:bg-lime" : "hover:bg-white/10"}`}
      >
        {head}
      </Link>
      <p className="t-mono-sm mt-auto max-w-[400px] px-1 pb-6 pt-24 text-white/80">
        {text}
      </p>
    </div>
  );
}
