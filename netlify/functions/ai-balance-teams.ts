import type { Context } from "@netlify/functions";

const DASHSCOPE_BASE_URL =
    process.env.DASHSCOPE_BASE_URL ||
    "https://dashscope-intl.aliyuncs.com/compatible-mode/v1";

const QWEN_MODEL = process.env.QWEN_MODEL || "qwen-plus";

interface PlayerInput {
    name: string;
    skillLevel: number;
    position: string;
}

export default async (req: Request, _context: Context) => {
    if (req.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers: { "Content-Type": "application/json" },
        });
    }

    let players: PlayerInput[] = [];

    try {
        const body = await req.json();
        players = body.players || [];

        const playerListString = players
            .map((p) => `- ${p.name} (Skill: ${p.skillLevel}/10, Pos: ${p.position})`)
            .join("\n");

        const prompt = `I have a list of hockey players. Please split them into two balanced teams: "Team White" and "Team Dark".
Try to balance the total skill level and positions (ensure goalies are split if possible).

Players:
${playerListString}

Return ONLY valid JSON in this exact format, with no other text:
{"white": ["Player Name 1", "Player Name 2"], "dark": ["Player Name 3", "Player Name 4"]}`;

        const response = await fetch(`${DASHSCOPE_BASE_URL}/chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${process.env.DASHSCOPE_API_KEY}`,
            },
            body: JSON.stringify({
                model: QWEN_MODEL,
                messages: [{ role: "user", content: prompt }],
                max_tokens: 2048,
            }),
        });

        if (!response.ok) {
            const errBody = await response.text();
            throw new Error(`DashScope API error ${response.status}: ${errBody}`);
        }

        const data = await response.json();
        const text = data.choices?.[0]?.message?.content;

        if (!text) throw new Error("No response from Qwen");

        // Extract JSON from the response (model sometimes wraps it in markdown)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Could not parse JSON from response");

        const teams = JSON.parse(jsonMatch[0]);

        return new Response(JSON.stringify(teams), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Qwen team balance error:", error);

        // Fallback: simple alternating split
        const midpoint = Math.ceil(players.length / 2);
        return new Response(
            JSON.stringify({
                white: players.slice(0, midpoint).map((p) => p.name),
                dark: players.slice(midpoint).map((p) => p.name),
                error: "AI balancing failed, using simple split.",
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
};
