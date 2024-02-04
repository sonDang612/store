import { checkCoupon, getCoupon } from "@/controllers/couponController";
import { protect, restrictTo } from "@/middleware/authMiddleware";
import { ROLE } from "@/src/constant";
import base from "@/utils/base";

const handler = base()
  .get(protect, restrictTo(ROLE.ADMIN), getCoupon)
  .post(checkCoupon);
//    .delete(protect, admin, deleteProduct)
//    .put(protect, admin, updateProduct);

export default handler;
