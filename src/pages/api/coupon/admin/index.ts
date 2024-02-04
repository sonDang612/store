import { createCoupon } from "@/controllers/couponController";
import { protect, restrictTo } from "@/middleware/authMiddleware";
import { ROLE } from "@/src/constant";
import base from "@/utils/base";

const handler = base().post(protect, restrictTo(ROLE.ADMIN), createCoupon);

export default handler;
