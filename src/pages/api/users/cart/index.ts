import {
  addProductToCartUser,
  updateProductToCartUser,
} from "@/controllers/userController";
import { protect } from "@/middleware/authMiddleware";
import base from "@/utils/base";

const handler = base()
  .use(protect)
  .post(addProductToCartUser)
  .patch(updateProductToCartUser);

export default handler;
