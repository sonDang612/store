import {
  deleteWishlist,
  toggleWishlist,
} from "@/controllers/wishListController";
import { protect } from "@/middleware/authMiddleware";
import base from "@/utils/base";

const handler = base().use(protect).put(toggleWishlist).delete(deleteWishlist);

export default handler;
