import MongoQS from "mongo-querystring";
import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

import Order from "@/models/Order";
import Review from "@/models/Review";
import User from "@/models/User";
import { ROLE } from "@/src/constant";
import APIFeatures from "@/utils/apiFeatures";
import { asyncHandler } from "@/utils/asyncHandler";
import notEmpty from "@/utils/not-empty";
import { removeEmpty } from "@/utils/removeEmpty";
// @desc    Create REview
// @route   POST /api/products/review
// @access  private
const createReview = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { product, rating, comment, orderId, possessed } = req.body;
    // console.log(req.body);
    await Review.create({
      user: req.user._id,
      product,
      rating,
      comment,
      possessed: notEmpty(possessed) ? possessed : false,
    });

    await Order.findOneAndUpdate(
      { _id: orderId, "orderItems.product": product },
      { $set: { "orderItems.$.commented": true } },
    );
    res.status(201).json("Create review successfully");
  },
);
// @desc    Get Product Review
// @route   GET /api/products/:id/review
// @access  public
const getProductReview = asyncHandler(
  async (
    req: NextApiRequest & {
      query: any;
    },
    res: NextApiResponse,
  ) => {
    let query = { product: req.query.id, ...req.query };

    const qs = new MongoQS({
      // string: {
      //    toNumber: true,
      //    toBoolean: true,
      // },
    });
    delete query.id;

    query = qs.parse(query);
    const rating: any = {};
    if (query.rating) {
      rating.rating = query.rating;
    }
    query.limit = query?.limit || Number(process.env.PAGE_SIZE_REVIEW);
    const count = await Review.countDocuments({
      product: new mongoose.Types.ObjectId(req.query.id),
      ...rating,
    });
    // const count = await Review.countDocuments({
    //    product: req.query.id,
    //    ...rating,
    // });

    const features = new APIFeatures(Review.find({}), query)
      .filter()
      .sort()
      .limitFields()
      .paginate()
      .populate({
        path: "responseReview.user",
        select: "name active",
        model: User,
      })
      .populate({
        path: "user",
        select: "name createdAt active",
        model: User,
      });
    const reviewFilter = await features.query;
    // console.log(reviewFilter);
    res.json({
      reviews: reviewFilter,
      currentPage: query.page || 1,
      totalPages: Math.ceil(count / query.limit),
      totalReview: count,
      reviewPerPage: query.limit,
    });
  },
);
// @desc    Like Review
// @route   PUT /api/review/:id/like
// @access  public
const likeReview = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    // console.log(id, req.user._id);
    const reviews = await Review.findByIdAndUpdate(
      id,
      [
        {
          $set: {
            userLiked: {
              $cond: [
                {
                  $in: [req.user._id, "$userLiked"],
                },
                {
                  $setDifference: ["$userLiked", [req.user._id]],
                },
                {
                  $concatArrays: ["$userLiked", [req.user._id]],
                },
              ],
            },
          },
        },
      ],
      { new: true },
    );
    reviews.numLike = reviews.userLiked.length;
    await reviews.save();

    // res.json("Like Review Successfully");
    // console.log(reviews);
    // res.json(reviews);
    res.json({
      // khong can gui nguyen review object ,gui may field nay duoc roi
      _id: reviews._id,
      numLike: reviews.numLike,
      userLiked: reviews.userLiked,
    });
  },
);
// @desc    add comment Review
// @route   PUT /api/review/:id/reply
// @access  public
const replyReview = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log("vo");
    const { id } = req.query;
    const { comment, isAdmin } = req.body;
    // console.log(req.user);
    const reviews: any = await Review.findById(id);
    // console.log({
    //    user: req.user._id,
    //    comment,
    //    createdAt: Date.now(),
    //    isAdmin: req.user.role === "admin" ? true : null,
    // });
    reviews.responseReview.unshift(
      removeEmpty({
        user: req.user._id,
        comment,
        createdAt: Date.now(),
        isAdmin: req.user.role === ROLE.ADMIN ? true : null,
      }),
    );
    await reviews.save();
    // res.json(reviews);

    const responseReview = {
      ...reviews.responseReview[0]._doc,
      name: req.user.name,
    };
    res.json(responseReview);
  },
);

// @desc    Get Product statistic Review
// @route   GET /api/products/:id/review/statistic
// @access  public
const statisticProductReview = asyncHandler(
  async (
    req: NextApiRequest & {
      query: any;
    },
    res: NextApiResponse,
  ) => {
    const { id } = req.query;

    let statisticReview = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(id) } },
      { $group: { _id: "$rating", total: { $sum: 1 } } },
      {
        $project: {
          _id: 0,
          rating: "$_id",
          total: "$total",
        },
      },
      // { $sort: { rating: -1 } },
    ]);

    let totalReview = 0;
    function add(arr: any[], object: any) {
      const found = arr.find((el) => el.rating === object.rating);
      if (!found) {
        arr.push(object);
      } else totalReview += found.total;
      return arr;
    }

    for (let i = 5; i >= 1; i--) {
      add(statisticReview, { rating: i, total: 0 });
    }
    statisticReview = statisticReview.sort((a, b) => b.rating - a.rating);

    res.json({ statisticReview, totalReview });
  },
);
// @desc    Get latest review
// @route   GET /api/admin/reviews/latest
// @access  Private
const getLatestReview = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const reviews = await Review.find({ isAdmin: { $ne: true } })
      .limit(6)
      .populate({ path: "user", select: "name active", model: User })
      .select("createdAt user comment status rating")
      .sort("-createdAt");

    res.status(200).json(reviews);
  },
);
// @desc    Get  review
// @route   GET /api/admin/reviews
// @access  Private
const getReviews = asyncHandler(
  async (
    req: NextApiRequest & {
      query: any;
    },
    res: NextApiResponse,
  ) => {
    // const reviews = await Review.find({ isAdmin: { $ne: true } })
    //    .limit(6)
    //    .populate({ path: "user", select: "name" })
    //    .select("createdAt user comment status rating")
    //    .sort("-createdAt");
    let query = { ...req.query };

    const qs = new MongoQS({
      // string: {
      //    toNumber: true,
      //    toBoolean: true,
      // },
    });
    query = qs.parse(query);
    const queryObj = { ...query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    req.query.limit = req.query.limit || 8;
    req.query.page = req.query.page || 1;
    if (queryObj["product._id"]) {
      queryObj["product._id"] = new mongoose.Types.ObjectId(
        queryObj["product._id"],
      );
    }
    // console.log(queryObj);
    const reviews = await Review.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "product",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },

      {
        $unwind: { path: "$product" },
      },
      {
        $unwind: { path: "$user" },
      },
      { $match: { ...queryObj } },
      {
        $project: {
          _id: "$_id",

          "user.name": "$user.name",
          "user._id": "$user._id",
          "product.name": "$product.name",
          "product.slug": "$product.slug",

          "product.image": { $first: "$product.image" },
          "product._id": "$product._id",

          possessed: 1,
          hide: 1,
          rating: 1,
          comment: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          metadata: [
            { $count: "totalReview" },
            {
              $addFields: {
                currentPage: Number(req.query.page),
                reviewPerPage: Number(req.query.limit),
                totalPages: {
                  $ceil: {
                    $divide: ["$totalReview", Number(req.query.limit)],
                  },
                },
              },
            },
          ],
          data: [
            {
              $skip: (Number(req.query.page) - 1) * Number(req.query.limit),
            },
            { $limit: Number(req.query.limit) },
          ], // add projection here wish you re-shape the docs
        },
      },
      {
        // $unwind: { path: "$orderItems", preserveNullAndEmptyArrays: true, includeArrayIndex: "index1" },
        $unwind: { path: "$metadata", preserveNullAndEmptyArrays: true },
      },
    ]);
    // console.log(reviews);
    // if (notEmpty(reviews[0].data))
    if (reviews.length > 0) {
      res.json({
        reviews: reviews[0].data,
        currentPage: reviews[0].metadata?.currentPage || 1,
        totalPages: reviews[0].metadata?.totalPages || 1,
        totalReview: reviews[0].metadata?.totalReview || 0,
        reviewPerPage: reviews[0].metadata?.reviewPerPage || req.query.limit,
      });
    } else res.json({});

    // res.status(200).json(reviews);
  },
);

// @desc    add comment Review
// @route   PUT /api/review/:id/hide
// @access  public
const hideReview = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log("vo");
    const { id } = req.query;

    const reviews = await Review.findByIdAndUpdate(
      id,
      [
        {
          $set: {
            hide: {
              $cond: [{ $eq: ["$hide", true] }, false, true],
            },
          },
        },
      ],
      { new: true },
    );
    // const reviews = await Review.updateOne({ _id: id }, [
    //    {
    //       $set: {
    //          hide: {
    //             $cond: [{ $eq: ["$hide", true] }, false, true],
    //          },
    //       },
    //    },
    // ]);
    // console.log(reviews);
    // res.json(reviews);

    res.json(
      reviews.hide ? "Review has been hidden" : "Review has been unhidden",
    );
  },
);
export {
  hideReview,
  getReviews,
  createReview,
  getProductReview,
  likeReview,
  replyReview,
  statisticProductReview,
  getLatestReview,
};
