import { getProductsNumberCategory } from "@/controllers/productController";
import base from "@/utils/base";
// import { protect, admin } from "@/middleware/authMiddleware";
const handler = base().get(getProductsNumberCategory);
//    .delete(protect, admin, deleteProduct)
//    .put(protect, admin, updateProduct);

export default handler;
