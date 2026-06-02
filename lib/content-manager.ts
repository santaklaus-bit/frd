import { BlogPost, Dictionary, Initiative, Production } from "./db/models";

// ============================================================================
// BLOG POSTS
// ============================================================================

// ~200 words per minute reading speed
function calcReadTime(content: string, lang: "en" | "fr" = "fr"): string {
  const text = content?.replace(/<[^>]*>?/gm, "") || "";
  const words = text.trim().split(/\s+/).length ?? 0;
  if (!text.trim()) return "1 min";
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min`;
}

export async function getBlogPosts() {
  const posts = await BlogPost.findAll({
    order: [["date", "DESC"]],
  });
  return posts.map((p) => {
    const data = p.toJSON() as any;
    return {
      slug: data.slug,
      title: { fr: data.titleFr, en: data.titleEn },
      description: { fr: data.descriptionFr, en: data.descriptionEn },
      date: data.date,
      thumbnail: data.thumbnail,
      authorName: data.authorName,
      authorPhoto: data.authorPhoto,
      content: { fr: data.contentFr || "", en: data.contentEn || "" },
      readTime: { fr: data.readTimeFr || "", en: data.readTimeEn || "" },
      wordCount: { fr: data.wordCountFr || 0, en: data.wordCountEn || 0 },
      pdfUrl: { fr: data.pdfUrlFr || "", en: data.pdfUrlEn || "" },
      audioUrl: { fr: data.audioUrlFr || "", en: data.audioUrlEn || "" },
      imageCaption: { fr: data.imageCaptionFr || "", en: data.imageCaptionEn || "" },
    };
  });
}

export async function getBlogPost(slug: string) {
  const post = await BlogPost.findOne({ where: { slug } });
  if (!post) return null;
  const data = post.toJSON() as any;
  return {
    slug: data.slug,
    title: { fr: data.titleFr, en: data.titleEn },
    description: { fr: data.descriptionFr, en: data.descriptionEn },
    date: data.date,
    thumbnail: data.thumbnail,
    authorName: data.authorName,
    authorPhoto: data.authorPhoto,
    content: { fr: data.contentFr || "", en: data.contentEn || "" },
    readTime: { fr: data.readTimeFr || "", en: data.readTimeEn || "" },
    wordCount: { fr: data.wordCountFr || 0, en: data.wordCountEn || 0 },
    pdfUrl: { fr: data.pdfUrlFr || "", en: data.pdfUrlEn || "" },
    audioUrl: { fr: data.audioUrlFr || "", en: data.audioUrlEn || "" },
    imageCaption: { fr: data.imageCaptionFr || "", en: data.imageCaptionEn || "" },
  };
}

export async function saveBlogPost(
  slug: string,
  frontmatter: {
    title: { fr: string; en: string };
    description: { fr: string; en: string };
    date: string;
    thumbnail: string;
    authorName: string;
    authorPhoto: string;
    imageCaption?: { fr: string; en: string };
    pdfUrl?: { fr: string; en: string };
    audioUrl?: { fr: string; en: string };
    readTime?: { fr: string; en: string };
  },
  content: { fr: string; en: string },
  readTime?: { fr: string; en: string }
) {
  const existing = await BlogPost.findOne({ where: { slug } });

  // Word count calculation
  const wordCountFr = content.fr?.replace(/<[^>]*>?/gm, "").trim().split(/\s+/).filter(Boolean).length || 0;
  const wordCountEn = content.en?.replace(/<[^>]*>?/gm, "").trim().split(/\s+/).filter(Boolean).length || 0;

  const dataToSave = {
    titleFr: frontmatter.title?.fr || "",
    titleEn: frontmatter.title?.en || "",
    descriptionFr: frontmatter.description?.fr || "",
    descriptionEn: frontmatter.description?.en || "",
    date: frontmatter.date,
    thumbnail: frontmatter.thumbnail,
    authorName: frontmatter.authorName,
    authorPhoto: frontmatter.authorPhoto,
    contentFr: content.fr || "",
    contentEn: content.en || "",
    readTimeFr: readTime?.fr || frontmatter.readTime?.fr || calcReadTime(content.fr, "fr"),
    readTimeEn: readTime?.en || frontmatter.readTime?.en || calcReadTime(content.en, "en"),
    wordCountFr,
    wordCountEn,
    pdfUrlFr: frontmatter.pdfUrl?.fr || "",
    pdfUrlEn: frontmatter.pdfUrl?.en || "",
    audioUrlFr: frontmatter.audioUrl?.fr || "",
    audioUrlEn: frontmatter.audioUrl?.en || "",
    imageCaptionFr: frontmatter.imageCaption?.fr || "",
    imageCaptionEn: frontmatter.imageCaption?.en || "",
  };

  if (existing) {
    await existing.update(dataToSave);
  } else {
    await BlogPost.create({
      slug,
      ...dataToSave,
    });
  }
}

export async function deleteBlogPost(slug: string) {
  await BlogPost.destroy({ where: { slug } });
}

// ============================================================================
// DICTIONARIES (i18n)
// ============================================================================

export async function getDictionary(lang: "en" | "fr") {
  const dict = await Dictionary.findOne({ where: { lang } });
  if (dict) {
    // If the database returns the JSON natively as a string (or if it was double-stringified), parse it.
    if (typeof dict.content === "string") {
      try {
        return JSON.parse(dict.content);
      } catch (e) {
        console.error("Failed to parse dictionary JSON:", e);
        return {};
      }
    }
    return dict.content;
  }

  // Fallback to empty structure if not found
  return {};
}

export async function saveDictionary(lang: "en" | "fr", data: any) {
  const dict = await Dictionary.findOne({ where: { lang } });
  if (dict) {
    await dict.update({ content: data });
  } else {
    await Dictionary.create({ lang, content: data });
  }
}

// ============================================================================
// DATA (Expertise, Projects)
// ============================================================================

export interface ExpertiseItem {
  slug: string;
  title: { fr: string; en: string };
  description: { fr: string; en: string };
  content: { fr: string; en: string };
  details: { fr: string; en: string };
  category: { fr: string; en: string };
  imageCaption?: { fr: string; en: string };
  projectSlugs?: string[];
}

export interface ProjectItem {
  slug: string;
  title: { fr: string; en: string };
  description: { fr: string; en: string };
  category: { fr: string; en: string };
  details: { fr: string; en: string };
  image: string | null;
  imageEn?: string | null;
  imageCaption?: { fr: string; en: string };
  href: string;
  pdfUrl?: string | null;
  isFeatured?: boolean;
}

export async function getData(filename: "expertise" | "initiatives"): Promise<ExpertiseItem[]>;
export async function getData(filename: "projects" | "production"): Promise<ProjectItem[]>;
export async function getData(filename: string): Promise<any[]> {
  if (filename === "expertise" || filename === "initiatives") {
    const expertiseItems = await Initiative.findAll({ order: [["order", "ASC"]] });
    // Transform back to JSON structure expected by the frontend
    return expertiseItems.map((i) => {
      const data = i.toJSON();
      return {
        slug: data.slug,
        title: { fr: data.titleFr, en: data.titleEn },
        description: { fr: data.descriptionFr, en: data.descriptionEn },
        content: { fr: data.contentFr || "", en: data.contentEn || "" },
        details: { fr: data.detailsFr, en: data.detailsEn },
        category: { fr: data.categoryFr, en: data.categoryEn },
        image: data.image,
        imageCaption: { fr: data.imageCaptionFr || "", en: data.imageCaptionEn || "" },
        link: data.link,
        projectSlugs: data.projectSlugs ? JSON.parse(data.projectSlugs) : [],
      };
    });
  }

  if (filename === "projects" || filename === "production") {
    const projects = await Production.findAll({ order: [["order", "ASC"]] });
    // Transform back to JSON
    return projects.map((p) => {
      const data = p.toJSON();
      return {
        slug: data.slug,
        title: { fr: data.titleFr, en: data.titleEn },
        description: { fr: data.descriptionFr, en: data.descriptionEn },
        category: { fr: data.categoryFr, en: data.categoryEn },
        details: { fr: data.detailsFr, en: data.detailsEn },
        image: data.image,
        imageEn: data.imageEn,
        imageCaption: { fr: data.imageCaptionFr || "", en: data.imageCaptionEn || "" },
        href: data.href,
        pdfUrl: data.pdfUrl,
        isFeatured: data.isFeatured,
      };
    });
  }

  return [];
}

export async function saveData(filename: "expertise" | "initiatives", data: ExpertiseItem[]): Promise<void>;
export async function saveData(filename: "projects" | "production", data: ProjectItem[]): Promise<void>;
export async function saveData(filename: string, data: any[]): Promise<void> {
  // Since the legacy format sends the entire array to `saveData`,
  // we need to sync it to the DB (destroy all, then create all)
  
  if (filename === "expertise" || filename === "initiatives") {
    await Initiative.destroy({ where: {}, truncate: false }); // Wiping more safely
    const records = data.map((i: any, index: number) => ({
      slug: i.slug,
      titleFr: i.title?.fr || "",
      titleEn: i.title?.en || "",
      descriptionFr: i.description?.fr || "",
      descriptionEn: i.description?.en || "",
      contentFr: i.content?.fr || "",
      contentEn: i.content?.en || "",
      detailsFr: i.details?.fr || null,
      detailsEn: i.details?.en || null,
      categoryFr: i.category?.fr || "",
      categoryEn: i.category?.en || "",
      image: i.image || null,
      imageCaptionFr: i.imageCaption?.fr || null,
      imageCaptionEn: i.imageCaption?.en || null,
      link: i.link || null,
      projectSlugs: i.projectSlugs ? JSON.stringify(i.projectSlugs) : "[]",
      order: index,
    }));
    await Initiative.bulkCreate(records);
  }

  if (filename === "projects" || filename === "production") {
    await Production.destroy({ truncate: true }); // Wipe table
    const records = data.map((p: any, index: number) => ({
      slug: p.slug,
      titleFr: p.title?.fr || "",
      titleEn: p.title?.en || "",
      descriptionFr: p.description?.fr || "",
      descriptionEn: p.description?.en || "",
      categoryFr: p.category?.fr || "",
      categoryEn: p.category?.en || "",
      detailsFr: p.details?.fr || "",
      detailsEn: p.details?.en || "",
      image: p.image || null,
      imageEn: p.imageEn || null,
      imageCaptionFr: p.imageCaption?.fr || null,
      imageCaptionEn: p.imageCaption?.en || null,
      href: p.href || "",
      pdfUrl: p.pdfUrl || null,
      isFeatured: p.isFeatured || false,
      order: index,
    }));
    await Production.bulkCreate(records);
  }
}

// ============================================================================
// ADMIN (Contacts, Subscribers)
// ============================================================================

import { ContactMessage, Subscriber } from "./db/models";

export async function getContactMessages() {
  const messages = await ContactMessage.findAll({
    order: [["createdAt", "DESC"]],
  });
  return messages.map((m) => m.toJSON());
}

export async function getSubscribers() {
  const subscribers = await Subscriber.findAll({
    order: [["subscribedAt", "DESC"]],
  });
  return subscribers.map((s) => s.toJSON());
}

export async function getContactMessagesCount() {
  return await ContactMessage.count();
}

export async function getSubscribersCount() {
  return await Subscriber.count();
}
