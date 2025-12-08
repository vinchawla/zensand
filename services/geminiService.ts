import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

let genAI: GoogleGenAI | null = null;

const getGenAI = (): GoogleGenAI => {
  if (!genAI) {
    // Note: In a production environment, you should proxy this request 
    // or use a secure way to inject the key.
    // For this demo, we assume process.env.API_KEY is available.
    if (!process.env.API_KEY) {
      console.warn("API_KEY not found in environment variables");
    }
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }
  return genAI;
};

export const generateZenResponse = async (
  prompt: string, 
  history: string[] = []
): Promise<string> => {
  try {
    const ai = getGenAI();
    
    // Construct a context-aware prompt
    const systemInstruction = `You are a wise, calm, and minimalistic Zen Master. 
    You help the user meditate and reflect on their garden. 
    Keep your answers short, poetic (sometimes Haiku), and soothing. 
    Do not be overly verbose. Focus on themes of peace, nature, and mindfulness.`;

    const model = 'gemini-2.5-flash';
    
    // Using simple generateContent for single-turn logic for simplicity in this context,
    // but building a chat string manually to maintain minimal "history" context if needed,
    // or we could use ai.chats.create() for a full session.
    // Let's use chat session for better flow.

    const chat = ai.chats.create({
        model,
        config: { systemInstruction },
        history: history.map((msg, i) => ({
            role: i % 2 === 0 ? 'user' : 'model',
            parts: [{ text: msg }]
        }))
    });

    const response: GenerateContentResponse = await chat.sendMessage({
      message: prompt
    });

    return response.text || "Breathe in... Breathe out...";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The wind whispers, but I cannot hear it right now. (Check API Key)";
  }
};
