import { getOrderById } from "@/controllers/orderController";
import { protect, restrictTo } from "@/middleware/authMiddleware";
import { ROLE } from "@/src/constant";
import base from "@/utils/base";

const handler = base().get(
  protect,
  restrictTo(ROLE.USER, ROLE.ADMIN),
  getOrderById,
);

export default handler;
