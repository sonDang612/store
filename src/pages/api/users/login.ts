import { authUser } from "@/controllers/userController";
import base from "@/utils/base";

const handler = base().post(authUser);

export default handler;
