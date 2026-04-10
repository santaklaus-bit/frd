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
}

// ---------------------------------------------------------------------------
// Mock data — Fallback
// ---------------------------------------------------------------------------

function getMockAnalyticsData(): AnalyticsData {
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
    };
}

// ---------------------------------------------------------------------------
// Real GA4 Integration
// ---------------------------------------------------------------------------

async function fetchFromGoogleAnalytics(): Promise<AnalyticsData | null> {
    const propertyId = process.env.GA_PROPERTY_ID;
    const clientEmail = process.env.GA_CLIENT_EMAIL;
    let privateKey = process.env.GA_PRIVATE_KEY;

    // Verbose debug only for configuration check
    console.log("Analytics: Starting fetch...");
    if (!propertyId) console.warn("Analytics: GA_PROPERTY_ID is missing.");
    if (!clientEmail) console.warn("Analytics: GA_CLIENT_EMAIL is missing.");
    if (!privateKey) console.warn("Analytics: GA_PRIVATE_KEY is missing.");

    if (!propertyId || !clientEmail || !privateKey) {
        return null;
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

        // Current 30 days and Previous 30 days for deltas
        const [response] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [
                { startDate: '30daysAgo', endDate: 'today' },
                { startDate: '60daysAgo', endDate: '31daysAgo' },
            ],
            metrics: [
                { name: 'screenPageViews' },
                { name: 'sessions' },
                { name: 'activeUsers' },
                { name: 'bounceRate' },
                { name: 'averageSessionDuration' },
            ],
            dimensions: [
                { name: 'date' },
            ],
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

        // Parse Main KPIs
        let totalPageviews = 0;
        let totalSessions = 0;
        let totalUsers = 0;
        let avgBounceRate = 0;
        let avgSessionDurationSec = 0;

        let prevPageviews = 0;
        let prevSessions = 0;
        let prevUsers = 0;

        const dailyMap = new Map<string, DailyMetric>();

        response.rows?.forEach((row: any) => {
            const dateStr = row.dimensionValues?.[0]?.value || "";
            const formattedDate = `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
            const isCurrentPeriod = dateStr >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().replace(/-/g, '').substring(0, 8); // approximate

            // Actually, we should check which date range this row belongs to. 
            // In GA4 reports with multiple date ranges, date range is a dimension by default or it aggregates.
            // Since we queried 'date' dimension, we get rows for each date.
            // We just need to check if the date is within the last 30 days.
        });

        // Let's simplify and make two separate calls for total metrics to safely compare ranges without complex date parsing
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

        // Helper to get metric for a dimension range
        const getMetric = (rangeName: string, metricIndex: number) => {
            const row = kpiResponse.rows?.find((r: any) => r.dimensionValues?.[0]?.value === rangeName);
            return row ? parseFloat(row.metricValues?.[metricIndex]?.value || '0') : 0;
        };

        totalPageviews = getMetric('current', 0);
        totalSessions = getMetric('current', 1);
        totalUsers = getMetric('current', 2);
        avgBounceRate = Math.round(getMetric('current', 3) * 1000) / 10; // convert to percentage
        avgSessionDurationSec = getMetric('current', 4);

        prevPageviews = getMetric('previous', 0);
        prevSessions = getMetric('previous', 1);
        prevUsers = getMetric('previous', 2);

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
            source: s.source,
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
            device: d.device,
            users: d.users,
            percentage: totalDeviceUsers > 0 ? Math.round((d.users / totalDeviceUsers) * 1000) / 10 : 0
        }));

        return {
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
        };
    } catch (e) {
        console.error("Error fetching Google Analytics data:", e);
        return null;
    }
}

/**
 * Entry-point used by the analytics page server component.
 */
export async function getAnalyticsData(): Promise<AnalyticsData> {
    const realData = await fetchFromGoogleAnalytics();
    if (realData) {
        return realData;
    }
    return getMockAnalyticsData();
}
