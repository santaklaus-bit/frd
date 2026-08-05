import { NextResponse } from "next/server";
import { z } from "zod";
import { ContactMessage } from "@/lib/db/models";

const contactSchema = z.object({
  fullName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  requestType: z.string().min(1, "Veuillez sélectionner un type de demande"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = contactSchema.parse(body);

    await ContactMessage.create({
      fullName: validatedData.fullName,
      email: validatedData.email,
      requestType: validatedData.requestType,
      message: validatedData.message,
      isRead: false,
    });

    return NextResponse.json(
      { message: "Message envoyé avec succès" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Données invalides", errors: error.errors },
        { status: 400 }
      );
    }
    console.error("Erreur API Contact POST:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const messages = await ContactMessage.findAll({
      order: [["createdAt", "DESC"]],
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Erreur API Contact GET:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
