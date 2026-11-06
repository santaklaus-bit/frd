import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readdir, stat, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { db, dataDirectory, CmsError, audit, type AuditMeta } from "./database";
import type { AdminUser } from "./auth";

export type MediaItem = {
  id: string;
  url: string;
  name: string;
  mime: string;
  size: number;
  alt: string;
  created_at: string;
  inUse?: boolean;
  isUploaded?: boolean;
};
const maxUpload = 50 * 1024 * 1024;
const extensions: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  mp4: "video/mp4",
  webm: "video/webm",
};

export async function mediaLibrary(): Promise<MediaItem[]> {
  const existing: MediaItem[] = [];

  // Read deleted URLs to exclude them from the library
  const deletedUrls = new Set(
    (
      db()
        .prepare("SELECT url FROM deleted_media")
        .all() as { url: string }[]
    ).map((r) => r.url),
  );

  // Read custom alts for static files
  db().exec(
    "CREATE TABLE IF NOT EXISTS media_alt (url TEXT PRIMARY KEY, alt TEXT NOT NULL)",
  );
  const customAlts = new Map(
    (
      db().prepare("SELECT url, alt FROM media_alt").all() as {
        url: string;
        alt: string;
      }[]
    ).map((r) => [r.url, r.alt]),
  );

  async function walk(directory: string, prefix: string) {
    for (const file of await readdir(directory, { withFileTypes: true }).catch(
      () => [],
    )) {
      if (file.isSymbolicLink()) continue;
      const filename = path.join(directory, file.name);
      const url = `${prefix}/${file.name}`;
      if (deletedUrls.has(url)) continue;

      if (file.isDirectory()) await walk(filename, url);
      else {
        const mime = extensions[path.extname(file.name).slice(1).toLowerCase()];
        if (mime) {
          const info = await stat(filename);
          existing.push({
            id: url,
            url,
            name: file.name,
            mime,
            size: info.size,
            alt: customAlts.get(url) || "",
            created_at: info.mtime.toISOString(),
            isUploaded: false,
          });
        }
      }
    }
  }
  await walk(path.join(process.cwd(), "public/images"), "/images");
  await walk(path.join(process.cwd(), "public/videos"), "/videos");

  const uploadedRows = db()
    .prepare("SELECT * FROM media ORDER BY created_at DESC")
    .all() as unknown as MediaItem[];

  const uploaded = uploadedRows.map((row) => ({
    ...row,
    isUploaded: true,
  }));

  const allItems = [...uploaded, ...existing];

  // Compute inUse status across all CMS documents
  const documents = db()
    .prepare("SELECT key,data FROM documents")
    .all() as { key: string; data: string }[];
  const joinedDocs = documents.map((d) => d.data).join(" ");

  return allItems.map((item) => ({
    ...item,
    inUse: joinedDocs.includes(item.url),
  }));
}

export async function uploadMedia(
  file: File,
  alt: string,
  user: AdminUser,
  meta?: AuditMeta,
) {
  if (file.size <= 0 || file.size > maxUpload)
    throw new CmsError("Choisissez un fichier de moins de 50 Mo.");
  const bytes = Buffer.from(await file.arrayBuffer());
  let output: Buffer;
  let ext: string;
  let mime: string;
  if (
    ["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)
  ) {
    try {
      // Decode and re-encode the image: exclude disguised files and strip metadata.
      const metadata = await sharp(bytes, {
        limitInputPixels: 40_000_000,
      }).metadata();
      if (!["jpeg", "png", "webp", "gif"].includes(metadata.format || ""))
        throw new Error("format");
      output = await sharp(bytes, { limitInputPixels: 40_000_000 })
        .rotate()
        .resize({
          width: 2560,
          height: 2560,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 88 })
        .toBuffer();
      ext = "webp";
      mime = "image/webp";
    } catch {
      throw new CmsError(
        "Cette image ne peut pas être lue. Choisissez un JPEG, PNG, WebP ou GIF valide.",
      );
    }
  } else if (
    file.type === "video/mp4" &&
    bytes.subarray(4, 8).toString() === "ftyp"
  ) {
    output = bytes;
    ext = "mp4";
    mime = "video/mp4";
  } else if (
    file.type === "video/webm" &&
    bytes.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]))
  ) {
    output = bytes;
    ext = "webm";
    mime = "video/webm";
  } else
    throw new CmsError(
      "Format refusé. Utilisez JPEG, PNG, WebP, GIF, MP4 ou WebM.",
    );
  const id = randomUUID();
  const filename = `${id}.${ext}`;
  const directory = path.join(dataDirectory(), "media");
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, filename), output, {
    flag: "wx",
    mode: 0o600,
  });
  const item: MediaItem = {
    id,
    url: `/media/${filename}`,
    name: file.name.slice(0, 200),
    mime,
    size: output.length,
    alt: alt.trim().slice(0, 500),
    created_at: new Date().toISOString(),
  };
  try {
    db()
      .prepare(
        "INSERT INTO media (id,url,name,mime,size,alt,created_at) VALUES (?,?,?,?,?,?,?)",
      )
      .run(
        item.id,
        item.url,
        item.name,
        item.mime,
        item.size,
        item.alt,
        item.created_at,
      );
    audit(user, "Ajout média", item.name, {
      ip: meta?.ip,
      device: meta?.device,
      details:
        meta?.details ||
        `Type : ${item.mime}, taille : ${(item.size / 1024).toFixed(1)} Ko`,
    });
  } catch (error) {
    await unlink(path.join(directory, filename));
    throw error;
  }
  return item;
}

export async function removeMedia(
  idOrUrl: string,
  user: AdminUser,
  meta?: AuditMeta,
) {
  const normUrl = idOrUrl.startsWith("/") ? idOrUrl : `/${idOrUrl}`;
  const item = db()
    .prepare("SELECT * FROM media WHERE id=? OR url=?")
    .get(idOrUrl, normUrl) as MediaItem | undefined;

  const targetUrl = item ? item.url : normUrl;

  const documents = db()
    .prepare("SELECT key,data FROM documents")
    .all() as {
    key: string;
    data: string;
  }[];
  if (documents.some((row) => row.data.includes(targetUrl)))
    throw new CmsError(
      "Ce média est utilisé sur le site ou dans un brouillon. Retirez-le des fiches avant de le supprimer.",
      409,
    );
  const history = db()
    .prepare("SELECT id FROM history WHERE instr(data,?)>0 LIMIT 1")
    .get(targetUrl);
  if (history)
    throw new CmsError(
      "Ce média est conservé dans l’historique d’une fiche. Sa suppression empêcherait la restauration.",
      409,
    );

  if (item) {
    await unlink(path.join(dataDirectory(), "media", path.basename(item.url))).catch(
      () => {},
    );
    db().prepare("DELETE FROM media WHERE id=?").run(item.id);
    db().prepare("INSERT OR REPLACE INTO deleted_media (url, date, actor) VALUES (?,?,?)").run(
      item.url,
      new Date().toISOString(),
      user.name,
    );
    audit(user, "Suppression média", item.name, {
      ip: meta?.ip,
      device: meta?.device,
      details: meta?.details || "Fichier supprimé de la médiathèque",
    });
  } else {
    // Media from static public directory
    db().prepare(
      "INSERT OR REPLACE INTO deleted_media (url, date, actor) VALUES (?,?,?)",
    ).run(targetUrl, new Date().toISOString(), user.name);
    await unlink(path.join(process.cwd(), "public", targetUrl)).catch(() => {});
    audit(user, "Suppression média", path.basename(targetUrl), {
      ip: meta?.ip,
      device: meta?.device,
      details: meta?.details || "Fichier statique supprimé de la médiathèque",
    });
  }
}
