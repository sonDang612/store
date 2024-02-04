import {
  deleteAddressUser,
  updateAddressUser,
} from "@/controllers/userController";
import { protect } from "@/middleware/authMiddleware";
import base from "@/utils/base";

const handler = base()
  .use(protect)
  .patch(updateAddressUser)
  .delete(deleteAddressUser);

export default handler;
