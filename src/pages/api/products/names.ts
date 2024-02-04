import { getNameProduct } from "@/controllers/productController";
import base from "@/utils/base";

const handler = base().get(getNameProduct);
export default handler;
