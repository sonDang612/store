import { getProductsNewArrival } from "@/controllers/productController";
import base from "@/utils/base";
// import { protect, admin } from "@/middleware/authMiddleware";
const handler = base().get(getProductsNewArrival);

export default handler;
