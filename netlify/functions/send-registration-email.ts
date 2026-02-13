import type { Handler, HandlerEvent } from "@netlify/functions";
import { Resend } from "resend";
import { buildRegistrationEmail } from "./_shared/email-templates";

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
    if (!process.env.RESEND_API_KEY || !process.env.FROM_EMAIL) {
        console.error("Missing RESEND_API_KEY or FROM_EMAIL environment variables");
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Email service not configured" }),
        };
    }

    // Parse request body
    let payload: { name?: string; email?: string; position?: string; role?: string };
    try {
        payload = JSON.parse(event.body || "{}");
    } catch {
        return {
            statusCode: 400,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Invalid JSON body" }),
        };
    }

    const { name, email, position, role } = payload;

    if (!name || !email) {
        return {
            statusCode: 400,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Missing required fields: name, email" }),
        };
    }

    // Send registration confirmation email
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        const { data, error } = await resend.emails.send({
            from: process.env.FROM_EMAIL,
            to: email,
            subject: "🏒 Welcome to SkateApp — Registration Confirmed!",
            html: buildRegistrationEmail(name, position || "Forward", role || "Sub"),
        });

        if (error) {
            console.error("Resend API error:", error);
            return {
                statusCode: 500,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ error: "Failed to send email", details: error.message }),
            };
        }

        console.log(`Registration email sent to ${email}, id: ${data?.id}`);

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ success: true, emailId: data?.id }),
        };
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Unknown error";
        console.error("Unexpected error sending registration email:", message);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: "Internal server error" }),
        };
    }
};

export { handler };
