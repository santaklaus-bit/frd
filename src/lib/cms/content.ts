import "server-only";
import { cache } from "react";
import { document, db, CmsError, transaction, writeDocument } from "./database";
import {
  collectionSchemas,
  publicationIssues,
  type Collection,
  type CmsEntry,
  type PublicContent,
  type CmsMember,
} from "./schema";
import type { AdminUser } from "./auth";

function updateProjectReferences(
  oldSlug: string,
  newSlug: string | null,
  user: AdminUser,
) {
  const stored = document<CmsMember[]>("team");
  let changed = false;
  const next = stored.data.map((member) => {
    if (!member.projectSlugs.includes(oldSlug)) return member;
    changed = true;
    const now = new Date().toISOString();
    db()
      .prepare("INSERT INTO history(key,data,actor,date) VALUES (?,?,?,?)")
      .run(`team/${member.id}`, JSON.stringify(member), user.name, now);
    return {
      ...member,
      revision: member.revision + 1,
      updatedAt: now,
      projectSlugs: newSlug
        ? member.projectSlugs.map((slug) => (slug === oldSlug ? newSlug : slug))
        : member.projectSlugs.filter((slug) => slug !== oldSlug),
    };
  });
  if (changed) writeDocument("team", next, stored.revision, user);
}

export function allContent(): PublicContent {
  return Object.fromEntries(
    ["articles", "events", "team", "site", "pages", "services", "faq"].map(
      (key) => [key, document(key).data],
    ),
  ) as PublicContent;
}
export const publicContent = cache(async (): Promise<PublicContent> => {
  const all = allContent();
  const visible = <T extends CmsEntry>(entries: T[]) =>
    entries.filter((entry) => entry.status === "published");
  return {
    ...all,
    articles: visible(all.articles).sort((a, b) =>
      b.date.localeCompare(a.date),
    ),
    events: visible(all.events),
    team: visible(all.team),
  };
});

export function saveEntry(
  collection: Collection,
  input: unknown,
  user: AdminUser,
) {
  const parsed = collectionSchemas[collection].safeParse(input);
  if (!parsed.success)
    throw new CmsError(
      parsed.error.issues
        .map((issue) => `${issue.path.join(".")} : ${issue.message}`)
        .join("\n"),
    );
  const entry = parsed.data;
  const issues = publicationIssues(collection, entry);
  if (issues.length) throw new CmsError(issues.join("\n"));
  return transaction(() => {
    const { data: entries, revision } = document<CmsEntry[]>(collection);
    const previous = entries.find((item) => item.id === entry.id);
    if (!previous && entry.revision !== 0)
      throw new CmsError(
        "Cette fiche a été supprimée. Rechargez la liste.",
        409,
      );
    if (previous && previous.revision !== entry.revision)
      throw new CmsError(
        "Une autre personne a modifié cette fiche. Rechargez-la pour continuer.",
        409,
      );
    if (
      entries.some((item) => item.id !== entry.id && item.slug === entry.slug)
    )
      throw new CmsError("Cette adresse est déjà utilisée.", 409);
    const redirected = db()
      .prepare("SELECT target FROM redirects WHERE collection=? AND slug=?")
      .get(collection, entry.slug);
    if (redirected && previous?.slug !== entry.slug)
      throw new CmsError(
        "Cette adresse appartient à une ancienne publication. Choisissez une autre adresse.",
        409,
      );
    const updated = {
      ...entry,
      revision: (previous?.revision || 0) + 1,
      updatedAt: new Date().toISOString(),
    };
    if (previous) {
      db()
        .prepare("INSERT INTO history (key,data,actor,date) VALUES (?,?,?,?)")
        .run(
          `${collection}/${entry.id}`,
          JSON.stringify(previous),
          user.name,
          updated.updatedAt,
        );
      if (previous.slug !== entry.slug) {
        if (collection === "events")
          updateProjectReferences(previous.slug, entry.slug, user);
        db()
          .prepare(
            "UPDATE redirects SET target=? WHERE collection=? AND target=?",
          )
          .run(entry.slug, collection, previous.slug);
        db()
          .prepare(
            "INSERT INTO redirects(collection,slug,target) VALUES (?,?,?)",
          )
          .run(collection, previous.slug, entry.slug);
      }
    }
    let next = previous
      ? entries.map((item) => (item.id === entry.id ? updated : item))
      : [updated, ...entries];
    if (collection === "events" && "featured" in updated && updated.featured)
      next = next.map((item) =>
        item.id === entry.id || !("featured" in item && item.featured)
          ? item
          : {
              ...item,
              featured: false,
              revision: item.revision + 1,
              updatedAt: updated.updatedAt,
            },
      );
    writeDocument(collection, next, revision, user);
    return updated;
  });
}

export function deleteEntry(
  collection: Collection,
  id: string,
  revision: number,
  user: AdminUser,
) {
  return transaction(() => {
    const stored = document<CmsEntry[]>(collection);
    const entry = stored.data.find((item) => item.id === id);
    if (!entry) throw new CmsError("Fiche introuvable.", 404);
    if (entry.revision !== revision)
      throw new CmsError("Cette fiche a été modifiée. Rechargez-la.", 409);
    db()
      .prepare("INSERT INTO history(key,data,actor,date) VALUES (?,?,?,?)")
      .run(
        `${collection}/${id}`,
        JSON.stringify(entry),
        user.name,
        new Date().toISOString(),
      );
    if (collection === "events")
      updateProjectReferences(entry.slug, null, user);
    writeDocument(
      collection,
      stored.data.filter((item) => item.id !== id),
      stored.revision,
      user,
    );
  });
}

export async function findPublicEntry(collection: Collection, slug: string) {
  const entries = (await publicContent())[collection] as CmsEntry[];
  return entries.find((entry) => entry.slug === slug);
}
export function redirectTarget(collection: Collection, slug: string) {
  const row = db()
    .prepare("SELECT target FROM redirects WHERE collection=? AND slug=?")
    .get(collection, slug) as { target: string } | undefined;
  if (!row) return null;
  const { data } = document<CmsEntry[]>(collection);
  return data.some(
    (entry) => entry.slug === row.target && entry.status === "published",
  )
    ? row.target
    : null;
}
