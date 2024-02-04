import { deleteUser, updateUser } from "@/controllers/userController";
import { protect, restrictTo } from "@/middleware/authMiddleware";
import { ROLE } from "@/src/constant";
import base from "@/utils/base";

const handler = base()
  .use(protect, restrictTo(ROLE.ADMIN))
  .put(updateUser)
  .delete(deleteUser);

export default handler;
