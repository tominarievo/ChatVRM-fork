import { getChatResponse } from "@/features/chat/googleGeminiChat";

import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const apiKey = req.body.apiKey || process.env.OPEN_AI_KEY;

  if (!apiKey) {
    res
      .status(400)
      .json({ message: "APIキーが間違っているか、設定されていません。" });

    return;
  }

  const { message } = await getChatResponse(req.body.messages, apiKey);

  res.status(200).json({ message: message });
}
