import mongoose, { InferSchemaType } from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    name: {
      uppercase: true,
      type: String,
      trim: true,
      unique: true,
      required: true,
      minLength: [6, "Too short"],
      maxLength: [12, "Too long"],
    },
    expiry: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      trim: true,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true },
);

export type CouponSchema = InferSchemaType<typeof couponSchema>;

export interface ICouponMethods {}

interface CouponDB extends mongoose.Model<CouponSchema, {}, ICouponMethods> {}
export type { CouponDB };

const Coupon = (mongoose.models.Coupon ||
  mongoose.model("Coupon", couponSchema)) as CouponDB;
export default Coupon;
