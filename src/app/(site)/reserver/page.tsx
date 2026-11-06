import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { HelpForm } from "@/components/sections/HelpForm";
import { BookFaq } from "@/components/sections/BookFaq";
import { Reveal } from "@/components/ui/Reveal";
import { TO_CONFIRM } from "@/data/site";
import { publicContent } from "@/lib/cms/content";

export const metadata: Metadata = { title: "Contactez-nous — OPUS CORP" };

const contactCls =
  "mt-2 block font-hanken text-[20px] font-semibold tracking-[-0.04em] text-white hover:text-brand";

export default async function BookPage() {
  const { site } = await publicContent();
  return (
    <>
      <PageHero
        title="Contactez-nous"
        subtitle="Renseignez vos coordonnées et le type de projet envisagé. L'équipe OPUS CORP vous recontactera pour échanger sur vos besoins."
      />
      <HelpForm compact />
      <section className="wrap py-24">
        <Reveal>
          <h2 className="h-section two-tone">
            <span>Nous</span> contacter
          </h2>
        </Reveal>
        <Reveal
          delay={0.2}
          className="mt-12 grid grid-cols-1 gap-8 border-t border-line pt-10 md:grid-cols-3"
        >
          <div>
            <p className="t-mono text-muted">E-mail</p>
            {site.email ? (
              <a href={`mailto:${site.email}`} className={contactCls}>
                {site.email}
              </a>
            ) : (
              <p className={`${contactCls} text-muted`}>{TO_CONFIRM}</p>
            )}
          </div>
          <div>
            <p className="t-mono text-muted">Téléphone / WhatsApp</p>
            {site.phone ? (
              <a
                href={site.whatsapp || site.phoneHref || undefined}
                className={contactCls}
              >
                {site.phone}
              </a>
            ) : (
              <p className={`${contactCls} text-muted`}>{TO_CONFIRM}</p>
            )}
          </div>
          <div>
            <p className="t-mono text-muted">Adresse</p>
            <p
              className={site.address ? contactCls : `${contactCls} text-muted`}
            >
              {site.address
                ? `${site.address.line1}, ${site.address.line2}`
                : `${site.city} — ${TO_CONFIRM.toLowerCase()}`}
            </p>
          </div>
        </Reveal>
      </section>
      <BookFaq />
    </>
  );
}
