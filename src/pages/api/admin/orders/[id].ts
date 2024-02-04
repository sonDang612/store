import { updateStatusOrder } from "@/controllers/orderController";
import { protect } from "@/middleware/authMiddleware";
import base from "@/utils/base";

const handler = base().put(
  protect,

  updateStatusOrder,
);

export default handler;
