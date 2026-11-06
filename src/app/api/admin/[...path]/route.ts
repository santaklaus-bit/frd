import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import {
  audit,
  CmsError,
  db,
  document,
  transaction,
  writeDocument,
} from "@/lib/cms/database";
import {
  currentUser,
  digest,
  login,
  passwordHash,
  rateLimit,
  requireUser,
  sameOrigin,
  sessionCookie,
  sessionDuration,
} from "@/lib/cms/auth";
import { allContent, deleteEntry, saveEntry } from "@/lib/cms/content";
import {
  collectionSchemas,
  faqSchema,
  pagesSchema,
  serviceSchema,
  settingsSchema,
  type Collection,
} from "@/lib/cms/schema";
import { mediaLibrary, removeMedia, uploadMedia } from "@/lib/cms/media";
import { extractClientInfo } from "@/lib/cms/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ path: string[] }> };
const response = (value: unknown, status = 200) =>
  NextResponse.json(value, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
const collections = Object.keys(collectionSchemas);
const configuration = {
  site: settingsSchema,
  pages: pagesSchema,
  faq: z.array(faqSchema).max(50),
  services: z.array(serviceSchema).max(30),
};

async function handler(request: Request, context: Context) {
  try {
    const { path } = await context.params;
    const [resource, id, action] = path;
    if (request.method !== "GET") sameOrigin(request);
    const client = extractClientInfo(request);

    if (resource === "login" && request.method === "POST") {
      rateLimit("login:global", 100, 15 * 60 * 1000);
      const input = z
        .object({
          email: z.string().email().max(200),
          password: z.string().min(1).max(200),
        })
        .parse(await request.json());

      try {
        const token = login(input.email, input.password);
        const userRow = db()
          .prepare("SELECT id, name, email, role FROM users WHERE email=?")
          .get(input.email.toLowerCase()) as
          | { id: string; name: string; email: string; role: string }
          | undefined;

        audit(
          {
            id: userRow?.id || "",
            name: userRow?.name || input.email,
            email: input.email.toLowerCase(),
          },
          "Connexion",
          "Espace d'administration",
          {
            ip: client.ip,
            device: client.device,
            details: `Connexion réussie (${userRow?.role === "admin" ? "Administrateur" : "Éditeur"})`,
          },
        );

        (await cookies()).set(sessionCookie, token, {
          httpOnly: true,
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
          maxAge: sessionDuration,
          path: "/",
        });
        return response({ success: true });
      } catch (err) {
        audit(
          {
            name: "Visiteur",
            email: input.email.toLowerCase(),
          },
          "Échec de connexion",
          "Authentification",
          {
            ip: client.ip,
            device: client.device,
            details: `Tentative d'accès échouée avec l'identifiant ${input.email}`,
          },
        );
        throw err;
      }
    }

    if (resource === "logout" && request.method === "POST") {
      const jar = await cookies();
      const token = jar.get(sessionCookie)?.value;
      const user = await currentUser();
      if (token)
        db().prepare("DELETE FROM sessions WHERE token=?").run(digest(token));
      jar.delete(sessionCookie);

      if (user) {
        audit(user, "Déconnexion", "Session terminée", {
          ip: client.ip,
          device: client.device,
          details: "Déconnexion volontaire de la session",
        });
      }
      return response({ success: true });
    }

    if (resource === "session" && request.method === "GET")
      return response({ user: await currentUser() });

    const user = await requireUser();

    if (request.method === "GET") {
      if (resource === "content")
        return response({
          content: allContent(),
          revisions: Object.fromEntries(
            [...collections, ...Object.keys(configuration)].map((key) => [
              key,
              document(key).revision,
            ]),
          ),
        });
      if (resource === "media")
        return response({ items: await mediaLibrary() });
      if (resource === "messages")
        return response({
          items: db()
            .prepare("SELECT * FROM messages ORDER BY created_at DESC")
            .all()
            .map((row) => ({ ...row, data: JSON.parse(row.data as string) })),
        });
      if (resource === "audit")
        return response({
          items: db()
            .prepare(
              "SELECT id, user_id, actor, email, action, target, ip, device, details, date FROM audit ORDER BY id DESC LIMIT 150",
            )
            .all(),
        });
      if (collections.includes(resource) && id && action === "history")
        return response({
          items: db()
            .prepare(
              "SELECT * FROM history WHERE key=? ORDER BY id DESC LIMIT 20",
            )
            .all(`${resource}/${id}`)
            .map((row) => ({ ...row, data: JSON.parse(row.data as string) })),
        });
      if (resource === "users") {
        await requireUser(true);
        return response({
          items: db()
            .prepare(
              "SELECT id,name,email,role,active FROM users ORDER BY name",
            )
            .all(),
        });
      }
    }
    if (collections.includes(resource)) {
      if (id === "order" && request.method === "PATCH") {
        const input = z
          .object({
            ids: z.array(z.string().uuid()).max(1000),
            revision: z.number().int().nonnegative(),
          })
          .parse(await request.json());
        transaction(() => {
          const stored = document<{ id: string }[]>(resource);
          if (
            input.ids.length !== stored.data.length ||
            new Set(input.ids).size !== input.ids.length ||
            input.ids.some((id) => !stored.data.some((item) => item.id === id))
          )
            throw new CmsError("La liste a changé. Rechargez la page.", 409);
          writeDocument(
            resource,
            input.ids.map((id) => stored.data.find((item) => item.id === id)!),
            input.revision,
            user,
          );
        });
        return response({ success: true });
      }
      if (request.method === "POST") {
        const rawBody = await request.json();
        const entry = saveEntry(resource as Collection, rawBody, user);
        const colLabel =
          resource === "articles"
            ? "Article"
            : resource === "events"
              ? "Événement"
              : resource === "team"
                ? "Membre d’équipe"
                : resource;
        const entryTitle =
          (entry as { title?: string; name?: string }).title ||
          (entry as { name?: string }).name ||
          entry.slug;
        const actionLabel =
          entry.revision <= 1
            ? "Création"
            : entry.status === "published"
              ? "Publication"
              : "Modification";
        audit(user, actionLabel, `${colLabel} : ${entryTitle}`, {
          ip: client.ip,
          device: client.device,
          details: `Statut : ${entry.status} (rév. ${entry.revision})`,
        });
        return response({ entry });
      }
      if (request.method === "DELETE" && id) {
        await requireUser(true);
        const { revision } = z
          .object({ revision: z.number().int().nonnegative() })
          .parse(await request.json());
        const colLabel =
          resource === "articles"
            ? "Article"
            : resource === "events"
              ? "Événement"
              : resource === "team"
                ? "Membre d’équipe"
                : resource;
        deleteEntry(resource as Collection, id, revision, user);
        audit(user, "Suppression", `${colLabel} (${id})`, {
          ip: client.ip,
          device: client.device,
          details: "Fiche définitivement retirée",
        });
        return response({ success: true });
      }
    }
    if (Object.hasOwn(configuration, resource) && request.method === "PUT") {
      await requireUser(true);
      const input = z
        .object({ data: z.unknown(), revision: z.number().int().nonnegative() })
        .parse(await request.json());
      const schema = configuration[resource as keyof typeof configuration];
      const data = schema.parse(input.data);
      transaction(() => writeDocument(resource, data, input.revision, user));
      audit(user, "Configuration", `Paramètres ${resource}`, {
        ip: client.ip,
        device: client.device,
        details: `Mise à jour des réglages (${resource})`,
      });
      return response({ success: true, revision: input.revision + 1 });
    }
    if (resource === "media") {
      if (request.method === "POST") {
        if (Number(request.headers.get("content-length")) > 52 * 1024 * 1024)
          throw new CmsError("Le fichier dépasse 50 Mo.", 413);
        const form = await request.formData();
        const file = form.get("file");
        if (!(file instanceof File))
          throw new CmsError("Sélectionnez un fichier.");
        const item = await uploadMedia(
          file,
          String(form.get("alt") || ""),
          user,
          { ip: client.ip, device: client.device },
        );
        return response({ item }, 201);
      }
      if (request.method === "PATCH") {
        const fullMediaId = path.slice(1).join("/");
        const { alt, id: bodyId } = z
          .object({
            alt: z.string().trim().max(500),
            id: z.string().optional(),
          })
          .parse(await request.json());
        const targetId = fullMediaId || bodyId || id;
        if (!targetId) throw new CmsError("Identifiant du média manquant.", 400);
        const normUrl = targetId.startsWith("/") ? targetId : `/${targetId}`;
        const result = db()
          .prepare("UPDATE media SET alt=? WHERE id=? OR url=?")
          .run(alt, targetId, normUrl);
        if (!result.changes) {
          db().exec(
            "CREATE TABLE IF NOT EXISTS media_alt (url TEXT PRIMARY KEY, alt TEXT NOT NULL)",
          );
          db().prepare(
            "INSERT OR REPLACE INTO media_alt (url, alt) VALUES (?,?)",
          ).run(normUrl, alt);
        }
        audit(user, "Description média", targetId, {
          ip: client.ip,
          device: client.device,
          details: `Texte alternatif : "${alt}"`,
        });
        return response({ success: true });
      }
      if (request.method === "DELETE") {
        await requireUser(true);
        const fullMediaId = path.slice(1).join("/");
        let targetId = fullMediaId || id;
        if (!targetId) {
          const body = (await request.json().catch(() => ({}))) as {
            id?: string;
          };
          targetId = body.id || "";
        }
        if (!targetId) throw new CmsError("Identifiant du média manquant.", 400);
        await removeMedia(targetId, user, {
          ip: client.ip,
          device: client.device,
        });
        return response({ success: true });
      }
    }
    if (resource === "messages" && id) {
      if (request.method === "PATCH") {
        const { status } = z
          .object({ status: z.enum(["new", "read", "done"]) })
          .parse(await request.json());
        db().prepare("UPDATE messages SET status=? WHERE id=?").run(status, id);
        audit(user, "Suivi message", `Message #${id.slice(0, 8)}`, {
          ip: client.ip,
          device: client.device,
          details: `Statut changé vers : ${status === "new" ? "Nouveau" : status === "read" ? "Lu" : "Traité"}`,
        });
        return response({ success: true });
      }
      if (request.method === "DELETE") {
        await requireUser(true);
        db().prepare("DELETE FROM messages WHERE id=?").run(id);
        audit(user, "Suppression message", `Message #${id.slice(0, 8)}`, {
          ip: client.ip,
          device: client.device,
          details: "Message de contact supprimé",
        });
        return response({ success: true });
      }
    }
    if (resource === "users" && request.method === "POST") {
      await requireUser(true);
      const input = z
        .object({
          id: z.string().uuid().optional(),
          name: z.string().trim().min(1).max(150),
          email: z.string().trim().email().max(200),
          role: z.enum(["admin", "editor"]),
          active: z.boolean(),
          password: z.string().max(200).optional(),
        })
        .parse(await request.json());
      if (input.password && input.password.length < 12)
        throw new CmsError(
          "Utilisez au moins 12 caractères pour le mot de passe.",
        );
      const existing = input.id
        ? db().prepare("SELECT * FROM users WHERE id=?").get(input.id)
        : undefined;
      if (input.id && !existing) throw new CmsError("Compte introuvable.", 404);
      if (!existing && !input.password)
        throw new CmsError("Un mot de passe est obligatoire.");
      const collision = db()
        .prepare("SELECT id FROM users WHERE email=? AND id!=?")
        .get(input.email.toLowerCase(), input.id || "");
      if (collision) throw new CmsError("Cet e-mail est déjà utilisé.", 409);
      transaction(() => {
        if (
          existing?.active &&
          existing.role === "admin" &&
          (!input.active || input.role !== "admin")
        ) {
          const count = db()
            .prepare(
              "SELECT count(*) AS n FROM users WHERE active=1 AND role='admin'",
            )
            .get() as { n: number };
          if (count.n <= 1)
            throw new CmsError("Conservez au moins un administrateur actif.");
        }
        const identifier = input.id || crypto.randomUUID();
        const hash = input.password
          ? passwordHash(input.password)
          : String(existing!.password);
        db()
          .prepare(
            `INSERT INTO users(id,name,email,password,role,active) VALUES (?,?,?,?,?,?)
          ON CONFLICT(id) DO UPDATE SET name=excluded.name,email=excluded.email,password=excluded.password,role=excluded.role,active=excluded.active`,
          )
          .run(
            identifier,
            input.name,
            input.email.toLowerCase(),
            hash,
            input.role,
            input.active ? 1 : 0,
          );
        if (existing)
          db().prepare("DELETE FROM sessions WHERE user_id=?").run(identifier);
        audit(
          user,
          existing ? "Modification compte" : "Création compte",
          `${input.name} (${input.email})`,
          {
            ip: client.ip,
            device: client.device,
            details: `Rôle : ${input.role === "admin" ? "Administrateur" : "Éditeur"}, Statut : ${input.active ? "Actif" : "Inactif"}`,
          },
        );
      });
      return response({ success: true });
    }
    return response({ error: "Ressource introuvable." }, 404);
  } catch (error) {
    if (error instanceof z.ZodError)
      return response(
        {
          error: error.issues
            .map((issue) => `${issue.path.join(".")} : ${issue.message}`)
            .join("\n"),
        },
        400,
      );
    if (error instanceof CmsError)
      return response({ error: error.message }, error.status);
    console.error("[OPUS admin]", error);
    return response(
      { error: "L’opération a échoué. Réessayez dans un instant." },
      500,
    );
  }
}
export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
};
