import { GoogleGenAI, Type } from "@google/genai";
import { Player, SessionConfig } from "../types";

export const generateInviteEmail = async (config: SessionConfig): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `
      Write a high-energy, fun, and concise email invitation for a hockey drop-in scrimmage.
      Use hockey slang (chirps, celly, dangles) but keep it readable.
      
      Details:
      - Date: ${config.date}
      - Time: ${config.time}
      - Rink: ${config.location}
      - Max Spots: ${config.maxPlayers}
      
      The call to action is to reply or click the link to claim a spot.
      Keep it under 150 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Could not generate email. Please try again.";
  } catch (error) {
    console.error("Error generating invite:", error);
    return "Hey team, Sk8 is on this week! Please RSVP.";
  }
};

export const balanceTeams = async (players: Player[]): Promise<{ white: string[], dark: string[] }> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const playerListString = players.map(p => `- ${p.name} (Skill: ${p.skillLevel}/10, Pos: ${p.position})`).join('\n');
    
    const prompt = `
      I have a list of hockey players. Please split them into two balanced teams: "Team White" and "Team Dark".
      Try to balance the total skill level and positions (ensure goalies are split if possible).
      
      Players:
      ${playerListString}
      
      Return ONLY valid JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            white: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of player names for Team White"
            },
            dark: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "List of player names for Team Dark"
            }
          },
          required: ["white", "dark"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Error balancing teams:", error);
    // Fallback: simple split
    const midpoint = Math.ceil(players.length / 2);
    return {
      white: players.slice(0, midpoint).map(p => p.name),
      dark: players.slice(midpoint).map(p => p.name)
    };
  }
};