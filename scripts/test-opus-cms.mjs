import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { setTimeout as pause } from "node:timers/promises";
import { DatabaseSync } from "node:sqlite";
import sharp from "sharp";

// Integration checks against an isolated production server. No development or production data is touched.
const directory = await mkdtemp(path.join(tmpdir(), "opus-cms-test-"));
const port = process.env.OPUS_TEST_PORT || "3197";
const origin = `http://127.0.0.1:${port}`;
const password = randomUUID() + "!";
const env = {
  ...process.env,
  NODE_ENV: "production",
  OPUS_DATA_DIR: directory,
  OPUS_APP_ORIGIN: origin,
  OPUS_ADMIN_EMAIL: "admin@example.test",
  OPUS_ADMIN_NAME: "Admin Test",
  OPUS_ADMIN_PASSWORD: password,
};
let server;
let logs = "";
let cookie = "";
let checks = 0;
function start() {
  server = spawn(
    process.execPath,
    [
      "node_modules/next/dist/bin/next",
      "start",
      "--hostname",
      "127.0.0.1",
      "--port",
      port,
    ],
    { env, stdio: ["ignore", "pipe", "pipe"] },
  );
  server.stdout.on("data", (chunk) => {
    logs += chunk;
  });
  server.stderr.on("data", (chunk) => {
    logs += chunk;
  });
}
async function ready() {
  for (let i = 0; i < 100; i++) {
    if (server.exitCode !== null) throw new Error(`Server exited: ${logs}`);
    try {
      const result = await fetch(`${origin}/api/admin/session`);
      if (result.ok) return;
    } catch {}
    await pause(300);
  }
  throw new Error(`Server not ready: ${logs}`);
}
async function stop() {
  if (!server || server.exitCode !== null) return;
  const exit = new Promise((resolve) => server.once("exit", resolve));
  server.kill("SIGTERM");
  await exit;
}
async function api(
  resource,
  method = "GET",
  body,
  session = cookie,
  extra = {},
) {
  const form = body instanceof FormData;
  const result = await fetch(`${origin}/api/admin/${resource}`, {
    method,
    headers: {
      Origin: origin,
      ...(session ? { Cookie: session } : {}),
      ...(body !== undefined && !form
        ? { "Content-Type": "application/json" }
        : {}),
      ...extra,
    },
    body: body === undefined ? undefined : form ? body : JSON.stringify(body),
    redirect: "manual",
  });
  const data = await result.json().catch(() => ({}));
  return { result, data };
}
function check(value, message) {
  assert.ok(value, message);
  checks++;
  process.stdout.write(`✓ ${message}\n`);
}
try {
  const created = spawnSync(
    process.execPath,
    ["scripts/create-opus-admin.mjs"],
    { env, encoding: "utf8" },
  );
  assert.equal(created.status, 0, created.stderr);
  start();
  await ready();
  check(
    (await api("content", "GET", undefined, "")).result.status === 401,
    "Les données admin refusent les requêtes anonymes",
  );
  check(
    (await api("articles", "POST", {}, "")).result.status === 401,
    "Les écritures refusent les requêtes anonymes",
  );
  check(
    (await api("media", "POST", {}, "")).result.status === 401,
    "L’upload refuse les requêtes anonymes",
  );
  check(
    (
      await api("login", "POST", {
        email: "admin@example.test",
        password: "wrong",
      })
    ).result.status === 401,
    "Un mauvais mot de passe est refusé",
  );
  check(
    (
      await api(
        "login",
        "POST",
        { email: "admin@example.test", password },
        "",
        { Origin: "https://other.test" },
      )
    ).result.status === 403,
    "Une origine étrangère est refusée",
  );
  const session = await api("login", "POST", {
    email: "admin@example.test",
    password,
  });
  check(session.result.ok, "Le compte administrateur peut se connecter");
  cookie = session.result.headers.get("set-cookie").split(";")[0];
  check(
    /HttpOnly/i.test(session.result.headers.get("set-cookie")) &&
      /SameSite=strict/i.test(session.result.headers.get("set-cookie")),
    "La session est placée dans un cookie HttpOnly SameSite strict",
  );
  const adminPage = await fetch(`${origin}/admin`, {
    headers: { Cookie: cookie },
  });
  const adminHtml = await adminPage.text();
  check(
    adminPage.ok &&
      adminHtml.includes("Chargement de votre espace") &&
      !adminHtml.includes("A server error occurred"),
    "La page admin authentifiée peut être rendue par React",
  );
  let { data: snapshot } = await api("content");
  check(
    snapshot.content.articles.length === 2 &&
      snapshot.content.team.length === 6 &&
      snapshot.content.events.length > 0,
    "Les contenus OPUS sont importés une seule fois",
  );
  check(
    snapshot.content.site.name === "OPUS CORP",
    "La configuration correspond à OPUS",
  );
  const article = {
    ...snapshot.content.articles[0],
    id: randomUUID(),
    revision: 0,
    slug: `integration-${randomUUID()}`,
    title: "Article de validation OPUS",
    status: "draft",
    blocks: [
      { type: "heading", text: "Un titre de section" },
      {
        type: "paragraph",
        text: "Un article de validation publié depuis le panel.",
      },
    ],
    body: [],
  };
  let saved = await api("articles", "POST", article);
  check(saved.result.ok, "Un article peut être créé en brouillon");
  let entry = saved.data.entry;
  check(
    (await fetch(`${origin}/blog/${entry.slug}`)).status === 404,
    "Le brouillon n’a pas de page publique",
  );
  check(
    !(await (await fetch(`${origin}/`)).text()).includes(entry.slug),
    "Le brouillon est absent du contenu public envoyé au navigateur",
  );
  check(
    !(await (await fetch(`${origin}/sitemap.xml`)).text()).includes(entry.slug),
    "Le brouillon est absent du sitemap",
  );
  saved = await api("articles", "POST", { ...entry, status: "published" });
  entry = saved.data.entry;
  check(saved.result.ok, "Le brouillon peut être publié");
  const page = await fetch(`${origin}/blog/${entry.slug}`);
  check(
    page.ok && (await page.text()).includes("Un titre de section"),
    "La nouvelle page est disponible sans reconstruction",
  );
  check(
    (await (await fetch(`${origin}/sitemap.xml`)).text()).includes(entry.slug),
    "Le sitemap est actualisé après publication",
  );
  check(
    (
      await api("articles", "POST", {
        ...entry,
        revision: entry.revision - 1,
        title: "Conflit",
      })
    ).result.status === 409,
    "Une ancienne version ne peut pas écraser une modification récente",
  );
  const oldSlug = entry.slug;
  saved = await api("articles", "POST", {
    ...entry,
    slug: `${oldSlug}-renomme`,
  });
  entry = saved.data.entry;
  const redirect = await fetch(`${origin}/blog/${oldSlug}`, {
    redirect: "manual",
  });
  check(
    redirect.status === 308 &&
      redirect.headers.get("location").includes(entry.slug),
    "L’ancienne URL redirige vers la nouvelle publication",
  );
  check(
    (await api(`articles/${entry.id}/history`)).data.items.length >= 2,
    "Les versions précédentes sont conservées",
  );
  const invalid = new FormData();
  invalid.set(
    "file",
    new File(["<script>alert(1)</script>"], "fake.png", { type: "image/png" }),
  );
  check(
    (await api("media", "POST", invalid)).result.status === 400,
    "Un fichier déguisé en image est refusé",
  );
  const image = await sharp({
    create: { width: 32, height: 32, channels: 3, background: "#ed6a3d" },
  })
    .png()
    .toBuffer();
  const form = new FormData();
  form.set("file", new File([image], "photo-test.png", { type: "image/png" }));
  form.set("alt", "Photo de validation");
  const uploaded = await api("media", "POST", form);
  const media = uploaded.data.item;
  check(
    uploaded.result.status === 201 && media.mime === "image/webp",
    "Une image valide est décodée et optimisée en WebP",
  );
  check(
    (await fetch(`${origin}${media.url}`)).headers.get("content-type") ===
      "image/webp",
    "Le média est servi avec le bon type",
  );
  saved = await api("articles", "POST", { ...entry, image: media.url });
  entry = saved.data.entry;
  check(
    (await api(`media/${media.id}`, "DELETE")).result.status === 409,
    "Un média utilisé ne peut pas être supprimé",
  );
  ({ data: snapshot } = await api("content"));
  check(
    (
      await api("site", "PUT", {
        data: { ...snapshot.content.site, phoneHref: "javascript:alert(1)" },
        revision: snapshot.revisions.site,
      })
    ).result.status === 400,
    "Les liens de téléphone ne peuvent pas contenir de code",
  );
  check(
    (
      await api("site", "PUT", {
        data: snapshot.content.site,
        revision: snapshot.revisions.site + 10,
      })
    ).result.status === 409,
    "Les paramètres sont protégés contre les modifications concurrentes",
  );
  const order = [...snapshot.content.team.map((item) => item.id)].reverse();
  check(
    (
      await api("team/order", "PATCH", {
        ids: order,
        revision: snapshot.revisions.team,
      })
    ).result.ok,
    "L’ordre des membres peut être enregistré",
  );
  check(
    (await api("content")).data.content.team[0].id === order[0],
    "Le nouvel ordre est conservé",
  );
  const initialEvent = snapshot.content.events[0];
  const renamedEvent = (
    await api("events", "POST", {
      ...initialEvent,
      slug: `${initialEvent.slug}-renomme`,
    })
  ).data.entry;
  const updatedTeam = (await api("content")).data.content.team;
  check(
    updatedTeam.some((member) =>
      member.projectSlugs.includes(renamedEvent.slug),
    ) &&
      !updatedTeam.some((member) =>
        member.projectSlugs.includes(initialEvent.slug),
      ),
    "Renommer un événement conserve ses associations avec l’équipe",
  );
  await api(`events/${renamedEvent.id}`, "DELETE", {
    revision: renamedEvent.revision,
  });
  check(
    !(await api("content")).data.content.team.some((member) =>
      member.projectSlugs.includes(renamedEvent.slug),
    ),
    "Supprimer un événement retire ses associations avec l’équipe",
  );
  const contact = await fetch(`${origin}/api/contact`, {
    method: "POST",
    headers: { Origin: origin, "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Client Test",
      email: "client@example.test",
      phone: "+229 01 00 00 00 00",
      project: "Lancement de produit",
    }),
  });
  check(contact.ok, "Le formulaire public enregistre une demande");
  check(
    (await api("messages")).data.items[0].data.name === "Client Test",
    "La demande est visible dans le panel",
  );
  const editorPassword = randomUUID();
  check(
    (
      await api("users", "POST", {
        name: "Éditeur Test",
        email: "editor@example.test",
        password: editorPassword,
        role: "editor",
        active: true,
      })
    ).result.ok,
    "Un administrateur peut créer un compte éditeur",
  );
  const editorLogin = await api("login", "POST", {
    email: "editor@example.test",
    password: editorPassword,
  });
  const editorCookie = editorLogin.result.headers
    .get("set-cookie")
    .split(";")[0];
  check(
    (await api("users", "GET", undefined, editorCookie)).result.status === 403,
    "L’éditeur ne peut pas consulter les comptes",
  );
  check(
    (
      await api(
        "site",
        "PUT",
        { data: snapshot.content.site, revision: 0 },
        editorCookie,
      )
    ).result.status === 403,
    "L’éditeur ne peut pas modifier les paramètres",
  );
  check(
    (
      await api(
        `articles/${entry.id}`,
        "DELETE",
        { revision: entry.revision },
        editorCookie,
      )
    ).result.status === 403,
    "L’éditeur ne peut pas supprimer définitivement un article",
  );
  const accounts = (await api("users")).data.items;
  const admin = accounts.find((item) => item.role === "admin");
  check(
    (await api("users", "POST", { ...admin, active: false })).result.status ===
      400,
    "Le dernier administrateur actif ne peut pas être désactivé",
  );
  await stop();
  start();
  await ready();
  check(
    (await api("content")).data.content.articles.some(
      (item) => item.id === entry.id,
    ),
    "Le contenu survit au redémarrage du serveur",
  );
  check(
    (await fetch(`${origin}${media.url}`)).ok,
    "Les médias survivent au redémarrage du serveur",
  );
  const finalContent = (await api("content")).data.content;
  for (const collection of ["articles", "events", "team"])
    for (const item of finalContent[collection]) {
      const archived = await api(collection, "POST", {
        ...item,
        status: "archived",
      });
      assert.ok(archived.result.ok, JSON.stringify(archived.data));
    }
  check(
    (await fetch(`${origin}/`)).ok,
    "L’accueil reste disponible lorsque tous les contenus sont archivés",
  );
  await api("logout", "POST");
  check(
    (await api("content")).result.status === 401,
    "Une session déconnectée est révoquée côté serveur",
  );
  const database = new DatabaseSync(path.join(directory, "opus.sqlite"));
  database.prepare("UPDATE sessions SET expires=0").run();
  database.close();
  check(
    (await api("content", "GET", undefined, editorCookie)).result.status ===
      401,
    "Une session expirée est refusée",
  );
  process.stdout.write(`\n${checks} vérifications réussies.\n`);
} catch (error) {
  process.stderr.write(`\n${error.stack}\n${logs.slice(-5000)}\n`);
  process.exitCode = 1;
} finally {
  await stop();
  await rm(directory, { recursive: true, force: true });
}
