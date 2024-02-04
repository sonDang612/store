/* eslint-disable no-invalid-this */
import mongoose, { InferSchemaType } from "mongoose";

const productSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    // reviews: [reviewSchema],
    name: {
      type: String,
      trim: true,
      required: [true, "Plase add a product name"],
    },
    slug: String,
    price: {
      type: Number,

      required: [true, "Please add a price"],
      min: [0, "Price cannot be lower than 0"],
    },
    currentPrice: {
      type: Number,
      required: true,
    },

    image: {
      type: [String],
      required: true,
      default: [],
    },
    description: {
      type: String,
      // required: [true, "Please add a description"],
      default: "",
    },
    tableInformation: {
      type: String,
      // required: [true, ""],
      default: "",
    },
    brand: {
      type: String,
      required: [true, "Please add a branch"],
    },

    category: {
      type: String,
      required: [true, "Please choose a category"],
      enum: [
        "Accessories",
        "Home Applications",
        "Kitchen Appliances",
        "Laptops",
        "Smartphone",
        "Televisions",
      ],
    },

    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: [0, "Rating must be at least 1"],
      max: [5, "Rating cannot be higher than 5"],
      set: (val: any) => Math.round(val * 10) / 10,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      max: [100, "Discount cannot be higher than 100%"],
      min: [0, "Discount cannot be lower than 0%"],
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);
// productSchema.pre(/^find/, function (this: any, next) {
//   const filter = this.getFilter();
//   console.log("🚀 ~ file: Product.ts:97 ~ filter", filter);
//   if (!filter?.getAll) {
//     this.find({ active: { $ne: false } });
//   } else delete this.getFilter().getAll;

//   next();
// });
export type ProductSchema = InferSchemaType<typeof productSchema>;

export interface IProductMethods {}

interface ProductDB
  extends mongoose.Model<ProductSchema, {}, IProductMethods> {}
export type { ProductDB };

const Product = (mongoose.models.Product ||
  mongoose.model("Product", productSchema)) as ProductDB;
export default Product;
