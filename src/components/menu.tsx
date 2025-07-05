import { IconButton } from "./iconButton";
import { Message } from "@/features/messages/messages";
import { KoeiroParam } from "@/features/constants/koeiroParam";
import { ChatLog } from "./chatLog";
import React, { useCallback, useContext, useRef, useState } from "react";
import { Settings } from "./settings";
import { ViewerContext } from "@/features/vrmViewer/viewerContext";
import { AssistantText } from "./assistantText";

type Props = {
  googleApiKey: string;
  systemPrompt: string;
  chatLog: Message[];
  koeiroParam: KoeiroParam;
  assistantMessage: string;
  geminiModel: string;
  koeiromapKey: string;
  ttsService: string;
  aivisSpeechUrl: string;
  aivisSpeakerId: number;
  onChangeSystemPrompt: (systemPrompt: string) => void;
  onChangeGoogleApiKey: (key: string) => void;
  onChangeChatLog: (index: number, text: string) => void;
  onChangeKoeiromapParam: (param: KoeiroParam) => void;
  onChangeGeminiModel: (model: string) => void;
  handleClickResetChatLog: () => void;
  handleClickResetSystemPrompt: () => void;
  onChangeKoeiromapKey: (key: string) => void;
  onChangeTtsService: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onChangeAivisSpeechUrl: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeAivisSpeakerId: (event: React.ChangeEvent<HTMLSelectElement>) => void;
};
export const Menu = ({
  googleApiKey,
  systemPrompt,
  chatLog,
  koeiroParam,
  assistantMessage,
  geminiModel,
  koeiromapKey,
  ttsService,
  aivisSpeechUrl,
  aivisSpeakerId,
  onChangeSystemPrompt,
  onChangeGoogleApiKey,
  onChangeChatLog,
  onChangeKoeiromapParam,
  onChangeGeminiModel,
  handleClickResetChatLog,
  handleClickResetSystemPrompt,
  onChangeKoeiromapKey,
  onChangeTtsService,
  onChangeAivisSpeechUrl,
  onChangeAivisSpeakerId,
}: Props) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showChatLog, setShowChatLog] = useState(false);
  const { viewer } = useContext(ViewerContext);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChangeSystemPrompt = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChangeSystemPrompt(event.target.value);
    },
    [onChangeSystemPrompt]
  );

  const handleGoogleApiKeyChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeGoogleApiKey(event.target.value);
    },
    [onChangeGoogleApiKey]
  );

  const handleChangeKoeiromapKey = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeKoeiromapKey(event.target.value);
    },
    [onChangeKoeiromapKey]
  );

  const handleChangeGeminiModel = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      onChangeGeminiModel(event.target.value);
    },
    [onChangeGeminiModel]
  );

  const handleChangeKoeiroParam = useCallback(
    (x: number, y: number) => {
      onChangeKoeiromapParam({
        speakerX: x,
        speakerY: y,
      });
    },
    [onChangeKoeiromapParam]
  );

  const handleClickOpenVrmFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleChangeVrmFile = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (!files) return;

      const file = files[0];
      if (!file) return;

      const file_type = file.name.split(".").pop();

      if (file_type === "vrm") {
        const blob = new Blob([file], { type: "application/octet-stream" });
        const url = window.URL.createObjectURL(blob);
        viewer.loadVrm(url);
      }

      event.target.value = "";
    },
    [viewer]
  );

  return (
    <>
      <div className="absolute z-10 m-24">
        <div className="grid grid-flow-col gap-[8px]">
          <IconButton
            iconName="24/Menu"
            label="設定"
            isProcessing={false}
            onClick={() => setShowSettings(true)}
          ></IconButton>
          {showChatLog ? (
            <IconButton
              iconName="24/CommentOutline"
              label="会話ログ"
              isProcessing={false}
              onClick={() => setShowChatLog(false)}
            />
          ) : (
            <IconButton
              iconName="24/CommentFill"
              label="会話ログ"
              isProcessing={false}
              disabled={chatLog.length <= 0}
              onClick={() => setShowChatLog(true)}
            />
          )}
        </div>
      </div>
      {showChatLog && <ChatLog messages={chatLog} />}
      {showSettings && (
        <Settings
          googleApiKey={googleApiKey}
          chatLog={chatLog}
          systemPrompt={systemPrompt}
          koeiroParam={koeiroParam}
          geminiModel={geminiModel}
          koeiromapKey={koeiromapKey}
          ttsService={ttsService}
          aivisSpeechUrl={aivisSpeechUrl}
          aivisSpeakerId={aivisSpeakerId}
          onClickClose={() => setShowSettings(false)}
          onChangeGoogleApiKey={handleGoogleApiKeyChange}
          onChangeSystemPrompt={handleChangeSystemPrompt}
          onChangeChatLog={onChangeChatLog}
          onChangeKoeiroParam={handleChangeKoeiroParam}
          onChangeGeminiModel={handleChangeGeminiModel}
          onClickOpenVrmFile={handleClickOpenVrmFile}
          onClickResetChatLog={handleClickResetChatLog}
          onClickResetSystemPrompt={handleClickResetSystemPrompt}
          onChangeKoeiromapKey={handleChangeKoeiromapKey}
          onChangeTtsService={onChangeTtsService}
          onChangeAivisSpeechUrl={onChangeAivisSpeechUrl}
          onChangeAivisSpeakerId={onChangeAivisSpeakerId}
        />
      )}
      {!showChatLog && assistantMessage && (
        <AssistantText message={assistantMessage} />
      )}
      <input
        type="file"
        className="hidden"
        accept=".vrm"
        ref={fileInputRef}
        onChange={handleChangeVrmFile}
      />
    </>
  );
};
