/* eslint-disable no-use-before-define */
import mongoose, { InferSchemaType } from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    products: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Product",
          },

          quantity: Number,

          check: { type: Boolean, default: false },
        },
      ],
      default: [],
    },

    orderdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

cartSchema.methods.addOrUpdateCart = async function (productUpdate: any) {
  let alreadyAddProduct = false;
  this.products = this.products.map((product: any) => {
    if (product.product.toString() === productUpdate.product.toString()) {
      alreadyAddProduct = true;

      const newQuantity = product.quantity + productUpdate.quantity;
      if (newQuantity > productUpdate.countInStock) {
        throw new Error(productUpdate.errorMessage);
      }
      delete productUpdate.errorMessage;
      delete productUpdate.countInStock;
      product.quantity = newQuantity;
    }
    return product;
  });

  if (!alreadyAddProduct) {
    this.products.push({
      product: productUpdate.product,
      quantity: productUpdate.quantity,
      check: productUpdate.check || false,
    });
  }
  return this.save();
  // let alreadyAddProduct = false;
  // this.products = this.products.map((product) => {
  //    if (product.product._id.toString() === productUpdate.product.toString()) {
  //       alreadyAddProduct = true;
  //       product.quantity = product.quantity + productUpdate.quantity;
  //    }
  //    return product;
  // });
  // if (!alreadyAddProduct)
  //    this.products.push({
  //       product: productUpdate.product,
  //       quantity: productUpdate.quantity,
  //       check: productUpdate.check || false,
  //    });
  // return await this.save();
};
cartSchema.methods.deleteProductCart = async function (productId: string) {
  if (productId === "undefined") {
    this.products = this.products.filter((product: any) => !product.check);
  } else {
    this.products = this.products.filter(
      (product: any) => product.product.toString() !== productId.toString(),
    );
  }
  return this.save();
};

cartSchema.methods.updateQuantityOrCheck = async function (cartUpdate: any) {
  if (cartUpdate.hasOwnProperty("checkAll")) {
    this.products = this.products.map((product: any) => {
      product.check = cartUpdate.checkAll;
      return product;
    });
  } else {
    this.products = this.products.map((product: any) => {
      if (product.product._id.toString() === cartUpdate.product.toString()) {
        if (cartUpdate.quantity) product.quantity = cartUpdate.quantity;
        if (cartUpdate.hasOwnProperty("check")) {
          product.check = cartUpdate.check;
        }
      }
      return product;
    });
  }
  return this.save();
};

export type CartSchema = InferSchemaType<typeof cartSchema>;

export interface ICartMethods {
  updateQuantityOrCheck: (cartUpdate: any) => any;
  deleteProductCart: (productId: string) => any;
  addOrUpdateCart: (productUpdate: string) => any;
}

interface CartDB extends mongoose.Model<CartSchema, {}, ICartMethods> {}
export type { CartDB };

const Cart = (mongoose.models.Cart ||
  mongoose.model("Cart", cartSchema)) as CartDB;
export default Cart;
