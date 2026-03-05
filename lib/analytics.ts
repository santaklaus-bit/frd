/**
 * Analytics data layer
 *
 * All data currently comes from `getMockAnalyticsData()` which mirrors
 * EXACTLY the shape returned by the Google Analytics Data API v1.
 *
 * To switch to real GA data, replace the body of `getAnalyticsData()` with
 * a call to the GA API using the `@google-analytics/data` SDK:
 *
 *   import { BetaAnalyticsDataClient } from "@google-analytics/data";
 *   const client = new BetaAnalyticsDataClient({ credentials: ... });
 *   const [response] = await client.runReport({ property: `properties/${GA_PROPERTY_ID}`, ... });
 *
 * The `AnalyticsData` type below maps 1-to-1 with GA4 metric dimensions.
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
// Mock data — replace getAnalyticsData() body to use real GA
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
        totalPageviews: 8_420,
        totalSessions: 4_932,
        totalUsers: 3_614,
        avgBounceRate: 42.3,
        avgSessionDuration: "2:14",
        pageviewsDelta: 12.4,
        sessionsDelta: 8.1,
        usersDelta: 15.6,
        dailyMetrics,
        topPages: [
            { path: "/", title: "Accueil", pageviews: 2_341, avgDuration: "1:48", bounceRate: 38 },
            { path: "/blog", title: "Blog", pageviews: 1_204, avgDuration: "2:32", bounceRate: 35 },
            { path: "/blog/entrepreneuriat-social", title: "Entrepreneuriat Social", pageviews: 876, avgDuration: "4:12", bounceRate: 22 },
            { path: "/initiatives", title: "Initiatives", pageviews: 743, avgDuration: "2:58", bounceRate: 40 },
            { path: "/production", title: "Production", pageviews: 612, avgDuration: "3:20", bounceRate: 31 },
            { path: "/blog/impact-local", title: "Impact Local", pageviews: 498, avgDuration: "5:01", bounceRate: 18 },
        ],
        trafficSources: [
            { source: "Recherche organique", sessions: 2_210, percentage: 44.8 },
            { source: "Direct", sessions: 1_340, percentage: 27.2 },
            { source: "Réseaux sociaux", sessions: 890, percentage: 18.1 },
            { source: "Référents", sessions: 492, percentage: 10.0 },
        ],
        deviceSplit: [
            { device: "Mobile", users: 1_916, percentage: 53 },
            { device: "Desktop", users: 1_445, percentage: 40 },
            { device: "Tablette", users: 253, percentage: 7 },
        ],
        isDemo: true,
    };
}

/**
 * Entry-point used by the analytics page server component.
 * Replace mock with real GA API call here.
 */
export async function getAnalyticsData(): Promise<AnalyticsData> {
    // TODO: replace with real GA API
    // const realData = await fetchFromGoogleAnalytics();
    // return { ...realData, isDemo: false };
    return getMockAnalyticsData();
}
