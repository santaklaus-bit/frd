import "server-only";
import {
  randomBytes,
  scryptSync,
  timingSafeEqual,
  createHash,
} from "node:crypto";
import { cookies } from "next/headers";
import { db, CmsError } from "./database";

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor";
};
export const sessionCookie = "opus_session";
export const sessionDuration = 60 * 60 * 12;
export const digest = (value: string) =>
  createHash("sha256").update(value).digest("hex");

export function passwordHash(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}
export function verifyPassword(password: string, encoded: string) {
  const [salt, hash] = encoded.split(":");
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash || "", "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export async function currentUser(): Promise<AdminUser | null> {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const row = db()
    .prepare(
      `SELECT u.id,u.name,u.email,u.role FROM sessions s JOIN users u ON u.id=s.user_id
    WHERE s.token=? AND s.expires>? AND u.active=1`,
    )
    .get(digest(token), Date.now()) as AdminUser | undefined;
  // SQLite rows have a null prototype; React Server Components require plain objects.
  return row ? { ...row } : null;
}
export async function requireUser(adminOnly = false) {
  const user = await currentUser();
  if (!user) throw new CmsError("Connectez-vous pour continuer.", 401);
  if (adminOnly && user.role !== "admin")
    throw new CmsError("Cette action est réservée aux administrateurs.", 403);
  return user;
}

export function sameOrigin(request: Request) {
  const expected = process.env.OPUS_APP_ORIGIN || new URL(request.url).origin;
  if (request.headers.get("origin") !== expected)
    throw new CmsError("Origine de la requête refusée.", 403);
}

export function rateLimit(key: string, max: number, windowMs: number) {
  const connection = db();
  const now = Date.now();
  connection.prepare("DELETE FROM attempts WHERE expires<?").run(now);
  const row = connection
    .prepare("SELECT count FROM attempts WHERE key=?")
    .get(key) as { count: number } | undefined;
  if (row && row.count >= max)
    throw new CmsError("Trop de tentatives. Réessayez plus tard.", 429);
  connection
    .prepare(
      "INSERT INTO attempts (key,count,expires) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1",
    )
    .run(key, now + windowMs);
}

export function login(email: string, password: string) {
  const normalized = email.trim().toLowerCase();
  rateLimit(`login:${normalized}`, 8, 15 * 60 * 1000);
  const user = db()
    .prepare("SELECT * FROM users WHERE email=? AND active=1")
    .get(normalized) as (AdminUser & { password: string }) | undefined;
  // Keep the same expensive password derivation for an unknown account.
  const hash = user?.password || `${"0".repeat(32)}:${"0".repeat(128)}`;
  if (!verifyPassword(password, hash) || !user)
    throw new CmsError("E-mail ou mot de passe incorrect.", 401);
  const token = randomBytes(32).toString("hex");
  db().prepare("DELETE FROM sessions WHERE expires<?").run(Date.now());
  db()
    .prepare("INSERT INTO sessions (token,user_id,expires) VALUES (?,?,?)")
    .run(digest(token), user.id, Date.now() + sessionDuration * 1000);
  db().prepare("DELETE FROM attempts WHERE key=?").run(`login:${normalized}`);
  return token;
}
