import { BlogPost, Dictionary, Initiative, Production } from "./db/models";

// ============================================================================
// BLOG POSTS
// ============================================================================

// ~200 words per minute reading speed
function calcReadTime(content: string, lang: "en" | "fr" = "fr"): string {
  const words = content?.trim().split(/\s+/).length ?? 0;
  const minutes = Math.max(1, Math.round(words / 200));
  return lang === "fr" ? `${minutes} min` : `${minutes} min`;
}

export async function getBlogPosts() {
  const posts = await BlogPost.findAll({
    order: [["date", "DESC"]],
  });
  return posts.map((p) => {
    const json = p.toJSON() as any;
    json.readTime = calcReadTime(json.content ?? "");
    return json;
  });
}

export async function getBlogPost(slug: string) {
  const post = await BlogPost.findOne({ where: { slug } });
  if (!post) return null;
  const json = post.toJSON() as any;
  json.readTime = calcReadTime(json.content ?? "");
  return json;
}

export async function saveBlogPost(
  slug: string,
  frontmatter: any,
  content: string
) {
  const existing = await BlogPost.findOne({ where: { slug } });

  if (existing) {
    await existing.update({
      title: frontmatter.title,
      description: frontmatter.description,
      date: frontmatter.date,
      thumbnail: frontmatter.thumbnail,
      authorName: frontmatter.authorName,
      authorPhoto: frontmatter.authorPhoto,
      content,
    });
  } else {
    await BlogPost.create({
      slug,
      title: frontmatter.title,
      description: frontmatter.description,
      date: frontmatter.date,
      thumbnail: frontmatter.thumbnail,
      authorName: frontmatter.authorName,
      authorPhoto: frontmatter.authorPhoto,
      content,
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
}

export interface ProjectItem {
  slug: string;
  title: { fr: string; en: string };
  description: { fr: string; en: string };
  category: { fr: string; en: string };
  details: { fr: string; en: string };
  image: string | null;
  href: string;
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
        link: data.link,
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
        href: data.href,
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
      link: i.link || null,
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
      href: p.href || "",
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
