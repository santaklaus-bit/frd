import { Metadata } from "next";
import { getDictionary } from "@/lib/get-dictionary";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    title:
      lang === "fr"
        ? "Politique de confidentialité – Farid DANKO"
        : "Privacy Policy – Farid DANKO",
    description:
      lang === "fr"
        ? "Consultez la politique de confidentialité du site monsieurdanko.com."
        : "Read the privacy policy of monsieurdanko.com.",
    robots: { index: false, follow: false },
  };
}

export default async function PrivacyPolicyPage({ params }: PageProps) {
  const { lang } = await params;
  const isFr = lang === "fr";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 md:py-24">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tighter uppercase mb-2">
          {isFr ? "Politique de confidentialité" : "Privacy Policy"}
        </h1>
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-10 md:mb-14">
          {isFr ? "Mise à jour : mars 2026" : "Last updated: March 2026"}
        </p>

        <div className="space-y-10 text-muted-foreground leading-relaxed text-sm md:text-base">

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-foreground mb-3">
              {isFr ? "1. Responsable du traitement" : "1. Data Controller"}
            </h2>
            <p>
              {isFr
                ? "Ce site est exploité par Farid Danko (contact via le formulaire en ligne). Aucune donnée n'est collectée sans votre accord explicite."
                : "This site is operated by Farid Danko (contact via the online form). No data is collected without your explicit consent."}
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-foreground mb-3">
              {isFr ? "2. Données collectées" : "2. Data Collected"}
            </h2>
            <p className="mb-2">
              {isFr
                ? "Nous collectons uniquement les données que vous nous transmettez volontairement :"
                : "We only collect data that you voluntarily provide to us:"}
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                {isFr
                  ? "Formulaire de contact : nom, adresse e-mail, type de demande, message."
                  : "Contact form: name, email address, request type, message."}
              </li>
              <li>
                {isFr
                  ? "Newsletter : adresse e-mail."
                  : "Newsletter: email address."}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-foreground mb-3">
              {isFr ? "3. Finalités" : "3. Purposes"}
            </h2>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>
                {isFr
                  ? "Répondre à vos messages et demandes de collaboration."
                  : "Responding to your messages and collaboration requests."}
              </li>
              <li>
                {isFr
                  ? "Vous envoyer la newsletter (uniquement si vous y avez souscrit)."
                  : "Sending the newsletter (only if you subscribed)."}
              </li>
              <li>
                {isFr
                  ? "Améliorer l'expérience utilisateur via des statistiques anonymisées (Google Analytics)."
                  : "Improving user experience through anonymised statistics (Google Analytics)."}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-foreground mb-3">
              {isFr ? "4. Cookies" : "4. Cookies"}
            </h2>
            <p>
              {isFr
                ? "Ce site utilise Google Analytics pour mesurer l'audience de façon anonyme. Ces cookies peuvent être désactivés dans les paramètres de votre navigateur."
                : "This site uses Google Analytics to measure audience anonymously. These cookies can be disabled in your browser settings."}
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-foreground mb-3">
              {isFr ? "5. Conservation des données" : "5. Data Retention"}
            </h2>
            <p>
              {isFr
                ? "Les données du formulaire de contact sont conservées 12 mois maximum. Les adresses e-mail de la newsletter sont conservées jusqu'à désinscription."
                : "Contact form data is retained for a maximum of 12 months. Newsletter email addresses are retained until unsubscription."}
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-foreground mb-3">
              {isFr ? "6. Vos droits" : "6. Your Rights"}
            </h2>
            <p>
              {isFr
                ? "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement et d'opposition. Pour exercer ces droits, utilisez le formulaire de contact du site."
                : "In accordance with GDPR, you have the right of access, rectification, erasure and objection. To exercise these rights, use the site's contact form."}
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold uppercase tracking-widest text-foreground mb-3">
              {isFr ? "7. Hébergement" : "7. Hosting"}
            </h2>
            <p>
              {isFr
                ? "Ce site est hébergé sur des serveurs sécurisés. Aucune donnée personnelle n'est vendue ni partagée avec des tiers à des fins commerciales."
                : "This site is hosted on secure servers. No personal data is sold or shared with third parties for commercial purposes."}
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
