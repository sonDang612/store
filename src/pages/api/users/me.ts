import { getMe } from "@/controllers/userController";
import { protect } from "@/middleware/authMiddleware";
import base from "@/utils/base";

const handler = base().get(protect, getMe);

export default handler;
