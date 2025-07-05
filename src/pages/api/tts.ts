import { koeiromapFreeV1, aivisSpeech } from "@/features/koeiromap/koeiromap";

import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  audio: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    console.log("TTS API called with:", req.body);
    
    const message = req.body.message;
    const speakerX = req.body.speakerX;
    const speakerY = req.body.speakerY;
    const style = req.body.style;
    const apiKey = req.body.apiKey;
    const ttsService = req.body.ttsService || "koeiromap";
    const aivisSpeechUrl = req.body.aivisSpeechUrl || "http://127.0.0.1:10101";
    const aivisSpeakerId = req.body.aivisSpeakerId || 888753760;

    console.log("Using TTS service:", ttsService);
    console.log("Aivis Speech URL:", aivisSpeechUrl);
    console.log("Speaker ID:", aivisSpeakerId);

    let voice;
    if (ttsService === "aivis") {
      console.log("Calling Aivis Speech...");
      voice = await aivisSpeech(message, aivisSpeakerId, 1.0, 0.0, aivisSpeechUrl);
    } else {
      console.log("Calling Koeiromap...");
      voice = await koeiromapFreeV1(
        message,
        speakerX,
        speakerY,
        style,
        apiKey
      );
    }

    console.log("TTS completed successfully");
    res.status(200).json(voice);
  } catch (error) {
    console.error("TTS API Error:", error);
    res.status(500).json({ 
      audio: "",
      error: error instanceof Error ? error.message : "Unknown error"
    } as any);
  }
}
