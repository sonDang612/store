import morgan from "morgan";
import type { NextApiRequest, NextApiResponse } from "next";
import nc from "next-connect";

import dbConnect from "@/lib/dbConnect";
import { errorHandler } from "@/middleware/errorMiddleware";
import { UserDB } from "@/server/models/User";

declare module "next" {
  interface NextApiRequest {
    user?: InstanceType<UserDB>;
    maxMinPrice?: any;
  }
}
export default function base() {
  return nc<NextApiRequest, NextApiResponse>({ onError: errorHandler })
    .use(async (req, res, next) => {
      await dbConnect();
      next();
    })
    .use(morgan("dev"));
}
