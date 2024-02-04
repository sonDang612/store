import { createCoupon } from "@/controllers/couponController";
import { protect, restrictTo } from "@/middleware/authMiddleware";
import { ROLE } from "@/src/constant";
import base from "@/utils/base";

const handler = base().use(protect, restrictTo(ROLE.ADMIN)).post(createCoupon);
//    .delete(protect, admin, deleteProduct)
//    .put(protect, admin, updateProduct);

export default handler;
