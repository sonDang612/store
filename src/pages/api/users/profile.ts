import {
  getUserProfile,
  updateUserProfile,
} from "@/controllers/userController";
import { protect } from "@/middleware/authMiddleware";
import base from "@/utils/base";

const handler = base()
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default handler;
