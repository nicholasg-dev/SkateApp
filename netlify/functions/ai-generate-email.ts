import type { Context } from "@netlify/functions";

const DASHSCOPE_BASE_URL =
    process.env.DASHSCOPE_BASE_URL ||
    "https://dashscope-intl.aliyuncs.com/compatible-mode/v1";

const QWEN_MODEL = process.env.QWEN_MODEL || "qwen-flash";

export default async (req: Request, _context: Context) => {
    if (req.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const { date, time, location, maxPlayers, maxGoalies } = await req.json();

        const prompt = `Write a high-energy, fun, and concise email invitation for a hockey drop-in scrimmage.
Use hockey slang (chirps, celly, dangles) but keep it readable.

Details:
- Date: ${date}
- Time: ${time}
- Rink: ${location}
- Max Skater Spots: ${maxPlayers}
- Max Goalie Spots: ${maxGoalies || 2}

The call to action is to reply or click the link to claim a spot.
Keep it under 150 words.`;

        const response = await fetch(`${DASHSCOPE_BASE_URL}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.DASHSCOPE_API_KEY}`,
            },
            body: JSON.stringify({
                model: QWEN_MODEL,
                messages: [{ role: "user", content: prompt }],
                max_tokens: 512,
            }),
        });

        if (!response.ok) {
            const errBody = await response.text();
            throw new Error(`DashScope API error ${response.status}: ${errBody}`);
        }

        const data = await response.json();
        const text =
            data.choices?.[0]?.message?.content ||
            "Hey team, Sk8 is on this week! Please RSVP.";

        return new Response(JSON.stringify({ text }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Qwen email generation error:", error);
        return new Response(
            JSON.stringify({
                text: "Hey team, Sk8 is on this week! Please RSVP.",
                error: "AI generation failed, using fallback.",
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
};
