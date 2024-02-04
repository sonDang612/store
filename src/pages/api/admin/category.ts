import { getEachCategorySell } from "@/controllers/statisticController";
import base from "@/utils/base";
// import { protect, restrictTo } from "@/middleware/authMiddleware";
const handler = base().get(getEachCategorySell);

export default handler;
