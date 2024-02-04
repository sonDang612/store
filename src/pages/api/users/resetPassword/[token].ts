import { resetPassword } from "@/controllers/userController";
import base from "@/utils/base";

const handler = base().patch(resetPassword);
export default handler;
