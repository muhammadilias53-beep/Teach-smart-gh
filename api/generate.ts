import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, contents, systemInstruction, responseMimeType, preferredModel } = req.body || {};
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini API key is not configured in server environment variables.' });
  }

  const candidateModels = preferredModel
    ? [preferredModel, 'gemini-2.5-flash', 'gemini-flash-latest', 'gemini-3.7-flash', 'gemini-3.1-flash-lite']
    : ['gemini-2.5-flash', 'gemini-flash-latest', 'gemini-3.7-flash', 'gemini-3.1-flash-lite'];

  const modelsToTry = Array.from(new Set(candidateModels));

  const ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build-vercel',
      }
    }
  });

  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: contents || prompt,
        config: {
          systemInstruction: systemInstruction || undefined,
          responseMimeType: responseMimeType || undefined,
          maxOutputTokens: 8192,
        }
      });

      if (response && response.text) {
        return res.status(200).json({ text: response.text, modelUsed: modelName });
      }
    } catch (error: any) {
      lastError = error;
      console.warn(`[Vercel Serverless Gemini] Model ${modelName} error:`, error?.message || error);
      continue;
    }
  }

  const friendlyMessage = lastError?.message?.includes('503') || lastError?.message?.includes('high demand')
    ? 'AI services are currently experiencing high demand. Please try generating again in a few moments.'
    : (lastError?.message || 'Failed to generate AI response. Please try again.');

  return res.status(503).json({ error: friendlyMessage, details: lastError?.message });
}
