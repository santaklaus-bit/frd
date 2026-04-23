import { getAnalyticsData } from "@/lib/analytics";
import {
    TrafficChart,
    UsersChart,
    SourcesChart,
    DevicesChart,
    TopPagesTable,
} from "@/components/admin/analytics-charts";
import {
    Eye,
    Users,
    MousePointerClick,
    Clock,
    TrendingUp,
    TrendingDown,
} from "lucide-react";

export const dynamic = "force-dynamic";

function Delta({ value }: { value: number }) {
    const positive = value >= 0;
    return (
        <span
            className={`inline-flex items-center gap-0.5 text-xs font-medium ${positive ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"
                }`}
        >
            {positive ? (
                <TrendingUp className="h-3 w-3" />
            ) : (
                <TrendingDown className="h-3 w-3" />
            )}
            {positive ? "+" : ""}
            {value}%
        </span>
    );
}

export default async function AnalyticsPage() {
    const data = await getAnalyticsData();

    const kpis = [
        {
            label: "Pages vues",
            value: data.totalPageviews.toLocaleString("fr-FR"),
            icon: Eye,
            delta: data.pageviewsDelta,
        },
        {
            label: "Sessions",
            value: data.totalSessions.toLocaleString("fr-FR"),
            icon: MousePointerClick,
            delta: data.sessionsDelta,
        },
        {
            label: "Visiteurs uniques",
            value: data.totalUsers.toLocaleString("fr-FR"),
            icon: Users,
            delta: data.usersDelta,
        },
        {
            label: "Durée moy.",
            value: data.avgSessionDuration,
            icon: Clock,
            delta: null,
        },
    ];

    return (
        <div className="space-y-10">
      {/* Header */}
      <div className="flex items-end justify-between pb-6 border-b border-border/50">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Statistiques
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">Analytics</h1>
        </div>
        <p className="text-xs text-muted-foreground/60 tabular-nums">
          30 derniers jours
          {data.isDemo && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 text-[10px] font-semibold">
              Démo
            </span>
          )}
        </p>
      </div>

      {data.isDemo && (
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 dark:border-amber-900/50 dark:bg-amber-950/20 text-amber-800 dark:text-amber-200 text-sm flex items-start gap-3">
          <div className="mt-0.5 p-1 rounded-md bg-amber-100 dark:bg-amber-900/50">
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <p className="font-semibold">Mode Démonstration Actif</p>
            <p className="text-xs opacity-80 leading-relaxed">
              Les données affichées ci-dessous sont des données de démonstration car la connexion à Google Analytics 4 n'est pas configurée. 
              Vérifiez que les variables <code className="bg-amber-100/50 dark:bg-amber-900/30 px-1 rounded">GA_PROPERTY_ID</code>, 
              <code className="bg-amber-100/50 dark:bg-amber-900/30 px-1 rounded">GA_CLIENT_EMAIL</code>, 
              <code className="bg-amber-100/50 dark:bg-amber-900/30 px-1 rounded">GA_PRIVATE_KEY</code> et 
              <code className="bg-amber-100/50 dark:bg-amber-900/30 px-1 rounded">NEXT_PUBLIC_GA_MEASUREMENT_ID</code> sont correctement définies dans votre fichier <code className="bg-amber-100/50 dark:bg-amber-900/30 px-1 rounded">.env</code>.
            </p>
          </div>
        </div>
      )}

            {/* KPI cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {kpis.map((kpi) => (
                    <div
                        key={kpi.label}
                        className="border border-border/50 rounded-xl p-5 bg-card space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <div className="inline-flex items-center justify-center w-8 h-8 border border-border/60 rounded-lg text-muted-foreground">
                                <kpi.icon className="h-4 w-4" />
                            </div>
                            {kpi.delta !== null && <Delta value={kpi.delta} />}
                        </div>
                        <div>
                            <p className="text-2xl font-semibold tracking-tight tabular-nums">
                                {kpi.value}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5 font-medium">
                                {kpi.label}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main chart — Traffic */}
            <div className="border border-border/50 rounded-xl bg-card">
                <div className="px-6 pt-6 pb-4 border-b border-border/50 flex items-center justify-between">
                    <div>
                        <h2 className="text-sm font-semibold tracking-tight">
                            Trafic — 30 derniers jours
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Pages vues et sessions
                        </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                            <span className="w-4 h-px bg-foreground inline-block" />
                            Pages vues
                        </span>
                        <span className="flex items-center gap-1.5">
                            <span className="w-4 h-px bg-muted-foreground border-dashed border-t-2 border-muted-foreground inline-block" />
                            Sessions
                        </span>
                    </div>
                </div>
                <div className="p-6">
                    <TrafficChart data={data.dailyMetrics} />
                </div>
            </div>

            {/* Second row: Visiteurs + Sources */}
            <div className="grid lg:grid-cols-3 gap-4">
                {/* Users chart */}
                <div className="lg:col-span-2 border border-border/50 rounded-xl bg-card">
                    <div className="px-6 pt-6 pb-4 border-b border-border/50">
                        <h2 className="text-sm font-semibold tracking-tight">
                            Visiteurs uniques
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Par jour sur 30 jours
                        </p>
                    </div>
                    <div className="p-6">
                        <UsersChart data={data.dailyMetrics} />
                    </div>
                </div>

                {/* Traffic sources */}
                <div className="border border-border/50 rounded-xl bg-card">
                    <div className="px-6 pt-6 pb-4 border-b border-border/50">
                        <h2 className="text-sm font-semibold tracking-tight">
                            Sources de trafic
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Répartition des sessions
                        </p>
                    </div>
                    <div className="p-6">
                        <SourcesChart data={data.trafficSources} />
                    </div>
                </div>
            </div>

            {/* Third row: Top pages + Devices */}
            <div className="grid lg:grid-cols-3 gap-4">
                {/* Top pages */}
                <div className="lg:col-span-2 border border-border/50 rounded-xl bg-card">
                    <div className="px-6 pt-6 pb-4 border-b border-border/50 flex items-center justify-between">
                        <div>
                            <h2 className="text-sm font-semibold tracking-tight">
                                Pages les plus vues
                            </h2>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                Classées par nombre de pages vues
                            </p>
                        </div>
                    </div>
                    <div className="px-6 py-2">
                        <TopPagesTable data={data.topPages} />
                    </div>
                </div>

                {/* Devices */}
                <div className="border border-border/50 rounded-xl bg-card">
                    <div className="px-6 pt-6 pb-4 border-b border-border/50">
                        <h2 className="text-sm font-semibold tracking-tight">Appareils</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Répartition par type
                        </p>
                    </div>
                    <div className="p-6 space-y-6">
                        <DevicesChart data={data.deviceSplit} />

                        {/* Bounce rate */}
                        <div className="pt-4 border-t border-border/50">
                            <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-muted-foreground">Taux de rebond</span>
                                <span className="font-semibold tabular-nums">
                                    {data.avgBounceRate}%
                                </span>
                            </div>
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-foreground"
                                    style={{ width: `${data.avgBounceRate}%` }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
}
