import type { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";

const errorHandler = (
  err: any,
  req: NextApiRequest,
  res: NextApiResponse,
  _next: NextHandler,
) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    status: statusCode,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { errorHandler };
