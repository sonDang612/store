import mongoose, { InferSchemaType } from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        commented: {
          type: Boolean,
          default: false,
        },
      },
    ],
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      created: { type: Date },
      // email_address: { type: String },
      receipt_email: {
        type: String,
        required: [true, "Please add an email"],

        match: [
          // eslint-disable-next-line no-useless-escape
          /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          "Please add a valid email",
        ],
      },
      receipt_name: { type: String },
    },

    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    discountPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    total: {
      type: Number,
      required: true,
      default: 0.0,
    },
    status: {
      type: String,
      required: true,
      enum: [
        "Ordered Successfully",
        "Shop Received",
        "Getting Product",
        "Packing",
        "Shipping handover",
        "Shipping",
        "Delivered",
        "Cancelled",
      ],
      default: "Ordered Successfully",
    },
    statusTime: {
      type: [Date],
      default: [],
    },
  },
  {
    timestamps: true,
  },
);
export type OrderSchema = InferSchemaType<typeof orderSchema>;

export interface IOrderMethods {}

interface OrderDB extends mongoose.Model<OrderSchema, {}, IOrderMethods> {}
export type { OrderDB };

const Order = (mongoose.models.Order ||
  mongoose.model("Order", orderSchema)) as OrderDB;
export default Order;
