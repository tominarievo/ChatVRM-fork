import { GoogleGenAI } from "@google/genai";
import { Message } from "../messages/messages";

export async function getChatResponse(messages: Message[], apiKey: string, model: string = "gemini-2.0-flash-001") {
  if (!apiKey) {
    throw new Error("Invalid API Key");
  }

  const genAI = new GoogleGenAI({apiKey: apiKey});

  const contents = messages.map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));

  const result = await genAI.models.generateContent({ model, contents });
  const text = result.text || "";

  return { message: text };
}

export async function getChatResponseStream(
  messages: Message[],
  apiKey: string,
  model: string = "gemini-2.0-flash-001"
) {
  if (!apiKey) {
    throw new Error("Invalid API Key");
  }

  const genAI = new GoogleGenAI({apiKey: apiKey});

  const contents = messages.map((m) => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));

  const result = await genAI.models.generateContentStream({
    model: model,
    contents: contents,
  });

  const stream = new ReadableStream({
    async start(controller: ReadableStreamDefaultController) {
      try {
        for await (const chunk of result) {
          const chunkText = chunk.text || "";
          if (chunkText) {
            controller.enqueue(chunkText);
          }
        }
      } catch (error) {
        controller.error(error);
      } finally {
        controller.close();
      }
    },
  });

  return stream;
}
