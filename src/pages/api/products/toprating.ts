import { getProductsTopRating } from "@/controllers/productController";
import base from "@/utils/base";
// import { protect, admin } from "@/middleware/authMiddleware";
const handler = base().get(getProductsTopRating);

export default handler;
