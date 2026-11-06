/** URL publique : NEXT_PUBLIC_SITE_URL si renseignée, sinon le domaine officiel (Hostinger). */
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://opuscrp.com";
