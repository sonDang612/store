import { getOrders } from "@/controllers/orderController";
import { protect, restrictTo } from "@/middleware/authMiddleware";
import { ROLE } from "@/src/constant";
import base from "@/utils/base";

const handler = base().get(protect, restrictTo(ROLE.ADMIN), getOrders);
//    .delete(protect, admin, deleteProduct)
//    .put(protect, admin, updateProduct);

export default handler;
