import { GoogleGenAI, Type } from "@google/genai";
import { Quote } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const FALLBACK_QUOTES: Quote[] = [
  { text: "The cost of procrastination is the life you could have lived." },
  { text: "Scrolling is the new smoking. It comforts you while it kills your dreams." },
  { text: "Every minute you spend watching others live their lives is a minute you lost living yours." },
  { text: "Discipline is choosing what you want most over what you want now." },
  { text: "You are not the customer of social media, you are the product." },
  { text: "Focus is the new currency. Do not give yours away for free." },
  { text: "Comfort is the enemy of achievement." }
];

export const fetchHarshQuotes = async (count: number): Promise<Quote[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Generate ${count} harsh, reality-check quotes about social media addiction, wasted potential, and discipline. The tone should be strict, brutally honest, and triggering to someone trying to quit an addiction. Do not include quotes about 'hope' or 'love'. Focus on 'regret', 'time wasting', and 'mediocrity'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              text: {
                type: Type.STRING,
              }
            },
            required: ["text"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    // Ensure we return the requested number, filling with fallbacks if necessary
    const fetchedQuotes = data.map((q: any) => ({ text: q.text }));
    
    if (fetchedQuotes.length < count) {
       return [...fetchedQuotes, ...FALLBACK_QUOTES.slice(0, count - fetchedQuotes.length)];
    }
    
    return fetchedQuotes.slice(0, count);

  } catch (error) {
    console.error("Failed to fetch quotes from Gemini:", error);
    // Return fallback quotes on error
    return FALLBACK_QUOTES.slice(0, count);
  }
};