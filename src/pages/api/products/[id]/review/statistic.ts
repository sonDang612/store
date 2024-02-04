import { statisticProductReview } from "@/controllers/reviewController";
import base from "@/utils/base";
// import { protect } from "@/middleware/authMiddleware";
const handler = base().get(statisticProductReview);

//    .delete(protect, admin, deleteProduct)
//    .put(protect, admin, updateProduct);

export default handler;
