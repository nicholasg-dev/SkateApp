import type { Handler, HandlerEvent } from "@netlify/functions";
import { Resend } from "resend";
import { buildAnnouncementEmail } from "./_shared/email-templates";

interface Recipient {
    email: string;
    name: string;
}

interface AnnouncementPayload {
    secret?: string;
    sessionDate?: string;
    sessionTime?: string;
    location?: string;
    maxPlayers?: number;
    inviteMessage?: string;
    recipients?: Recipient[];
}

const BATCH_SIZE = 100; // Resend batch limit

const handler: Handler = async (event: HandlerEvent) => {
    // Only allow POST
    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Method Not Allowed" }),
        };
    }

    // Validate environment
    if (!process.env.RESEND_API_KEY || !process.env.FROM_EMAIL || !process.env.ADMIN_SECRET) {
        console.error("Missing required environment variables (RESEND_API_KEY, FROM_EMAIL, ADMIN_SECRET)");
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Email service not configured" }),
        };
    }

    // Parse request body
    let payload: AnnouncementPayload;
    try {
        payload = JSON.parse(event.body || "{}");
    } catch {
        return {
            statusCode: 400,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Invalid JSON body" }),
        };
    }

    const { secret, sessionDate, sessionTime, location, maxPlayers, inviteMessage, recipients } = payload;

    // Authenticate — only admins can send bulk emails
    if (secret !== process.env.ADMIN_SECRET) {
        return {
            statusCode: 403,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Unauthorized: invalid admin secret" }),
        };
    }

    // Validate required fields
    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
        return {
            statusCode: 400,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "No recipients provided" }),
        };
    }

    if (!sessionDate || !sessionTime || !location) {
        return {
            statusCode: 400,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Missing session details (date, time, location)" }),
        };
    }

    // Build individual emails for each recipient (personalized with their name)
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        const allEmails = recipients.map((r) => ({
            from: process.env.FROM_EMAIL!,
            to: r.email,
            subject: `🏒 Sk8 This Week — ${sessionDate}`,
            html: buildAnnouncementEmail(
                r.name,
                sessionDate,
                sessionTime,
                location,
                maxPlayers || 22,
                inviteMessage || ""
            ),
        }));

        // Send in batches of BATCH_SIZE (Resend supports up to 100 per batch call)
        let totalSent = 0;
        const errors: string[] = [];

        for (let i = 0; i < allEmails.length; i += BATCH_SIZE) {
            const batch = allEmails.slice(i, i + BATCH_SIZE);

            try {
                const { data, error } = await resend.batch.send(batch);

                if (error) {
                    console.error(`Batch ${i / BATCH_SIZE + 1} error:`, error);
                    errors.push(`Batch ${i / BATCH_SIZE + 1}: ${error.message}`);
                } else {
                    totalSent += batch.length;
                    console.log(`Batch ${i / BATCH_SIZE + 1} sent successfully (${batch.length} emails), ids:`, data);
                }
            } catch (batchErr: unknown) {
                const msg = batchErr instanceof Error ? batchErr.message : "Unknown batch error";
                console.error(`Batch ${i / BATCH_SIZE + 1} exception:`, msg);
                errors.push(`Batch ${i / BATCH_SIZE + 1}: ${msg}`);
            }
        }

        const response: Record<string, unknown> = {
            success: errors.length === 0,
            totalRecipients: recipients.length,
            totalSent,
        };

        if (errors.length > 0) {
            response.errors = errors;
        }

        console.log(`Weekly announcement complete: ${totalSent}/${recipients.length} sent`);

        return {
            statusCode: errors.length === 0 ? 200 : 207, // 207 = Multi-Status (partial success)
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
        };
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("Unexpected error sending weekly announcement:", message);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Internal server error" }),
        };
    }
};

export { handler };
