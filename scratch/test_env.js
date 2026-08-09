const dotenv = require('dotenv');
dotenv.config();

function testEnv() {
    const propertyId = process.env.GA_PROPERTY_ID;
    const clientEmail = process.env.GA_CLIENT_EMAIL;
    const rawKey = process.env.GA_PRIVATE_KEY;
    const privateKey = rawKey?.replace(/\\n/g, '\n');

    console.log("Property ID:", propertyId);
    console.log("Client Email:", clientEmail);
    console.log("Raw Key Starts With:", rawKey?.substring(0, 30));
    console.log("Raw Key Ends With:", rawKey?.substring(rawKey?.length - 30));
    console.log("Private Key Includes \\n (literal):", rawKey?.includes("\\n"));
    console.log("Private Key Includes \\n (actual):", privateKey?.includes("\n"));
    
    if (rawKey && rawKey.startsWith('"') && rawKey.endsWith('"')) {
        console.log("WARNING: Key is surrounded by double quotes!");
    }
}

testEnv();
