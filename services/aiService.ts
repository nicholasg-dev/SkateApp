import { Player, SessionConfig } from "../types";

/**
 * Client-side AI service that proxies requests through Netlify Functions
 * to AWS Bedrock. No AWS credentials are exposed to the browser.
 */

export const generateInviteEmail = async (config: SessionConfig): Promise<string> => {
    try {
        const response = await fetch("/.netlify/functions/ai-generate-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                date: config.date,
                time: config.time,
                location: config.location,
                maxPlayers: config.maxPlayers,
                maxGoalies: config.maxGoalies,
            }),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        return data.text || "Hey team, Sk8 is on this week! Please RSVP.";
    } catch (error) {
        console.error("Error generating invite:", error);
        return "Hey team, Sk8 is on this week! Please RSVP.";
    }
};

export const balanceTeams = async (players: Player[]): Promise<{ white: string[]; dark: string[] }> => {
    try {
        const response = await fetch("/.netlify/functions/ai-balance-teams", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                players: players.map((p) => ({
                    name: p.name,
                    skillLevel: p.skillLevel,
                    position: p.position,
                })),
            }),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        return { white: data.white, dark: data.dark };
    } catch (error) {
        console.error("Error balancing teams:", error);
        // Fallback: simple split
        const midpoint = Math.ceil(players.length / 2);
        return {
            white: players.slice(0, midpoint).map((p) => p.name),
            dark: players.slice(midpoint).map((p) => p.name),
        };
    }
};
