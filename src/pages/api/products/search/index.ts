import { getProducts } from "@/controllers/productController";
import { getMaxMinPrice } from "@/middleware/getMaxMinPrice";
import base from "@/utils/base";

const handler = base().get(getMaxMinPrice, getProducts);
export default handler;
