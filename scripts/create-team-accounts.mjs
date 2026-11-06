import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { randomBytes, randomUUID, scryptSync } from "node:crypto";

const directory = path.resolve(process.env.OPUS_DATA_DIR || "./var/opus");
mkdirSync(directory, { recursive: true, mode: 0o700 });
const db = new DatabaseSync(path.join(directory, "opus.sqlite"));

db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  PRAGMA busy_timeout = 5000;
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin','editor')),
    active INTEGER NOT NULL DEFAULT 1
  );
  CREATE TABLE IF NOT EXISTS audit (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    actor TEXT NOT NULL,
    email TEXT NOT NULL DEFAULT '',
    action TEXT NOT NULL,
    target TEXT NOT NULL,
    ip TEXT NOT NULL DEFAULT '',
    device TEXT NOT NULL DEFAULT '',
    details TEXT NOT NULL DEFAULT '',
    date TEXT NOT NULL
  );
`);

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
}

const teamAccounts = [
  {
    name: "Olufèmi Bankole",
    email: "olufemi.bankole@opuscrp.com",
    role: "admin",
    password: "Opus@Bankole2026!",
    title: "Président Directeur Général (PDG)",
  },
  {
    name: "René Ahouissou",
    email: "rene.ahouissou@opuscrp.com",
    role: "editor",
    password: "Opus@Ahouissou2026!",
    title: "Chef de projet",
  },
  {
    name: "Arsène Dohou",
    email: "arsene.dohou@opuscrp.com",
    role: "editor",
    password: "Opus@Dohou2026!",
    title: "Chargé des opérations et de la logistique",
  },
  {
    name: "Fidèle Houenoukpo",
    email: "fidele.houenoukpo@opuscrp.com",
    role: "editor",
    password: "Opus@Houenoukpo2026!",
    title: "Designer graphique",
  },
  {
    name: "Olahimika Soumaila",
    email: "olahimika.soumaila@opuscrp.com",
    role: "editor",
    password: "Opus@Soumaila2026!",
    title: "Chargé de communication",
  },
  {
    name: "Monreyikè Saïzonou",
    email: "monreyike.saizonou@opuscrp.com",
    role: "editor",
    password: "Opus@Saizonou2026!",
    title: "Chargée de communication",
  },
];

console.log("=== CRÉATION DES COMPTES ÉQUIPE OPUS CORP ===");

const selectUser = db.prepare("SELECT * FROM users WHERE email = ?");
const insertUser = db.prepare(
  "INSERT INTO users (id, name, email, password, role, active) VALUES (?, ?, ?, ?, ?, 1)",
);
const updateUser = db.prepare(
  "UPDATE users SET name = ?, password = ?, role = ?, active = 1 WHERE email = ?",
);
const insertAudit = db.prepare(
  "INSERT INTO audit (user_id, actor, email, action, target, ip, device, details, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
);

const now = new Date().toISOString();

for (const member of teamAccounts) {
  const existing = selectUser.get(member.email.toLowerCase());
  const hash = hashPassword(member.password);
  let userId;

  if (existing) {
    userId = existing.id;
    updateUser.run(member.name, hash, member.role, member.email.toLowerCase());
    console.log(`✓ Mis à jour: ${member.name} (${member.email}) [Rôle: ${member.role.toUpperCase()}]`);
  } else {
    userId = randomUUID();
    insertUser.run(userId, member.name, member.email.toLowerCase(), hash, member.role);
    console.log(`✓ Créé: ${member.name} (${member.email}) [Rôle: ${member.role.toUpperCase()}]`);
  }

  insertAudit.run(
    userId,
    "Système (Initialisation Production)",
    member.email.toLowerCase(),
    existing ? "Modification compte" : "Création compte",
    `${member.name} (${member.email})`,
    "127.0.0.1",
    "Système OPUS",
    `Rôle : ${member.role === "admin" ? "Administrateur" : "Éditeur"}, Statut : Actif (${member.title})`,
    now,
  );
}

db.close();
console.log("\nTous les comptes ont été créés et consignés dans le journal d'audit.");
