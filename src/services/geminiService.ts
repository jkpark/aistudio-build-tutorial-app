import { GoogleGenAI } from "@google/genai";

function getAiInstance(apiKey: string) {
  if (!apiKey) {
      throw new Error("API Key is required. Please enter it at the top of the page.");
  }
  return new GoogleGenAI({ apiKey });
}

export async function generateImage(prompt: string, apiKey: string): Promise<string> {
  const ai = getAiInstance(apiKey);
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          text: prompt,
        },
      ],
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
      }
    }
  });
  
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      const base64EncodeString = part.inlineData.data;
      return `data:image/png;base64,${base64EncodeString}`;
    }
  }
  throw new Error("Failed to generate image");
}

export async function editImage(base64Data: string, mimeType: string, prompt: string, apiKey: string): Promise<string> {
  const ai = getAiInstance(apiKey);
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        {
          text: prompt,
        },
      ],
    },
  });
  
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      const base64EncodeString = part.inlineData.data;
      return `data:image/png;base64,${base64EncodeString}`;
    }
  }
  throw new Error("Failed to edit image");
}
