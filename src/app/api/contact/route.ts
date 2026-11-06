import { z } from "zod";
import { NextResponse } from "next/server";
import { db, CmsError, audit } from "@/lib/cms/database";
import { rateLimit, sameOrigin } from "@/lib/cms/auth";
import { extractClientInfo } from "@/lib/cms/audit";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const input = z
      .object({
        name: z.string().trim().min(2).max(150),
        email: z.string().trim().email().max(200),
        phone: z.string().trim().max(100).default(""),
        project: z.string().trim().max(500).default(""),
        website: z.string().max(200).default(""),
      })
      .parse(await request.json());
    if (input.website) return NextResponse.json({ ok: true });
    rateLimit(`contact:${input.email.toLowerCase()}`, 5, 60 * 60 * 1000);
    const client = extractClientInfo(request);
    db()
      .prepare("INSERT INTO messages(id,data,created_at) VALUES (?,?,?)")
      .run(
        crypto.randomUUID(),
        JSON.stringify({
          name: input.name,
          email: input.email,
          phone: input.phone,
          project: input.project,
        }),
        new Date().toISOString(),
      );
    audit(
      { name: input.name, email: input.email },
      "Nouveau message",
      "Formulaire Contact",
      {
        ip: client.ip,
        device: client.device,
        details: `Message reçu de ${input.name} (${input.email})`,
      },
    );
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof z.ZodError
            ? "Vérifiez vos coordonnées."
            : error instanceof CmsError
              ? error.message
              : "Envoi impossible.",
      },
      {
        status:
          error instanceof CmsError
            ? error.status
            : error instanceof z.ZodError
              ? 400
              : 500,
      },
    );
  }
}
