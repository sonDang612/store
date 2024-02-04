import mongoose, { InferSchemaType, ObjectId } from "mongoose";

import Product from "@/models/Product";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },

    possessed: { type: Boolean, default: false },
    rating: { type: Number, required: true },
    hide: { type: Boolean, default: false },
    comment: { type: String, default: "" },
    numLike: { type: Number, default: 0 },
    responseReview: {
      type: [
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "User",
          },
          comment: { type: String, required: true },
          // createdAt: { type: Date, default: Date.now() },
          createdAt: { type: Date },
          isAdmin: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
    userLiked: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);

reviewSchema.statics.calcAverageRatings = async function (productId: string) {
  const stats = await this.aggregate([
    {
      $match: { product: new mongoose.Types.ObjectId(productId) },
    },
    {
      $group: {
        _id: "$product",
        numReviews: { $sum: 1 },
        averageRating: { $avg: "$rating" },
      },
    },
  ]);
  // console.log(stats);

  if (stats.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      numReviews: stats[0].numReviews,
      averageRating: stats[0].averageRating,
    });
  }
  // else {
  //    await Product.findByIdAndUpdate(productId, {
  //       numReviews: 0,
  //       averageRating: 4.5,
  //    });
  // }
};

reviewSchema.post("save", function (this: any) {
  // eslint-disable-next-line no-invalid-this
  this.constructor.calcAverageRatings(this.product);
});

export type ReviewSchema = InferSchemaType<typeof reviewSchema>;

export interface IReviewMethods {}

interface ReviewDB extends mongoose.Model<ReviewSchema, {}, IReviewMethods> {
  calcAverageRatings(productId: string): void;
}
export type { ReviewDB };

const Review = (mongoose.models.Review ||
  mongoose.model("Review", reviewSchema)) as ReviewDB;
export default Review;
