import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

import Product from "@/models/Product";
import WishList from "@/models/WishList";
import { asyncHandler } from "@/utils/asyncHandler";
import isEmpty from "@/utils/is-empty";
// @desc    Get User WishList
// @route   GET /api/users/wishlist
// @access  private
const getWishList = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const wishList = await WishList.findOne({ user: req.user._id }).populate({
      path: "products",
      // select: "name image averageRating numReviews price discount",
      select: {
        name: 1,
        image: { $slice: 1 },
        averageRating: 1,
        numReviews: 1,
        currentPrice: 1,
        price: 1,
        discount: 1,
      },
      model: Product,
    });
    if (isEmpty(wishList)) {
      WishList.create({
        user: req.user._id,
        products: [],
      });
    }
    // console.log({ products: wishList?.products || [], name: req.user.name });
    res.json({ products: wishList?.products || [], name: req.user.name });
  },
);
// @desc    toggle Wishlist
// @route   PUT /api/products/:id/wishlist
// @access  private
const toggleWishlist = asyncHandler(
  async (
    req: NextApiRequest & {
      query: any;
    },
    res: NextApiResponse,
  ) => {
    const { id } = req.query;

    const wishList = await WishList.updateOne(
      { user: req.user._id },
      [
        {
          $set: {
            products: {
              $cond: [
                {
                  $in: [new mongoose.Types.ObjectId(id), "$products"],
                },
                {
                  $setDifference: [
                    "$products",
                    [new mongoose.Types.ObjectId(id)],
                  ],
                },
                {
                  $concatArrays: [
                    "$products",
                    [new mongoose.Types.ObjectId(id)],
                  ],
                },
              ],
            },
          },
        },
      ],
      // { new: true }
    );
    //! return { n: 1, nModified: 1, ok: 1 }
    // res.json("Add product to wishLish successfully");
    res.json(wishList);
  },
);
// @desc    delete Wishlist
// @route   delete /api/products/:id/wishlist
// @access  private
const deleteWishlist = asyncHandler(
  async (
    req: NextApiRequest & {
      query: any;
    },
    res: NextApiResponse,
  ) => {
    const { id } = req.query;
    const result = await WishList.updateOne(
      { user: req.user._id },
      { $pull: { products: id } },
    );
    // console.log(result);
    //! return { n: 1, nModified: 1, ok: 1 }
    // res.json("Add product to wishLish successfully");
    res.json(result);
  },
);

export { getWishList, toggleWishlist, deleteWishlist };
