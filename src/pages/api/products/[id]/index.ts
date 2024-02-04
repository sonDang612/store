import {
  createProduct,
  deleteProduct,
  getProductById,
  updateProduct,
} from "@/controllers/productController";
import { getUser, protect } from "@/middleware/authMiddleware";
import base from "@/utils/base";

const handler = base()
  .get(getUser, getProductById)
  .put(updateProduct)
  .post(protect, createProduct)
  .delete(deleteProduct);

export default handler;
