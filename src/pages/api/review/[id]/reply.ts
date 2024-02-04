import { replyReview } from "@/controllers/reviewController";
import { protect } from "@/middleware/authMiddleware";
import base from "@/utils/base";

const handler = base().put(protect, replyReview);
//    .delete(protect, admin, deleteProduct)
//    .put(protect, admin, updateProduct);

export default handler;
