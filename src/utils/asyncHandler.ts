// import dbConnect from "@/lib/dbConnect";

export const asyncHandler = (fn: any) =>
  async function asyncUtilWrap(...args: any[]) {
    // await dbConnect();
    const fnReturn = fn(...args);
    const next = args[args.length - 1];
    return Promise.resolve(fnReturn).catch(next);
  };
