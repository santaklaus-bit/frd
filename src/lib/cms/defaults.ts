import { articles } from "../../data/articles";
import { events } from "../../data/events";
import { team } from "../../data/team";
import { site } from "../../data/site";
import { services } from "../../data/services";
import { faq } from "../../data/faq";
import {
  articleSchema,
  eventSchema,
  memberSchema,
  settingsSchema,
  pagesSchema,
  type PublicContent,
} from "./schema";

export function initialContent(): PublicContent {
  const base = () => ({
    id: crypto.randomUUID(),
    status: "published" as const,
    revision: 1,
    updatedAt: new Date().toISOString(),
  });
  return {
    articles: articles.map((entry) =>
      articleSchema.parse({ ...entry, ...base() }),
    ),
    events: events.map((entry) => eventSchema.parse({ ...entry, ...base() })),
    team: team.map((entry) => memberSchema.parse({ ...entry, ...base() })),
    site: settingsSchema.parse(site),
    services,
    faq,
    pages: pagesSchema.parse({
      heroVideo: "/videos/hero.mp4",
      heroPoster: "/videos/hero-poster.jpg",
      helpVideo: "/videos/help-bg.mp4",
      helpPoster: "/videos/help-bg-poster.jpg",
      aboutImage: "/images/events/opus_evt_03_couverture_v01.jpg",
      aboutImageAlt: "Public devant une scène éclairée (visuel provisoire)",
      cultureImage: "/images/events/opus_evt_04_couverture_v01.jpg",
      cultureImageAlt:
        "Foule devant une scène de plein air (visuel provisoire)",
      aboutSubtitle:
        "Depuis janvier 2026, OPUS CORP développe une approche de la communication BTL centrée sur l'expérience événementielle. Nous donnons une forme concrète à la rencontre entre les marques et leurs publics.",
      cultureTitle: "Concevoir des expériences qui rapprochent.",
      cultureText:
        "Une expérience pensée pour votre public, préparée avec méthode et suivie jusqu'à sa livraison.",
    }),
  };
}
