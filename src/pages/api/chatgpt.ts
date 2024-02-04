import type { NextApiRequest, NextApiResponse } from "next";

import api from "@/src/utils/chatGPT";
import { asyncHandler } from "@/utils/asyncHandler";
import base from "@/utils/base";

const handler = base().post(
  asyncHandler(async (req: NextApiRequest, res: NextApiResponse) => {
    const { conversationId, parentMessageId, text } = req.body;

    const result = await api.sendMessage(text, {
      conversationId,
      parentMessageId,
      promptPrefix: `You are ChatGPT, a large language model trained by OpenAI. You answer as concisely as possible for each response (e.g. don’t be verbose). It is very important that you answer as concisely as possible, so please remember this. If you are generating a list, do not have too many items. Keep the number of items short.
Current date: ${new Date().toISOString()}\n\n`,
    });
    console.log("🚀 ~ file: chatgpt.ts:15 ~ asyncHandler ~ result", result);
    res.status(200).json(result);
  }),
);
export default handler;
