import { reduceTalkStyle } from "@/utils/reduceTalkStyle";
import { koeiromapV0, aivisSpeech } from "../koeiromap/koeiromap";
import { TalkStyle } from "../messages/messages";

export async function synthesizeVoice(
  message: string,
  speakerX: number,
  speakerY: number,
  style: TalkStyle,
  ttsService: string = "koeiromap",
  aivisSpeechUrl: string = "http://127.0.0.1:10101",
  aivisSpeakerId: number = 888753760
) {
  if (ttsService === "aivis") {
    const aivisRes = await aivisSpeech(message, aivisSpeakerId, 1.0, 0.0, aivisSpeechUrl);
    return { audio: aivisRes.audio };
  } else {
    const koeiroRes = await koeiromapV0(message, speakerX, speakerY, style);
    return { audio: koeiroRes.audio };
  }
}

export async function synthesizeVoiceApi(
  message: string,
  speakerX: number,
  speakerY: number,
  style: TalkStyle,
  apiKey: string,
  ttsService: string = "koeiromap",
  aivisSpeechUrl: string = "http://127.0.0.1:10101",
  aivisSpeakerId: number = 888753760
) {
  // Free向けに感情を制限する
  const reducedStyle = reduceTalkStyle(style);

  const body = {
    message: message,
    speakerX: speakerX,
    speakerY: speakerY,
    style: reducedStyle,
    apiKey: apiKey,
    ttsService: ttsService,
    aivisSpeechUrl: aivisSpeechUrl,
    aivisSpeakerId: aivisSpeakerId,
  };

  const res = await fetch("/api/tts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as any;

  return { audio: data.audio };
}
