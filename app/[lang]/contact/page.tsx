import { ContactForm } from "@/components/contact-form";
import { Mail, Linkedin, Youtube, Instagram, Facebook } from "lucide-react";
import { getDictionary } from "@/lib/get-dictionary";
import { Metadata } from "next";

// Custom X Icon Component
const XIconLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
  </svg>
);

// ResearchGate Icon
const ResearchGateIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.586 0H4.414A4.414 4.414 0 0 0 0 4.414v15.172A4.414 4.414 0 0 0 4.414 24h15.172A4.414 4.414 0 0 0 24 19.586V4.414A4.414 4.414 0 0 0 19.586 0zm-4.172 17.016h-1.93v-3.57h-1.969v3.57H9.586V7.008h1.929v4.5h1.969v-4.5h1.93v10.008zm1.43-5.016a2.883 2.883 0 1 1 0-5.766 2.883 2.883 0 0 1 0 5.766zm0-4.383a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
  </svg>
);

// Medium Icon
const MediumIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
  </svg>
);

// TikTok Icon
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.19 8.19 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/>
  </svg>
);


export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "fr");

  return {
    title: dict.seo.contact.title,
    description: dict.seo.contact.description,
    alternates: {
      canonical: `/${lang}/contact`,
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as "en" | "fr");

  const socialLinks = [
    {
      href: "https://www.linkedin.com/in/monsieurdanko/",
      icon: Linkedin,
      label: "LinkedIn",
    },
    {
      href: "https://www.researchgate.net/profile/Farid-Danko",
      icon: ResearchGateIcon,
      label: "ResearchGate",
    },
    {
      href: "https://medium.com/@monsieurdanko",
      icon: MediumIcon,
      label: "Medium",
    },
    {
      href: "https://youtube.com/@fariddanko?si=cedaP3ZmzGQuri_Y",
      icon: Youtube,
      label: "YouTube",
    },
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
    { href: "https://www.tiktok.com/@monsieurdanko", icon: TikTokIcon, label: "TikTok" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-14 md:py-20">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-10 lg:gap-16 items-start">
          {/* Left side: Header & Info */}
          <div>
            <div className="mb-8 md:mb-10 lg:mb-14">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-5 lg:mb-7 uppercase tracking-tighter">
                {dict.contact.title}
              </h1>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed font-medium">
                {lang === "fr"
                  ? "Disponible pour mandats stratégiques, missions terrain et accompagnement organisationnel."
                  : "Available for strategic mandates, field missions and organisational support."}
              </p>
            </div>

            <div className="space-y-5 md:space-y-7 lg:space-y-10">
              <div className="p-4 sm:p-5 md:p-7 border border-border rounded-xl md:rounded-2xl bg-muted/20 hover:scale-[1.02] transition-transform">
                <h3 className="text-[10px] font-bold uppercase tracking-widest mb-2 sm:mb-3 md:mb-5 text-muted-foreground">
                  {lang === "fr" ? "Canal Officiel" : "Official Channel"}
                </h3>
                <div className="flex items-center gap-2 md:gap-4 text-sm sm:text-base md:text-xl font-bold tracking-tight">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 md:h-7 md:w-7 shrink-0" />
                  <span className="break-all">contact@monsieurdanko.com</span>
                </div>
              </div>

              <div className="p-5 md:p-7 border border-border rounded-xl md:rounded-2xl bg-muted/20">
                <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-widest mb-5 text-muted-foreground">
                  {lang === "fr" ? "Réseaux Sociaux" : "Social Media"}
                </h3>
                <div className="flex flex-nowrap gap-2 overflow-x-auto">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-background border border-border hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all hover:scale-110 shrink-0"
                        aria-label={social.label}
                      >
                        <Icon className="h-4 w-4" />
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="p-7 border border-border rounded-2xl bg-black dark:bg-white text-white dark:text-black">
                <h3 className="text-[10px] md:text-xs font-bold uppercase tracking-widest mb-3 opacity-70">
                  {lang === "fr" ? "Disponibilité" : "Availability"}
                </h3>
                <p className="text-base md:text-lg font-bold tracking-tight">
                  {lang === "fr"
                    ? "Je m'efforce de répondre à toutes les demandes dans un délai raisonnable."
                    : "I strive to respond to all inquiries within a reasonable timeframe."}
                </p>
              </div>
            </div>
          </div>

          {/* Right side: Contact Form */}
          <div className="lg:sticky lg:top-28 w-full">
            <div className="p-5 md:p-9 border border-border rounded-xl md:rounded-[2rem] bg-background shadow-xl md:shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-28 h-28 bg-muted/30 blur-3xl -z-10" />
              <div className="absolute bottom-0 left-0 w-28 h-28 bg-muted/30 blur-3xl -z-10" />

              <div className="mb-7 md:mb-9">
                <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tighter mb-2">
                  {lang === "fr" ? "Envoyer un message" : "Send a message"}
                </h2>
                <p className="text-xs md:text-sm text-muted-foreground font-medium">
                  {lang === "fr"
                    ? "Remplissez le formulaire ci-dessous."
                    : "Fill out the form below."}
                </p>
              </div>

              <ContactForm lang={lang} dict={dict} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
