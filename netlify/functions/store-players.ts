import { getStore } from "@netlify/blobs";
import type { Handler } from "@netlify/functions";

export const handler: Handler = async (event, context) => {
    // Use 'roster' store to persist player data
    const store = getStore("roster");

    try {
        if (event.httpMethod === "GET") {
            const data = await store.get("players", { type: "json" });
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data || null), // Return null if not found
            };
        }

        if (event.httpMethod === "POST") {
            // Basic security: require a valid JSON body
            if (!event.body) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: "Missing body" }),
                };
            }

            const players = JSON.parse(event.body);

            // Save to blob store
            await store.setJSON("players", players);

            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ success: true }),
            };
        }

        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Method Not Allowed" }),
        };
    } catch (error) {
        console.error("Blob operation failed:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" }),
        };
    }
};
