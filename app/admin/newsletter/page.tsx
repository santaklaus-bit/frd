import { Users, Mail, Clock } from "lucide-react";
import path from "path";
import fs from "fs/promises";

type Subscriber = {
  id: string;
  email: string;
  subscribedAt: string;
};

async function getSubscribers(): Promise<Subscriber[]> {
  try {
    const filePath = path.join(process.cwd(), "lib/data/newsletter-subscribers.json");
    const content = await fs.readFile(filePath, "utf-8");
    return JSON.parse(content);
  } catch {
    return [];
  }
}

export default async function AdminNewsletterPage() {
  const subscribers = await getSubscribers();

  return (
    <div className="space-y-8">
      <div className="space-y-1 border-b border-border/50 pb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Newsletter</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Abonnés à la newsletter
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm border border-border/50 rounded-xl px-4 py-2 font-semibold tabular-nums">
          <Users className="h-4 w-4 text-muted-foreground" />
          {subscribers.length} abonné{subscribers.length !== 1 ? "s" : ""}
        </div>
      </div>

      {subscribers.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          <Mail className="h-12 w-12 mx-auto mb-4 opacity-20" />
          <p className="text-sm font-medium">Aucun abonné pour le moment.</p>
        </div>
      ) : (
        <div className="border border-border/40 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[1fr_auto] px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 border-b border-border/40 bg-muted/20">
            <span>Adresse e-mail</span>
            <span>Date d&apos;inscription</span>
          </div>
          <div className="divide-y divide-border/30">
            {subscribers.map((sub) => (
              <div
                key={sub.id}
                className="grid grid-cols-[1fr_auto] items-center px-5 py-3.5 hover:bg-muted/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <span className="text-sm font-medium">{sub.email}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {new Date(sub.subscribedAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
