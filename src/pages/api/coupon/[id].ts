import { deleteCoupon, updateCoupon } from "@/controllers/couponController";
import { protect, restrictTo } from "@/middleware/authMiddleware";
import { ROLE } from "@/src/constant";
import base from "@/utils/base";

const handler = base()
  .use(protect, restrictTo(ROLE.ADMIN))
  .put(updateCoupon)
  .delete(deleteCoupon);

export default handler;
