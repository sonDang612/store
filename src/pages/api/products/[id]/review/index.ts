import { getProductReview } from "@/controllers/reviewController";
import base from "@/utils/base";
// import { protect } from "@/middleware/authMiddleware";
const handler = base().get(getProductReview);

//    .delete(protect, admin, deleteProduct)
//    .put(protect, admin, updateProduct);

export default handler;
