import { getReviews } from "@/controllers/reviewController";
import { protect, restrictTo } from "@/middleware/authMiddleware";
import { ROLE } from "@/src/constant";
import base from "@/utils/base";

const handler = base().get(protect, restrictTo(ROLE.ADMIN), getReviews);

export default handler;
