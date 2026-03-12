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
      href: "https://www.linkedin.com/in/fariddanko/",
      icon: Linkedin,
      label: "LinkedIn",
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
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-20 items-start">
          {/* Left side: Header & Info */}
          <div>
            <div className="mb-12 md:mb-16">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 md:mb-8 uppercase tracking-tighter">
                {dict.contact.title}
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed font-medium">
                {lang === "fr"
                  ? "Pour ma page Contact, je souhaiterais faire un mix de l’esprit des deux pages de Barack Obama."
                  : "For my Contact page, I would like to have a mix of the spirit of Barack Obama's pages."}
              </p>
            </div>

            <div className="space-y-8 md:space-y-12">
              <div className="p-6 md:p-8 border border-border rounded-2xl md:rounded-3xl bg-muted/20 hover:scale-[1.02] transition-transform">
                <h3 className="text-xs md:text-sm font-bold uppercase tracking-widest mb-4 md:mb-6 text-muted-foreground">
                  {lang === "fr" ? "Canal Officiel" : "Official Channel"}
                </h3>
                <div className="flex items-center gap-3 md:gap-4 text-xl md:text-2xl font-bold tracking-tight">
                  <Mail className="h-6 w-6 md:h-8 md:w-8" />
                  <span className="break-all">contact@fariddanko.com</span>
                </div>
              </div>

              <div className="p-6 md:p-8 border border-border rounded-2xl md:rounded-3xl bg-muted/20">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-6 text-muted-foreground">
                  {lang === "fr" ? "Réseaux Sociaux" : "Social Media"}
                </h3>
                <div className="flex flex-wrap gap-6">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-4 rounded-2xl bg-background border border-border hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all hover:scale-110"
                        aria-label={social.label}
                      >
                        <Icon className="h-6 w-6" />
                      </a>
                    );
                  })}
                </div>
              </div>

              <div className="p-8 border border-border rounded-3xl bg-black dark:bg-white text-white dark:text-black">
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4 opacity-70">
                  {lang === "fr" ? "Disponibilité" : "Availability"}
                </h3>
                <p className="text-xl font-bold tracking-tight">
                  {lang === "fr"
                    ? "Je m'efforce de répondre à toutes les demandes dans un délai raisonnable."
                    : "I strive to respond to all inquiries within a reasonable timeframe."}
                </p>
              </div>
            </div>
          </div>

          {/* Right side: Contact Form */}
          <div className="lg:sticky lg:top-32 w-full">
            <div className="p-6 md:p-10 border border-border rounded-2xl md:rounded-[2.5rem] bg-background shadow-xl md:shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-muted/30 blur-3xl -z-10" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-muted/30 blur-3xl -z-10" />

              <div className="mb-8 md:mb-10">
                <h2 className="text-2xl md:text-3xl font-bold uppercase tracking-tighter mb-2">
                  {lang === "fr" ? "Envoyer un message" : "Send a message"}
                </h2>
                <p className="text-sm md:text-base text-muted-foreground font-medium">
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
