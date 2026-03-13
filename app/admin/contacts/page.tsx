import { Mail, Clock, MessageSquare, Circle, CheckCircle2 } from "lucide-react";
import { getContactMessages } from "@/lib/content-manager";

export const dynamic = "force-dynamic";

const REQUEST_TYPES: Record<string, { label: string; color: string }> = {
  general: { label: "Général", color: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300" },
  collaboration: { label: "Collaboration", color: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300" },
  media: { label: "Média", color: "bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-300" },
};

export default async function AdminContactPage() {
  const messages = (await getContactMessages()) as any[];
  const unread = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between pb-6 border-b border-border/50">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Boîte de réception
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">Messages</h1>
        </div>
        {unread > 0 && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-card text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
            {unread} non lu{unread > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Empty state */}
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-border/50 rounded-2xl">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-border/50 bg-muted/30 mb-4">
            <Mail className="h-6 w-6 text-muted-foreground/40" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Aucun message reçu pour le moment.
          </p>
        </div>
      )}

      {/* Messages list */}
      {messages.length > 0 && (
        <div className="space-y-2">
          {messages.map((msg) => {
            const type = REQUEST_TYPES[msg.requestType] ?? REQUEST_TYPES.general;
            return (
              <div
                key={msg.id}
                className={`group relative rounded-2xl border p-5 transition-all duration-200 ${
                  !msg.isRead
                    ? "border-border bg-card shadow-sm"
                    : "border-border/40 bg-muted/10 hover:bg-card hover:border-border/70"
                }`}
              >
                {/* Unread indicator */}
                {!msg.isRead && (
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-foreground" />
                )}

                <div className={`flex items-start justify-between gap-4 ${!msg.isRead ? "pl-5" : ""}`}>
                  {/* Left: sender info */}
                  <div className="flex items-start gap-3 min-w-0">
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold shrink-0 border border-border/50">
                      {msg.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold tracking-tight">{msg.fullName}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${type.color}`}>
                          {type.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{msg.email}</p>
                    </div>
                  </div>

                  {/* Right: date + read status */}
                  <div className="flex items-center gap-2 shrink-0 text-xs text-muted-foreground/60">
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date(msg.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    {msg.isRead ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground/30" />
                    ) : (
                      <Circle className="h-3.5 w-3.5 text-foreground" />
                    )}
                  </div>
                </div>

                {/* Message body */}
                <div className={`mt-3 ${!msg.isRead ? "pl-5" : ""}`}>
                  <div className="flex items-center gap-1.5 mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                    <MessageSquare className="h-3 w-3" />
                    Message
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 whitespace-pre-wrap">
                    {msg.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-xs text-muted-foreground/50 text-right">
        {messages.length} message{messages.length !== 1 ? "s" : ""} au total
      </p>
    </div>
  );
}
