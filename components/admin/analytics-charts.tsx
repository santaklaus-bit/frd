"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend,
} from "recharts";
import type { DailyMetric, TopPage, TrafficSource, DeviceSplit } from "@/lib/analytics";

// ─── Shared tooltip style ───────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-card border border-border/60 rounded-xl px-4 py-3 shadow-md text-sm">
            <p className="text-xs text-muted-foreground mb-2 font-medium">{label}</p>
            {payload.map((p: any) => (
                <div key={p.name} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                    <span className="text-muted-foreground text-xs">{p.name}</span>
                    <span className="font-semibold ml-auto">{p.value.toLocaleString()}</span>
                </div>
            ))}
        </div>
    );
}

// ─── Area chart — sessions / pageviews ──────────────────────────────────────

export function TrafficChart({ data }: { data: DailyMetric[] }) {
    const formatted = data.map((d) => ({
        ...d,
        date: new Date(d.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
    }));

    return (
        <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={formatted} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="gradPageviews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-foreground)" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="var(--color-foreground)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gradSessions" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-muted-foreground)" stopOpacity={0.1} />
                        <stop offset="95%" stopColor="var(--color-muted-foreground)" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--color-border)" strokeOpacity={0.5} />
                <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                    interval={4}
                />
                <YAxis
                    tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                    type="monotone"
                    dataKey="pageviews"
                    name="Pages vues"
                    stroke="var(--color-foreground)"
                    strokeWidth={1.5}
                    fill="url(#gradPageviews)"
                    dot={false}
                />
                <Area
                    type="monotone"
                    dataKey="sessions"
                    name="Sessions"
                    stroke="var(--color-muted-foreground)"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fill="url(#gradSessions)"
                    dot={false}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}

// ─── Bar chart — users per day ───────────────────────────────────────────────

export function UsersChart({ data }: { data: DailyMetric[] }) {
    const formatted = data.map((d) => ({
        ...d,
        date: new Date(d.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }),
    }));

    return (
        <ResponsiveContainer width="100%" height={200}>
            <BarChart data={formatted} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="var(--color-border)" strokeOpacity={0.5} />
                <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                    interval={4}
                />
                <YAxis
                    tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
                    axisLine={false}
                    tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                    dataKey="users"
                    name="Visiteurs"
                    fill="var(--color-foreground)"
                    radius={[3, 3, 0, 0]}
                    fillOpacity={0.85}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

// ─── Donut chart — traffic sources ──────────────────────────────────────────

const SOURCE_COLORS = ["var(--color-foreground)", "#6b7280", "#9ca3af", "#d1d5db"];

export function SourcesChart({ data }: { data: TrafficSource[] }) {
    return (
        <div className="flex items-center gap-6">
            <ResponsiveContainer width={140} height={140}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="sessions"
                        nameKey="source"
                        cx="50%"
                        cy="50%"
                        innerRadius={44}
                        outerRadius={64}
                        strokeWidth={0}
                    >
                        {data.map((_, i) => (
                            <Cell key={i} fill={SOURCE_COLORS[i % SOURCE_COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2.5">
                {data.map((s, i) => (
                    <div key={s.source} className="flex items-center gap-2.5">
                        <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ background: SOURCE_COLORS[i % SOURCE_COLORS.length] }}
                        />
                        <span className="text-xs text-muted-foreground flex-1 truncate">{s.source}</span>
                        <span className="text-xs font-semibold tabular-nums">{s.percentage}%</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Devices split ───────────────────────────────────────────────────────────

export function DevicesChart({ data }: { data: DeviceSplit[] }) {
    return (
        <div className="space-y-3">
            {data.map((d) => (
                <div key={d.device} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{d.device}</span>
                        <span className="font-semibold tabular-nums">{d.percentage}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-foreground rounded-full transition-all"
                            style={{ width: `${d.percentage}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── Top pages table ─────────────────────────────────────────────────────────

export function TopPagesTable({ data }: { data: TopPage[] }) {
    return (
        <div className="divide-y divide-border/50">
            {data.map((page, i) => (
                <div key={page.path} className="flex items-center gap-4 py-3 group">
                    <span className="text-xs tabular-nums text-muted-foreground/50 w-4 shrink-0">
                        {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium tracking-tight truncate">{page.title}</p>
                        <p className="text-xs text-muted-foreground font-mono truncate">{page.path}</p>
                    </div>
                    <div className="text-right shrink-0 space-y-0.5">
                        <p className="text-sm font-semibold tabular-nums">
                            {page.pageviews.toLocaleString("fr-FR")}
                        </p>
                        <p className="text-xs text-muted-foreground">{page.avgDuration} moy.</p>
                    </div>
                </div>
            ))}
        </div>
    );
}
