import mongoose, { InferSchemaType } from "mongoose";

const wishListSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    products: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

export type WishListSchema = InferSchemaType<typeof wishListSchema>;

export interface IWishListMethods {}

interface WishListDB
  extends mongoose.Model<WishListSchema, {}, IWishListMethods> {}
export type { WishListDB };

const WishList = (mongoose.models.WishList ||
  mongoose.model("WishList", wishListSchema)) as WishListDB;
export default WishList;
