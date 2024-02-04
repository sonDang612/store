import { addAddressUser } from "@/controllers/userController";
import { protect } from "@/middleware/authMiddleware";
import base from "@/utils/base";

const handler = base().use(protect).post(addAddressUser);

export default handler;
