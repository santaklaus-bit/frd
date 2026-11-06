import { publicContent } from "@/lib/cms/content";
import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { TO_CONFIRM } from "@/data/site";

export const metadata: Metadata = { title: "Mentions légales — OPUS CORP" };

/**
 * Mentions légales — classeur LEG.HER / LEG.COR.
 * Forme (SARL) et capital (1 000 000 FCFA) : repris du dossier de structuration, à contrôler avant publication.
 * Adresse, contact, RCCM/IFU : Google Sheet OPUS (LEG.COR.05–07, 25 sept. 2026).
 * Responsable de la publication = représentant légal (Président Directeur Général, EQU.01) par défaut — à confirmer.
 * Hébergeur = Hostinger (domaine, e-mail et hébergement web) ; texte données personnelles proposé, sans newsletter (section retirée).
 * Page à faire valider juridiquement avant mise en ligne.
 */
export default async function LegalPage() {
  const { site } = await publicContent();
  const contact =
    [site.email, site.phone].filter(Boolean).join(" · ") || TO_CONFIRM;
  return (
    <>
      <PageHero
        title="Mentions"
        subtitle="Mentions légales et informations sur l'utilisation du site."
      />
      <section className="wrap pb-32">
        <div className="t-body mx-auto flex max-w-[760px] flex-col gap-6 text-slate">
          <h2 className="h-card text-white">Éditeur</h2>
          <p>
            {site.name}, {site.legal.form} au capital de {site.legal.capital} —{" "}
            {site.city}.
          </p>
          <p>
            Adresse du siège :{" "}
            {site.address
              ? `${site.address.line1}, ${site.address.line2}`
              : TO_CONFIRM}
            .
          </p>
          <p>Contact : {contact}.</p>
          <p>
            RCCM : {site.legal.rccm} — IFU : {site.legal.ifu}.
          </p>
          <p>
            Responsable de la publication : Olufèmi Bankole, Président Directeur
            Général.
          </p>

          <h2 className="h-card text-white">Hébergement</h2>
          <p>
            Hostinger International Ltd., 61 Lordou Vironos Street, 6023
            Larnaca, Chypre — hostinger.com.
          </p>

          <h2 className="h-card text-white">Données personnelles</h2>
          <p>
            Les informations saisies dans le formulaire de contact (nom, e-mail,
            téléphone, type de projet) sont enregistrées dans l’espace de
            gestion de {site.name} et servent uniquement à répondre à votre
            demande. Elles ne sont ni revendues ni utilisées à d’autres fins, et
            sont conservées le temps nécessaire au suivi de votre projet. Pour y
            accéder, les rectifier ou les faire supprimer, écrivez-nous
            {site.email ? ` à ${site.email}` : ""}.
          </p>
        </div>
      </section>
    </>
  );
}
