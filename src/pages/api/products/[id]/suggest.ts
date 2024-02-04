import { getSuggestProduct } from "@/controllers/productController";
import { getUser } from "@/server/middleware/authMiddleware";
import base from "@/utils/base";

const handler = base().get(getUser, getSuggestProduct);

export default handler;
