import { deleteUserAddressAdmin } from "@/controllers/userController";
import { protect, restrictTo } from "@/middleware/authMiddleware";
import { ROLE } from "@/src/constant";
import base from "@/utils/base";

const handler = base().delete(
  protect,
  restrictTo(ROLE.ADMIN),
  deleteUserAddressAdmin,
);
//    .delete(protect, admin, deleteProduct)
//    .put(protect, admin, updateProduct);

export default handler;
