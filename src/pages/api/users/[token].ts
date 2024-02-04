import { checkTokenReset } from "@/controllers/userController";
import base from "@/utils/base";

const handler = base().get(checkTokenReset);

export default handler;
