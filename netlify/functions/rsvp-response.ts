import { getStore } from "@netlify/blobs";
import type { Handler, HandlerEvent } from "@netlify/functions";

interface RsvpPayload {
    email?: string;
    status?: "ACCEPTED" | "DECLINED";
}

/**
 * Serverless function to handle RSVP responses from email links.
 *
 * GET  ?email=...            → returns player info + current status
 * POST { email, status }     → updates player RSVP status in blob store
 */
export const handler: Handler = async (event: HandlerEvent) => {
    const headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    };

    // Handle CORS preflight
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 204, headers, body: "" };
    }

    // Load players from blob
    let players: any[];
    let store: any;
    try {
        store = getStore({ name: "roster", consistency: "strong" });
        const raw = await store.get("players", { type: "text" });
        if (!raw) {
            console.warn("Roster blob not found or empty");
            // If store exists but is empty, try to return empty array or handle gracefully?
            // For RSVP, if there are no players, we can't really RSVP.
            return {
                statusCode: 404, // Not Found is more appropriate if the list itself is empty
                headers,
                body: JSON.stringify({ error: "Roster is empty or not initialized" }),
            };
        }
        players = JSON.parse(raw);
        if (!Array.isArray(players)) {
            console.error("Invalid roster data format");
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: "Invalid roster data" }),
            };
        }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("Failed to load roster (Blob Store error):", message);
        console.error("Environment Context:", {
            hasSiteId: !!process.env.NETLIFY_SITE_ID,
            hasToken: !!process.env.NETLIFY_AUTH_TOKEN,
            blobsContext: !!process.env.NETLIFY_BLOBS_CONTEXT,
        });

        // Critical: If Blob store isn't configured, we can't RSVP.
        return {
            statusCode: 503,
            headers,
            body: JSON.stringify({
                error: "Service unavailable: Blob storage not configured. Please contact admin.",
                details: message
            }),
        };
    }

    // GET — look up player by email and return their info
    if (event.httpMethod === "GET") {
        const email = event.queryStringParameters?.email;
        if (!email) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Missing email parameter" }),
            };
        }

        const player = players.find(
            (p) => p.email.toLowerCase() === email.toLowerCase()
        );

        if (!player) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: "Player not found on roster" }),
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                id: player.id,
                name: player.name,
                email: player.email,
                position: player.position,
                status: player.status,
            }),
        };
    }

    // POST — update player RSVP status
    if (event.httpMethod === "POST") {
        let payload: RsvpPayload;
        try {
            payload = JSON.parse(event.body || "{}");
        } catch {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Invalid JSON body" }),
            };
        }

        const { email, status } = payload;

        if (!email || !status) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: "Missing email or status" }),
            };
        }

        if (!["ACCEPTED", "DECLINED"].includes(status)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: "Status must be ACCEPTED or DECLINED",
                }),
            };
        }

        const playerIndex = players.findIndex(
            (p) => p.email.toLowerCase() === email.toLowerCase()
        );

        if (playerIndex === -1) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: "Player not found on roster" }),
            };
        }

        // Update status
        players[playerIndex].status = status;

        // Save back to blob
        try {
            await store.set("players", JSON.stringify(players));
            console.log(
                `RSVP updated: ${players[playerIndex].name} → ${status}`
            );
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Unknown error";
            console.error("Failed to save RSVP:", message);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: "Failed to save response" }),
            };
        }

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                name: players[playerIndex].name,
                status,
            }),
        };
    }

    return {
        statusCode: 405,
        headers,
        body: JSON.stringify({ error: "Method Not Allowed" }),
    };
};
