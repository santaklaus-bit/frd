import { z } from "zod";

const text = z.string().trim().max(20000);
const required = text.min(1, "Ce champ est obligatoire.");
export const localMedia = z
  .string()
  .max(500)
  .refine(
    (value) =>
      value === "" ||
      (/^\/(?:images|videos|media)\/[a-zA-Z0-9_./% -]+$/.test(value) &&
        !value.includes("..")),
    "Sélectionnez un fichier de la médiathèque.",
  );
const slug = z
  .string()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    "Utilisez des lettres minuscules, chiffres et tirets.",
  )
  .max(150);
const date = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(
    (v) =>
      !Number.isNaN(Date.parse(v)) &&
      new Date(v).toISOString().slice(0, 10) === v,
    "Date invalide.",
  );
const paragraphs = z.array(required).max(100);
const imagePath = localMedia.refine(
  (value) => value === "" || /\.(jpe?g|png|webp|gif)$/i.test(value),
  "Choisissez une image.",
);
const requiredImage = imagePath.refine(Boolean, "Choisissez une image.");
const videoPath = localMedia.refine(
  (value) => value === "" || /\.(mp4|webm)$/i.test(value),
  "Choisissez une vidéo MP4 ou WebM.",
);
export const articleBlockSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("paragraph"), text: required }),
  z.object({ type: z.literal("heading"), text: required }),
  z.object({ type: z.literal("quote"), text: required }),
  z.object({ type: z.literal("list"), text: required }),
  z.object({
    type: z.literal("image"),
    url: requiredImage,
    alt: required.max(500),
    caption: text,
  }),
]);
const base = {
  id: z.string().uuid(),
  slug,
  status: z.enum(["draft", "published", "archived"]).default("draft"),
  updatedAt: z.string(),
  revision: z.number().int().nonnegative().default(0),
  seoTitle: text.default(""),
  seoDescription: text.default(""),
};

export const articleSchema = z.object({
  ...base,
  title: required.max(300),
  category: required.max(120),
  date,
  dateLabel: text.default(""),
  image: imagePath,
  alt: text.max(500),
  excerpt: text.max(1000),
  intro: text,
  body: paragraphs,
  author: text.max(150).default("OPUS CORP"),
  blocks: z.array(articleBlockSchema).max(100).default([]),
});
export const eventSchema = z.object({
  ...base,
  title: required.max(300),
  category: required.max(120),
  date,
  dateLabel: text,
  image: imagePath,
  alt: text.max(500),
  gallery: z.array(requiredImage).max(100).default([]),
  city: text.max(150),
  country: text.max(150),
  venue: text.max(300),
  excerpt: text.max(1000),
  about: paragraphs,
  role: text,
  audience: text,
  hours: text,
  lineupLabel: text.default("Intervention OPUS"),
  lineup: paragraphs,
  featured: z.boolean().default(false),
});
export const memberSchema = z.object({
  ...base,
  name: required.max(150),
  role: text.max(300),
  department: text.max(300),
  pole: z.enum(["design", "branding", "event"]),
  image: imagePath.default(""),
  excerpt: text.max(1000),
  quote: text,
  bio: paragraphs,
  missions: paragraphs,
  expertise: paragraphs,
  projectSlugs: z.array(slug).max(100),
});
export const settingsSchema = z.object({
  name: required.max(100),
  shortName: required.max(50),
  tagline: text.max(300),
  motto: text.max(300),
  since: z.number().int().min(1900).max(2200),
  legal: z.object({
    form: text.max(100),
    capital: text.max(100),
    rccm: text.max(100),
    ifu: text.max(100),
  }),
  departments: z.array(required.max(200)).max(20),
  description: text,
  seoDescription: text.max(1000),
  mission: text,
  promise: text,
  city: text.max(200),
  address: z.object({ line1: text.max(300), line2: text.max(300) }).nullable(),
  phone: text.max(100).nullable(),
  phoneHref: z
    .string()
    .regex(/^(?:tel:\+?[\d ()-]+)?$/, "Lien téléphone invalide.")
    .nullable(),
  email: z.union([z.literal(""), z.string().email()]).nullable(),
  whatsapp: z
    .union([
      z.literal(""),
      z
        .string()
        .url()
        .refine((v) => v.startsWith("https://"), "Lien HTTPS attendu."),
    ])
    .nullable(),
  socials: z
    .array(
      z.object({
        label: required.max(100),
        href: z
          .string()
          .url()
          .refine((v) => v.startsWith("https://"), "Lien HTTPS attendu."),
      }),
    )
    .max(15),
  stats: z.object({
    since: text,
    departments: text,
    services: text,
    projectTypes: text,
  }),
  nav: z
    .array(
      z.object({
        label: required.max(100),
        href: z.string().regex(/^\/(?!\/)[a-zA-Z0-9/-]*$/),
      }),
    )
    .max(15),
  cta: z.object({
    label: required.max(100),
    href: z.string().regex(/^\/(?!\/)[a-zA-Z0-9/-]*$/),
  }),
});
export const pagesSchema = z.object({
  heroVideo: videoPath,
  heroPoster: imagePath,
  helpVideo: videoPath,
  helpPoster: imagePath,
  aboutImage: requiredImage,
  aboutImageAlt: required,
  cultureImage: requiredImage,
  cultureImageAlt: required,
  aboutSubtitle: text,
  cultureTitle: text,
  cultureText: text,
});
export const serviceSchema = z.object({
  id: slug,
  num: required.max(10),
  name: required.max(200),
  desc: text,
  items: paragraphs,
  cta: required.max(100),
  dark: z.boolean(),
  pole: z.enum(["design", "branding", "event"]),
});
export const faqSchema = z.object({ q: required.max(1000), a: required });
export const collectionSchemas = {
  articles: articleSchema,
  events: eventSchema,
  team: memberSchema,
};
export type Collection = keyof typeof collectionSchemas;
export type CmsArticle = z.infer<typeof articleSchema>;
export type CmsEvent = z.infer<typeof eventSchema>;
export type CmsMember = z.infer<typeof memberSchema>;
export type CmsEntry = CmsArticle | CmsEvent | CmsMember;
export type CmsSettings = z.infer<typeof settingsSchema>;
export type CmsPages = z.infer<typeof pagesSchema>;
export type PublicContent = {
  articles: CmsArticle[];
  events: CmsEvent[];
  team: CmsMember[];
  site: CmsSettings;
  pages: CmsPages;
  services: z.infer<typeof serviceSchema>[];
  faq: z.infer<typeof faqSchema>[];
};

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 150)
    .replace(/-$/, "");
}

export function publicationIssues(
  collection: Collection,
  entry: CmsEntry,
): string[] {
  if (entry.status !== "published") return [];
  const issues: string[] = [];
  if (!entry.image) issues.push("Une image est obligatoire pour publier.");
  if (collection !== "team" && !(entry as CmsArticle | CmsEvent).alt)
    issues.push("Décrivez l’image pour publier.");
  if (!entry.excerpt)
    issues.push("Ajoutez une présentation courte pour publier.");
  if (
    collection === "articles" &&
    !(entry as CmsArticle).body.length &&
    !(entry as CmsArticle).blocks.length
  )
    issues.push("Ajoutez le contenu de l’article pour publier.");
  return issues;
}
