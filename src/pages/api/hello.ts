import type { NextApiRequest, NextApiResponse } from "next";

import api from "@/utils/chatGPT";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const result = await api.sendMessage(
    (req.query?.text ||
      "Beats solo3 wireless headphones có tốt không") as string,
  );

  res.status(200).json({ name: "John Doe", result });
}
