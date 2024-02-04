import { createOrder, getMyOrder } from "@/controllers/orderController";
import { protect, restrictTo } from "@/middleware/authMiddleware";
import { ROLE } from "@/src/constant";
import base from "@/utils/base";

const handler = base()
  .use(protect)
  .get(getMyOrder)
  .post(restrictTo(ROLE.USER), createOrder);

export default handler;
