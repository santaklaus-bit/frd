import { Users, Mail, Clock, Download } from "lucide-react";
import { getSubscribers } from "@/lib/content-manager";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  const subscribers = (await getSubscribers()) as any[];

  // Group by month
  const grouped = subscribers.reduce<Record<string, any[]>>((acc, sub) => {
    const month = new Date(sub.subscribedAt).toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    });
    if (!acc[month]) acc[month] = [];
    acc[month].unshift(sub);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between pb-6 border-b border-border/50">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Liste de diffusion
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">Newsletter</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border/50 bg-card text-sm font-semibold tabular-nums">
            <Users className="h-3.5 w-3.5 text-muted-foreground" />
            {subscribers.length} abonné{subscribers.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Empty state */}
      {subscribers.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-border/50 rounded-2xl">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-border/50 bg-muted/30 mb-4">
            <Mail className="h-6 w-6 text-muted-foreground/40" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Aucun abonné pour le moment.
          </p>
        </div>
      )}

      {/* Subscriber list grouped by month */}
      {subscribers.length > 0 && (
        <div className="space-y-8">
          {Object.entries(grouped).map(([month, subs]) => (
            <div key={month}>
              <div className="flex items-center gap-3 mb-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/60">
                  {month}
                </p>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground/70">
                  {subs.length}
                </span>
              </div>

              <div className="rounded-2xl border border-border/40 overflow-hidden divide-y divide-border/30">
                {subs.map((sub, i) => (
                  <div
                    key={sub.id}
                    className="group flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-muted/20 transition-colors"
                  >
                    {/* Position + Email */}
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-[10px] tabular-nums text-muted-foreground/30 w-5 shrink-0 text-right font-mono">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold border border-border/40 shrink-0">
                        {sub.email.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-sm font-medium truncate">{sub.email}</p>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground/50 shrink-0">
                      <Clock className="h-3 w-3" />
                      {new Date(sub.subscribedAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
