import { getMeAdmin } from "@/controllers/userController";
import { protect, restrictTo } from "@/middleware/authMiddleware";
import { ROLE } from "@/src/constant";
import base from "@/utils/base";

const handler = base().get(protect, restrictTo(ROLE.ADMIN), getMeAdmin);

export default handler;
