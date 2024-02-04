import type { NextApiRequest, NextApiResponse } from "next";

import Coupon from "@/models/Coupon";
import APIFeatures from "@/utils/apiFeatures";
import { asyncHandler } from "@/utils/asyncHandler";
import { removeEmpty } from "@/utils/removeEmpty";
// @desc    Get order by ID
// @route   POST /api/coupon
// @access  PRIVATE
export const checkCoupon = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log(req.body.name);
    const coupon = await Coupon.findOne({
      name: req.body.name,
      expiry: { $gt: Date.now().toString() },
    });

    // console.log(coupon);
    if (coupon && coupon.quantity > 0) {
      res.json(coupon);
    } else {
      res.status(404);
      throw new Error("Coupon is not valid");
    }
  },
);
// @desc    Get order by ID
// @route   PUT /api/coupon/:id
// @access  PRIVATE
export const updateCoupon = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { quantity, discount, expiry, name } = req.body;

    const coupon = await Coupon.findByIdAndUpdate(
      req.query.id,
      removeEmpty({ quantity, discount, expiry, name }),
      { new: true },
    );

    res.json(coupon);
  },
);
// @desc    Get order by ID
// @route   DELETE /api/coupon/:id
// @access  PRIVATE
export const deleteCoupon = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const coupon = await Coupon.findByIdAndDelete(req.query.id);
    res.json(coupon);
  },
);
// @desc    Get order by ID
// @route   POST /api/admin/coupon
// @access  PRIVATE
export const createCoupon = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { quantity, discount, expiry, name } = req.body;
    const coupon = await Coupon.create(
      removeEmpty({ quantity, discount, expiry, name }),
    );
    res.json(coupon);
  },
);
// @desc    Get Coupon
// @route   Get /api/coupon
// @access  PRIVATE
export const getCoupon = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    // const qs = new MongoQS({
    //    custom: {
    //       after: "expiry",
    //    },
    // });

    const query: any = { ...req.query };
    // query = qs.parse(query);
    // console.log(query);
    query.limit = query?.limit || 8;
    query.page = query?.page || 1;
    query.sort = query.sort ? query.sort : "-createdAt";
    if (query.name) {
      query.name = { $regex: query.name, $options: "i" };
    }
    const features = new APIFeatures(Coupon.find(), query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const coupons = await features.query;
    const queryObj = { ...req.query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    const count = await Coupon.countDocuments(queryObj);
    res.json({
      coupons,
      currentPage: +query.page || 1,
      totalPages: Math.ceil(count / query.limit),
      totalCoupon: count,
      couponPerPage: query.limit,
    });
  },
);
