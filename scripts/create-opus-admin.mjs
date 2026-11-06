import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { randomBytes, randomUUID, scryptSync } from "node:crypto";
import readline from "node:readline/promises";
import { Writable } from "node:stream";

const directory = path.resolve(process.env.OPUS_DATA_DIR || "./var/opus");
let hidden = false;
const output = new Writable({
  write(chunk, encoding, callback) {
    if (!hidden) process.stdout.write(chunk);
    callback();
  },
});
const prompt = readline.createInterface({
  input: process.stdin,
  output,
  terminal: process.stdin.isTTY,
});
try {
  const email = (
    process.env.OPUS_ADMIN_EMAIL ||
    (await prompt.question("E-mail de l’administrateur : "))
  )
    .trim()
    .toLowerCase();
  const name = (
    process.env.OPUS_ADMIN_NAME || (await prompt.question("Nom complet : "))
  ).trim();
  let password = process.env.OPUS_ADMIN_PASSWORD;
  if (!password) {
    process.stdout.write(
      "Mot de passe (12 caractères minimum, saisie masquée) : ",
    );
    hidden = true;
    password = await prompt.question("");
    hidden = false;
    process.stdout.write("\n");
  }
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    !name ||
    !password ||
    password.length < 12 ||
    password.length > 200
  )
    throw new Error(
      "E-mail, nom ou mot de passe invalide (12 à 200 caractères).",
    );
  mkdirSync(directory, { recursive: true, mode: 0o700 });
  const database = new DatabaseSync(path.join(directory, "opus.sqlite"));
  database.exec(
    "PRAGMA busy_timeout=5000; CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY,name TEXT NOT NULL,email TEXT UNIQUE NOT NULL,password TEXT NOT NULL,role TEXT NOT NULL CHECK(role IN ('admin','editor')),active INTEGER NOT NULL DEFAULT 1)",
  );
  if (database.prepare("SELECT id FROM users WHERE email=?").get(email))
    throw new Error("Ce compte existe déjà. Modifiez-le depuis le panel.");
  const salt = randomBytes(16).toString("hex");
  const hash = `${salt}:${scryptSync(password, salt, 64).toString("hex")}`;
  database
    .prepare(
      "INSERT INTO users(id,name,email,password,role) VALUES (?,?,?,?,'admin')",
    )
    .run(randomUUID(), name, email, hash);
  database.close();
  process.stdout.write(
    "Compte administrateur créé. Connectez-vous sur /admin/login.\n",
  );
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
} finally {
  prompt.close();
}
