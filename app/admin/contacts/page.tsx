import { Mail, Clock, CheckCircle, Circle } from "lucide-react";
import path from "path";
import fs from "fs/promises";

type ContactMessage = {
  id: string;
  fullName: string;
  email: string;
  requestType: string;
  message: string;
  createdAt: string;
  isRead: boolean;
};

async function getMessages(): Promise<ContactMessage[]> {
  try {
    const filePath = path.join(process.cwd(), "lib/data/contact-messages.json");
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

const REQUEST_TYPE_LABELS: Record<string, string> = {
  general: "Message général",
  collaboration: "Collaboration / événement",
  media: "Média / entrevue",
};

export default async function AdminContactPage() {
  const messages = await getMessages();

  return (
    <div className="space-y-8">
      <div className="space-y-1 border-b border-border/50 pb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Messages de contact</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {messages.length} message{messages.length !== 1 ? "s" : ""} reçu
            {messages.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground border border-border/50 rounded-xl px-4 py-2">
          <Mail className="h-4 w-4" />
          {messages.filter((m) => !m.isRead).length} non lu{messages.filter((m) => !m.isRead).length !== 1 ? "s" : ""}
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <Mail className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p className="text-sm font-medium">Aucun message reçu pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`border rounded-2xl p-6 transition-all ${
                !msg.isRead
                  ? "border-foreground/20 bg-muted/10"
                  : "border-border/40 bg-card"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  {msg.isRead ? (
                    <CheckCircle className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="h-4 w-4 text-foreground shrink-0 mt-0.5 fill-foreground" />
                  )}
                  <div>
                    <p className="text-sm font-semibold tracking-tight">{msg.fullName}</p>
                    <p className="text-xs text-muted-foreground">{msg.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-right">
                  <span className="text-xs px-3 py-1 rounded-full bg-muted text-muted-foreground font-medium">
                    {REQUEST_TYPE_LABELS[msg.requestType] ?? msg.requestType}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground/60">
                    <Clock className="h-3 w-3" />
                    {new Date(msg.createdAt).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed pl-7 whitespace-pre-wrap">
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
