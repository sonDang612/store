import { getLatestOrder } from "@/controllers/orderController";
import base from "@/utils/base";
// import { protect, admin } from "@/middleware/authMiddleware";
const handler = base().get(getLatestOrder);
//    .delete(protect, admin, deleteProduct)
//    .put(protect, admin, updateProduct);

export default handler;
