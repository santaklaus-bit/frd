import { BetaAnalyticsDataClient } from "@google-analytics/data";

/**
 * Analytics data layer
 *
 * Uses real Google Analytics 4 data if credentials are provided in the environment.
 * Otherwise, falls back to `getMockAnalyticsData()`.
 */

export interface DailyMetric {
    date: string; // "YYYY-MM-DD"
    sessions: number;
    pageviews: number;
    users: number;
}

export interface TopPage {
    path: string;
    title: string;
    pageviews: number;
    avgDuration: string; // "mm:ss"
    bounceRate: number; // 0–100
}

export interface TrafficSource {
    source: string;
    sessions: number;
    percentage: number;
}

export interface DeviceSplit {
    device: string;
    users: number;
    percentage: number;
}

export interface AnalyticsData {
    // KPI summary (last 30 days)
    totalPageviews: number;
    totalSessions: number;
    totalUsers: number;
    avgBounceRate: number; // 0–100
    avgSessionDuration: string; // "mm:ss"
    // Deltas vs previous period (%)
    pageviewsDelta: number;
    sessionsDelta: number;
    usersDelta: number;
    // Time series (last 30 days)
    dailyMetrics: DailyMetric[];
    // Breakdowns
    topPages: TopPage[];
    trafficSources: TrafficSource[];
    deviceSplit: DeviceSplit[];
    // Meta
    isDemo: boolean; // true when using mock data
    demoReason?: "not-configured" | "api-error"; // why we fell back to mock data
    demoDetails?: string; // human readable explanation (missing vars, API message…)
}

// ---------------------------------------------------------------------------
// Mock data — Fallback
// ---------------------------------------------------------------------------

function getMockAnalyticsData(
    reason: "not-configured" | "api-error" = "not-configured",
    details?: string
): AnalyticsData {
    const now = new Date();
    const dailyMetrics: DailyMetric[] = Array.from({ length: 30 }, (_, i) => {
        const d = new Date(now);
        d.setDate(d.getDate() - (29 - i));
        const base = 120 + Math.round(Math.sin(i * 0.4) * 40 + Math.random() * 60);
        return {
            date: d.toISOString().slice(0, 10),
            sessions: base,
            pageviews: Math.round(base * 1.7),
            users: Math.round(base * 0.85),
        };
    });

    return {
        totalPageviews: 8420,
        totalSessions: 4932,
        totalUsers: 3614,
        avgBounceRate: 42.3,
        avgSessionDuration: "2:14",
        pageviewsDelta: 12.4,
        sessionsDelta: 8.1,
        usersDelta: 15.6,
        dailyMetrics,
        topPages: [
            { path: "/", title: "Accueil", pageviews: 2341, avgDuration: "1:48", bounceRate: 38 },
            { path: "/blog", title: "Blog", pageviews: 1204, avgDuration: "2:32", bounceRate: 35 },
            { path: "/blog/entrepreneuriat-social", title: "Entrepreneuriat Social", pageviews: 876, avgDuration: "4:12", bounceRate: 22 },
            { path: "/expertise", title: "Expertise", pageviews: 743, avgDuration: "2:58", bounceRate: 40 },
            { path: "/projects", title: "Projets", pageviews: 612, avgDuration: "3:20", bounceRate: 31 },
            { path: "/blog/impact-local", title: "Impact Local", pageviews: 498, avgDuration: "5:01", bounceRate: 18 },
        ],
        trafficSources: [
            { source: "Recherche organique", sessions: 2210, percentage: 44.8 },
            { source: "Direct", sessions: 1340, percentage: 27.2 },
            { source: "Réseaux sociaux", sessions: 890, percentage: 18.1 },
            { source: "Référents", sessions: 492, percentage: 10.0 },
        ],
        deviceSplit: [
            { device: "Mobile", users: 1916, percentage: 53 },
            { device: "Desktop", users: 1445, percentage: 40 },
            { device: "Tablette", users: 253, percentage: 7 },
        ],
        isDemo: true,
        demoReason: reason,
        demoDetails: details,
    };
}

// ---------------------------------------------------------------------------
// Real GA4 Integration
// ---------------------------------------------------------------------------

/** GA4 returns raw values like "google / organic" or "(direct) / (none)". */
function prettifySource(raw: string): string {
    const value = (raw || "").toLowerCase();
    if (!value) return "Inconnu";
    if (value.startsWith("(direct)")) return "Direct";
    if (value.includes("organic")) return "Recherche organique";
    if (value.includes("referral")) return "Référents";
    if (value.includes("cpc") || value.includes("paid")) return "Publicité payante";
    if (value.includes("email")) return "Email";
    if (/facebook|linkedin|twitter|x\.com|instagram|tiktok|youtube|social/.test(value)) {
        return "Réseaux sociaux";
    }
    // "google / organic" → "Google"
    const source = raw.split("/")[0].trim();
    return source.charAt(0).toUpperCase() + source.slice(1);
}

function prettifyDevice(raw: string): string {
    switch ((raw || "").toLowerCase()) {
        case "mobile":
            return "Mobile";
        case "desktop":
            return "Desktop";
        case "tablet":
            return "Tablette";
        default:
            return raw || "Autre";
    }
}

type FetchResult =
    | { ok: true; data: AnalyticsData }
    | { ok: false; reason: "not-configured" | "api-error"; details: string };

async function fetchFromGoogleAnalytics(): Promise<FetchResult> {
    const propertyId = process.env.GA_PROPERTY_ID?.trim();
    const clientEmail = process.env.GA_CLIENT_EMAIL?.trim();
    let privateKey = process.env.GA_PRIVATE_KEY;

    const missing = [
        !propertyId && "GA_PROPERTY_ID",
        !clientEmail && "GA_CLIENT_EMAIL",
        !privateKey && "GA_PRIVATE_KEY",
    ].filter(Boolean) as string[];

    if (missing.length > 0 || !propertyId || !clientEmail || !privateKey) {
        console.warn(`Analytics: missing environment variables: ${missing.join(", ")}`);
        return {
            ok: false,
            reason: "not-configured",
            details: `Variables manquantes dans .env : ${missing.join(", ")}`,
        };
    }

    // Sanitize private key: remove quotes, fix newlines, trim
    privateKey = privateKey.trim();
    if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
        privateKey = privateKey.substring(1, privateKey.length - 1);
    }
    privateKey = privateKey.replace(/\\n/g, '\n');

    try {
        const client = new BetaAnalyticsDataClient({
            credentials: {
                client_email: clientEmail,
                private_key: privateKey,
            },
        });

        const [pageResponse] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
            metrics: [
                { name: 'screenPageViews' },
                { name: 'averageSessionDuration' },
                { name: 'bounceRate' },
            ],
            dimensions: [
                { name: 'pagePath' },
                { name: 'pageTitle' },
            ],
            orderBys: [
                {
                    metric: { metricName: 'screenPageViews' },
                    desc: true,
                },
            ],
            limit: 6,
        });

        const [sourceResponse] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
            metrics: [{ name: 'sessions' }],
            dimensions: [{ name: 'sessionSourceMedium' }],
            orderBys: [
                {
                    metric: { metricName: 'sessions' },
                    desc: true,
                },
            ],
            limit: 4,
        });

        const [deviceResponse] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
            metrics: [{ name: 'activeUsers' }],
            dimensions: [{ name: 'deviceCategory' }],
            orderBys: [
                {
                    metric: { metricName: 'activeUsers' },
                    desc: true,
                },
            ],
            limit: 3,
        });

        // Totals for the current and previous period, in a single report.
        // Multiple named date ranges expose a `dateRange` dimension we can filter on.
        const [kpiResponse] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [
                { name: 'current', startDate: '30daysAgo', endDate: 'today' },
                { name: 'previous', startDate: '60daysAgo', endDate: '31daysAgo' },
            ],
            metrics: [
                { name: 'screenPageViews' },
                { name: 'sessions' },
                { name: 'activeUsers' },
                { name: 'bounceRate' },
                { name: 'averageSessionDuration' },
            ],
        });

        // Helper to read a metric for a named date range.
        // The API labels rows with the range name, or `date_range_{index}` as a fallback.
        const getMetric = (rangeName: 'current' | 'previous', metricIndex: number) => {
            const fallbackName = rangeName === 'current' ? 'date_range_0' : 'date_range_1';
            const row = kpiResponse.rows?.find((r: any) => {
                const value = r.dimensionValues?.[0]?.value;
                return value === rangeName || value === fallbackName;
            });
            return row ? parseFloat(row.metricValues?.[metricIndex]?.value || '0') : 0;
        };

        const totalPageviews = getMetric('current', 0);
        const totalSessions = getMetric('current', 1);
        const totalUsers = getMetric('current', 2);
        const avgBounceRate = Math.round(getMetric('current', 3) * 1000) / 10; // ratio → percentage
        const avgSessionDurationSec = getMetric('current', 4);

        const prevPageviews = getMetric('previous', 0);
        const prevSessions = getMetric('previous', 1);
        const prevUsers = getMetric('previous', 2);

        const calcDelta = (current: number, previous: number) => {
            if (previous === 0) return 0;
            return Math.round(((current - previous) / previous) * 1000) / 10;
        };

        const formatDuration = (sec: number) => {
            const m = Math.floor(sec / 60);
            const s = Math.floor(sec % 60);
            return `${m}:${s.toString().padStart(2, '0')}`;
        };

        // Parse Daily Metrics (only current 30 days)
        const [dailyResponse] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
            metrics: [
                { name: 'sessions' },
                { name: 'screenPageViews' },
                { name: 'activeUsers' }
            ],
            dimensions: [{ name: 'date' }],
            orderBys: [{ dimension: { dimensionName: 'date' } }]
        });

        const dailyMetrics: DailyMetric[] = dailyResponse.rows?.map((row: any) => {
            const dateStr = row.dimensionValues?.[0]?.value || "";
            return {
                date: `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`,
                sessions: parseInt(row.metricValues?.[0]?.value || '0', 10),
                pageviews: parseInt(row.metricValues?.[1]?.value || '0', 10),
                users: parseInt(row.metricValues?.[2]?.value || '0', 10),
            };
        }) || [];

        // Parse Top Pages
        const topPages: TopPage[] = pageResponse.rows?.map((row: any) => {
            return {
                path: row.dimensionValues?.[0]?.value || "",
                title: row.dimensionValues?.[1]?.value || "",
                pageviews: parseInt(row.metricValues?.[0]?.value || '0', 10),
                avgDuration: formatDuration(parseFloat(row.metricValues?.[1]?.value || '0')),
                bounceRate: Math.round(parseFloat(row.metricValues?.[2]?.value || '0') * 1000) / 10,
            };
        }) || [];

        // Parse Traffic Sources
        let totalSourceSessions = 0;
        const rawSources = sourceResponse.rows?.map((row: any) => {
            const sessions = parseInt(row.metricValues?.[0]?.value || '0', 10);
            totalSourceSessions += sessions;
            return {
                source: row.dimensionValues?.[0]?.value || "",
                sessions
            };
        }) || [];

        const trafficSources: TrafficSource[] = rawSources.map((s: any) => ({
            source: prettifySource(s.source),
            sessions: s.sessions,
            percentage: totalSourceSessions > 0 ? Math.round((s.sessions / totalSourceSessions) * 1000) / 10 : 0
        }));

        // Parse Devices
        let totalDeviceUsers = 0;
        const rawDevices = deviceResponse.rows?.map((row: any) => {
            const users = parseInt(row.metricValues?.[0]?.value || '0', 10);
            totalDeviceUsers += users;
            return {
                device: row.dimensionValues?.[0]?.value || "",
                users
            };
        }) || [];

        const deviceSplit: DeviceSplit[] = rawDevices.map((d: any) => ({
            device: prettifyDevice(d.device),
            users: d.users,
            percentage: totalDeviceUsers > 0 ? Math.round((d.users / totalDeviceUsers) * 1000) / 10 : 0
        }));

        return {
            ok: true,
            data: {
                totalPageviews,
                totalSessions,
                totalUsers,
                avgBounceRate,
                avgSessionDuration: formatDuration(avgSessionDurationSec),
                pageviewsDelta: calcDelta(totalPageviews, prevPageviews),
                sessionsDelta: calcDelta(totalSessions, prevSessions),
                usersDelta: calcDelta(totalUsers, prevUsers),
                dailyMetrics,
                topPages,
                trafficSources,
                deviceSplit,
                isDemo: false,
            },
        };
    } catch (e) {
        console.error("Error fetching Google Analytics data:", e);
        return {
            ok: false,
            reason: "api-error",
            details: (e as Error)?.message || "Erreur inconnue de l'API Google Analytics.",
        };
    }
}

/**
 * Entry-point used by the analytics page server component.
 */
export async function getAnalyticsData(): Promise<AnalyticsData> {
    const result = await fetchFromGoogleAnalytics();
    if (result.ok) {
        return result.data;
    }
    return getMockAnalyticsData(result.reason, result.details);
}
