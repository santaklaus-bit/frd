import { Metadata } from "next";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    title:
      lang === "fr"
        ? "Conditions générales d'utilisation – Farid DANKO"
        : "Terms of Service – Farid DANKO",
    description:
      lang === "fr"
        ? "Consultez les conditions générales d'utilisation du site monsieurdanko.com."
        : "Read the terms of service of monsieurdanko.com.",
    robots: { index: false, follow: false },
  };
}

export default async function TermsOfServicePage({ params }: PageProps) {
  const { lang } = await params;
  const isFr = lang === "fr";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <h1 className="text-3xl sm:text-4xl font-serif font-semibold tracking-tighter uppercase mb-2">
          {isFr ? "Conditions générales d'utilisation" : "Terms of Service"}
        </h1>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-10 md:mb-14">
          {isFr ? "Mise à jour : mars 2026" : "Last updated: March 2026"}
        </p>

        <div className="space-y-10 text-muted-foreground leading-relaxed text-sm md:text-base">
          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-foreground mb-3">
              {isFr ? "1. Acceptation des conditions" : "1. Acceptance of Terms"}
            </h2>
            <p>
              {isFr
                ? "L'accès et l'utilisation du site monsieurdanko.com sont soumis à l'acceptation sans réserve des présentes conditions générales d'utilisation."
                : "Access to and use of monsieurdanko.com are subject to the unconditional acceptance of these terms of service."}
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-foreground mb-3">
              {isFr ? "2. Propriété intellectuelle" : "2. Intellectual Property"}
            </h2>
            <p>
              {isFr
                ? "Tous les contenus présents sur ce site (textes, logos, images, icônes, design) sont la propriété exclusive de Farid Danko, sauf mention contraire. Toute reproduction ou représentation, même partielle, sans autorisation préalable est interdite."
                : "All content on this site (text, logos, images, icons, design) is the exclusive property of Farid Danko unless otherwise stated. Any reproduction or representation, even partial, without prior authorisation is prohibited."}
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-foreground mb-3">
              {isFr ? "3. Responsabilité" : "3. Liability"}
            </h2>
            <p>
              {isFr
                ? "L'éditeur s'efforce de fournir des informations précises, mais ne saurait être tenu responsable des erreurs ou omissions, ou des résultats obtenus par l'usage de ces informations."
                : "The publisher strives to provide accurate information but cannot be held responsible for errors or omissions, or for the results obtained from the use of this information."}
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-foreground mb-3">
              {isFr ? "4. Liens hypertextes" : "4. Hypertext Links"}
            </h2>
            <p>
              {isFr
                ? "Le site peut contenir des liens vers des sites tiers. L'éditeur n'exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu."
                : "The site may contain links to third-party sites. The publisher has no control over these sites and accepts no responsibility for their content."}
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-foreground mb-3">
              {isFr ? "5. Modification des conditions" : "5. Changes to Terms"}
            </h2>
            <p>
              {isFr
                ? "L'éditeur se réserve le droit de modifier les présentes conditions à tout moment. Les utilisateurs sont invités à les consulter régulièrement."
                : "The publisher reserves the right to modify these terms at any time. Users are encouraged to check them regularly."}
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-foreground mb-3">
              {isFr ? "6. Droit applicable" : "6. Governing Law"}
            </h2>
            <p>
              {isFr
                ? "Ces conditions sont régies par les lois en vigueur. Tout litige relatif à l'utilisation du site sera soumis à la juridiction compétente."
                : "These terms are governed by the laws in force. Any dispute relating to the use of the site will be submitted to the competent jurisdiction."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
