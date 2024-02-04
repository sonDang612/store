import { hideReview } from "@/controllers/reviewController";
import { protect, restrictTo } from "@/middleware/authMiddleware";
import { ROLE } from "@/src/constant";
import base from "@/utils/base";

const handler = base().put(protect, restrictTo(ROLE.ADMIN), hideReview);
//    .delete(protect, admin, deleteProduct)
//    .put(protect, admin, updateProduct);

export default handler;
