import { checkUserLikeProduct } from "@/controllers/userController";
import { getUser } from "@/middleware/authMiddleware";
import base from "@/utils/base";

const handler = base().get(getUser, checkUserLikeProduct);

export default handler;
