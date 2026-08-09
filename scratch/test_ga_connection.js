const { BetaAnalyticsDataClient } = require('@google-analytics/data');
const dotenv = require('dotenv');
dotenv.config();

async function testGA() {
    const propertyId = process.env.GA_PROPERTY_ID;
    const clientEmail = process.env.GA_CLIENT_EMAIL;
    const privateKey = process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n');

    console.log("Testing GA Connection...");
    console.log("Property ID:", propertyId);
    console.log("Client Email:", clientEmail);

    if (!propertyId || !clientEmail || !privateKey) {
        console.error("Missing environment variables!");
        return;
    }

    try {
        const client = new BetaAnalyticsDataClient({
            credentials: {
                client_email: clientEmail,
                private_key: privateKey,
            },
        });

        console.log("Running report...");
        const [response] = await client.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
            metrics: [{ name: 'activeUsers' }],
            dimensions: [{ name: 'date' }],
        });

        console.log("Success! Active users found:", response.rowCount);
        if (response.rows) {
            response.rows.forEach(row => {
                console.log(`${row.dimensionValues[0].value}: ${row.metricValues[0].value}`);
            });
        }
    } catch (e) {
        console.error("GA Fetch Error Details:");
        console.error("Code:", e.code);
        console.error("Message:", e.message);
        console.error("Details:", e.details);
    }
}

testGA();
