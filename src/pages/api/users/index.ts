import { getUsers, registerUser } from "@/controllers/userController";
import { protect, restrictTo } from "@/middleware/authMiddleware";
import { ROLE } from "@/src/constant";
import base from "@/utils/base";

const handler = base()
  .post(registerUser)
  .get(protect, restrictTo(ROLE.ADMIN), getUsers);

export default handler;
