import { wait } from "@/utils/wait";
import { synthesizeVoiceApi } from "./synthesizeVoice";
import { Viewer } from "../vrmViewer/viewer";
import { Screenplay } from "./messages";
import { Talk } from "./messages";

const createSpeakCharacter = () => {
  let lastTime = 0;
  let prevFetchPromise: Promise<unknown> = Promise.resolve();
  let prevSpeakPromise: Promise<unknown> = Promise.resolve();

  return (
    screenplay: Screenplay,
    viewer: Viewer,
    koeiroApiKey: string,
    ttsService: string = "koeiromap",
    aivisSpeechUrl: string = "http://127.0.0.1:10101",
    aivisSpeakerId: number = 888753760,
    onStart?: () => void,
    onComplete?: () => void
  ) => {
    const fetchPromise = prevFetchPromise.then(async () => {
      const now = Date.now();
      if (now - lastTime < 1000) {
        await wait(1000 - (now - lastTime));
      }

      const buffer = await fetchAudio(screenplay.talk, koeiroApiKey, ttsService, aivisSpeechUrl, aivisSpeakerId).catch(
        () => null
      );
      lastTime = Date.now();
      return buffer;
    });

    prevFetchPromise = fetchPromise;
    prevSpeakPromise = Promise.all([fetchPromise, prevSpeakPromise]).then(
      ([audioBuffer]) => {
        onStart?.();
        if (!audioBuffer) {
          return;
        }
        return viewer.model?.speak(audioBuffer, screenplay);
      }
    );
    prevSpeakPromise.then(() => {
      onComplete?.();
    });
  };
};

export const speakCharacter = createSpeakCharacter();

export const fetchAudio = async (
  talk: Talk,
  apiKey: string,
  ttsService: string = "koeiromap",
  aivisSpeechUrl: string = "http://127.0.0.1:10101",
  aivisSpeakerId: number = 888753760
): Promise<ArrayBuffer> => {
  const ttsVoice = await synthesizeVoiceApi(
    talk.message,
    talk.speakerX,
    talk.speakerY,
    talk.style,
    apiKey,
    ttsService,
    aivisSpeechUrl,
    aivisSpeakerId
  );
  const url = ttsVoice.audio;

  if (url == null) {
    throw new Error("Something went wrong");
  }

  if (ttsService === "aivis") {
    // Aivis SpeechはBase64エンコードされた音声データを返す
    const audioData = atob(url);
    const buffer = new ArrayBuffer(audioData.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < audioData.length; i++) {
      view[i] = audioData.charCodeAt(i);
    }
    return buffer;
  } else {
    // Koeiromapの場合はURLから音声データを取得
    const resAudio = await fetch(url);
    const buffer = await resAudio.arrayBuffer();
    return buffer;
  }
};
