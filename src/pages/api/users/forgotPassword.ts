import { forgotPassword } from "@/controllers/userController";
import base from "@/utils/base";

const handler = base().post(forgotPassword);

export default handler;
