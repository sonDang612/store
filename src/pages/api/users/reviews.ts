import { getProductToReview } from "@/controllers/orderController";
import { protect } from "@/middleware/authMiddleware";
import base from "@/utils/base";

const handler = base().get(protect, getProductToReview);

export default handler;
