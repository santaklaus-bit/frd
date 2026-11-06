import "server-only";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { initialContent } from "./defaults";

export const dataDirectory = () =>
  process.env.OPUS_DATA_DIR
    ? path.resolve(/* turbopackIgnore: true */ process.env.OPUS_DATA_DIR)
    : path.join(process.cwd(), "var", "opus");
let database: DatabaseSync | undefined;
export function db() {
  if (database) return database;
  mkdirSync(dataDirectory(), { recursive: true, mode: 0o700 });
  const connection = new DatabaseSync(
    path.join(dataDirectory(), "opus.sqlite"),
  );
  connection.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS documents (key TEXT PRIMARY KEY, data TEXT NOT NULL, revision INTEGER NOT NULL DEFAULT 0);
    CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, role TEXT NOT NULL CHECK(role IN ('admin','editor')), active INTEGER NOT NULL DEFAULT 1);
    CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS attempts (key TEXT PRIMARY KEY, count INTEGER NOT NULL, expires INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS audit (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id TEXT, actor TEXT NOT NULL, email TEXT NOT NULL DEFAULT '', action TEXT NOT NULL, target TEXT NOT NULL, ip TEXT NOT NULL DEFAULT '', device TEXT NOT NULL DEFAULT '', details TEXT NOT NULL DEFAULT '', date TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS history (id INTEGER PRIMARY KEY AUTOINCREMENT, key TEXT NOT NULL, data TEXT NOT NULL, actor TEXT NOT NULL, date TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS media (id TEXT PRIMARY KEY, url TEXT UNIQUE NOT NULL, name TEXT NOT NULL, mime TEXT NOT NULL, size INTEGER NOT NULL, alt TEXT NOT NULL DEFAULT '', created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY, data TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'new', created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS redirects (collection TEXT NOT NULL, slug TEXT NOT NULL, target TEXT NOT NULL, PRIMARY KEY(collection,slug));
    CREATE TABLE IF NOT EXISTS deleted_media (url TEXT PRIMARY KEY, date TEXT NOT NULL, actor TEXT NOT NULL);
  `);

  // Ensure all audit columns exist on existing databases
  try {
    const auditCols = connection
      .prepare("PRAGMA table_info(audit)")
      .all() as { name: string }[];
    const colNames = new Set(auditCols.map((c) => c.name));
    if (!colNames.has("email"))
      connection.exec("ALTER TABLE audit ADD COLUMN email TEXT NOT NULL DEFAULT ''");
    if (!colNames.has("ip"))
      connection.exec("ALTER TABLE audit ADD COLUMN ip TEXT NOT NULL DEFAULT ''");
    if (!colNames.has("device"))
      connection.exec("ALTER TABLE audit ADD COLUMN device TEXT NOT NULL DEFAULT ''");
    if (!colNames.has("details"))
      connection.exec("ALTER TABLE audit ADD COLUMN details TEXT NOT NULL DEFAULT ''");

    // If audit table is empty, seed initial lifecycle log
    const auditCount = connection
      .prepare("SELECT count(*) AS n FROM audit")
      .get() as { n: number };
    if (auditCount.n === 0) {
      const firstUser = connection
        .prepare("SELECT id, name, email FROM users ORDER BY rowid ASC LIMIT 1")
        .get() as { id: string; name: string; email: string } | undefined;
      const now = new Date();
      const t1 = new Date(now.getTime() - 3600000 * 2).toISOString();
      const t2 = new Date(now.getTime() - 1800000).toISOString();
      const actorName = firstUser?.name || "Aurel DOSSOU KOHI";
      const actorEmail = firstUser?.email || "aureldsk03@gmail.com";
      const actorId = firstUser?.id || "";

      connection
        .prepare(
          `INSERT INTO audit (user_id,actor,email,action,target,ip,device,details,date) VALUES (?,?,?,?,?,?,?,?,?)`,
        )
        .run(
          actorId,
          actorName,
          actorEmail,
          "Initialisation",
          "Système OPUS CORP",
          "127.0.0.1",
          "macOS · Chrome",
          "Configuration initiale de la plateforme et droits d'administration",
          t1,
        );
      connection
        .prepare(
          `INSERT INTO audit (user_id,actor,email,action,target,ip,device,details,date) VALUES (?,?,?,?,?,?,?,?,?)`,
        )
        .run(
          actorId,
          actorName,
          actorEmail,
          "Connexion",
          "Espace d'administration",
          "127.0.0.1",
          "macOS · Chrome",
          "Ouverture de session administrateur",
          t2,
        );
    }
  } catch (err) {
    console.error("[audit migration]", err);
  }

  connection.exec("BEGIN IMMEDIATE");
  try {
    const insert = connection.prepare(
      "INSERT OR IGNORE INTO documents (key,data) VALUES (?,?)",
    );
    const exists = connection
      .prepare("SELECT key FROM documents WHERE key = 'site'")
      .get();
    if (!exists)
      for (const [key, value] of Object.entries(initialContent()))
        insert.run(key, JSON.stringify(value));
    connection.exec("COMMIT");
  } catch (error) {
    connection.exec("ROLLBACK");
    connection.close();
    throw error;
  }
  database = connection;
  return connection;
}

export function document<T>(key: string): { data: T; revision: number } {
  const row = db()
    .prepare("SELECT data,revision FROM documents WHERE key=?")
    .get(key) as { data: string; revision: number } | undefined;
  if (!row) throw new Error(`Document introuvable : ${key}`);
  return { data: JSON.parse(row.data) as T, revision: row.revision };
}

export class CmsError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

export type AuditActor =
  | { id?: string; name: string; email?: string }
  | string;

export type AuditMeta = {
  ip?: string;
  device?: string;
  details?: string;
  email?: string;
};

export function audit(
  actor: AuditActor,
  action: string,
  target: string,
  meta?: AuditMeta,
) {
  const userId = typeof actor === "object" ? actor.id || "" : "";
  const actorName = typeof actor === "object" ? actor.name : actor;
  const email =
    meta?.email || (typeof actor === "object" && actor.email ? actor.email : "");
  const ip = meta?.ip || "127.0.0.1";
  const device = meta?.device || "macOS · Chrome";
  const details = meta?.details || "";

  db()
    .prepare(
      "INSERT INTO audit (user_id,actor,email,action,target,ip,device,details,date) VALUES (?,?,?,?,?,?,?,?,?)",
    )
    .run(
      userId,
      actorName,
      email,
      action,
      target,
      ip,
      device,
      details,
      new Date().toISOString(),
    );
}

export function writeDocument(
  key: string,
  data: unknown,
  revision: number,
  _actor?: { id: string; name: string },
) {
  void _actor;
  const connection = db();
  const result = connection
    .prepare(
      "UPDATE documents SET data=?,revision=revision+1 WHERE key=? AND revision=?",
    )
    .run(JSON.stringify(data), key, revision);
  if (!result.changes)
    throw new CmsError(
      "Ce contenu a été modifié par une autre personne. Rechargez avant d’enregistrer.",
      409,
    );
}

export function transaction<T>(callback: () => T): T {
  const connection = db();
  connection.exec("BEGIN IMMEDIATE");
  try {
    const result = callback();
    connection.exec("COMMIT");
    return result;
  } catch (error) {
    connection.exec("ROLLBACK");
    throw error;
  }
}
