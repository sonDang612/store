import { getWishList } from "@/controllers/wishListController";
import { protect } from "@/middleware/authMiddleware";
import base from "@/utils/base";

const handler = base().get(protect, getWishList);

export default handler;
