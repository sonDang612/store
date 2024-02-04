import { deleteProductToCartUser } from "@/controllers/userController";
import { protect } from "@/middleware/authMiddleware";
import base from "@/utils/base";

const handler = base().delete(protect, deleteProductToCartUser);

export default handler;
