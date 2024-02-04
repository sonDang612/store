import dayjs from "dayjs";
import MongoQS from "mongo-querystring";
import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";

import Cart from "@/models/Cart";
import Coupon from "@/models/Coupon";
import Order from "@/models/Order";
import Product from "@/models/Product";
import User from "@/models/User";
import { ROLE } from "@/src/constant";
import Email from "@/src/utils/email";
// import dbConnect from "@/lib/dbConnect";
import APIFeatures from "@/utils/apiFeatures";
import { asyncHandler } from "@/utils/asyncHandler";
import isEmpty from "@/utils/is-empty";
// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const {
      // user,
      orderItems,
      address,
      paymentMethod,
      paymentResult,
      totalPrice,
      shippingPrice,
      discountPrice,
      total,
      phone,
      couponId,
    } = req.body;
    const { user } = req;

    if (orderItems && orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }
    if (discountPrice) {
      // {
      //    $inc: { quantity: -1 },
      // }
      const coupon = await Coupon.findById(couponId);
      coupon.quantity = coupon.quantity > 0 ? coupon.quantity - 1 : 0;
      await coupon.save();
    }
    const createdOrder = await Order.create({
      user: req.user._id,
      orderItems,
      address,
      paymentMethod,
      paymentResult,
      totalPrice,
      shippingPrice,
      discountPrice,
      total,
      phone,
      statusTime: [Date.now()],
    });

    const bulkUpdateOps = orderItems.map((item: any) => {
      return {
        updateOne: {
          filter: { _id: item.product },
          update: {
            $inc: {
              countInStock: -Number(item.quantity),
              sold: Number(item.quantity),
            },
          },
        },
      };
    });

    const result = await Product.bulkWrite(bulkUpdateOps);
    // let objectCountInStock = {};
    // const arrayIdProduct = orderItems.map((item) => {
    //    objectCountInStock[mongoose.Types.ObjectId(item.product)] = item.quantity;
    //    return item.product;
    // });
    // console.log(objectCountInStock);
    // const result = await Product.updateMany(
    //    {
    //       _id: { $in: arrayIdProduct },
    //    },
    //    [
    // {
    //    $set: {
    //       countInStock: {
    //          $subtract: ["$countInStock", objectCountInStock["$_id"]],
    //       },
    //       sold: {
    //          $subtract: ["$sold", -objectCountInStock["$_id"]],
    //       },
    //    },
    // },
    //    ]
    //    // [{ $inc: { countInStock: -1, sold: 1 } }]
    // );
    // console.log(result);
    await Cart.updateMany(
      { orderdBy: req.user._id },
      { $pull: { products: { check: true } } },
    );
    const orderDetailURL = `${process.env.ROOT_URL}/customer/order/${createdOrder.id}`;
    const result2 = await new Email(user, orderDetailURL).sendConfirmOrder(
      user as any,
      createdOrder as any,
    );
    console.log("🚀 ~ file: orderController.ts:110 ~ res", result2);

    res.status(201).json(createdOrder);
  },
);
// @desc    Get new order detail
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { id, statusTime } = req.query;
    const { user } = req;
    // let order;
    // if (!statusTime) {
    //   order = await Order.findById(id);

    //   // order = await Order.findById(id).populate({
    //   //   path: "orderItems.product",
    //   //   model: Product,
    //   // });
    // } else order = await Order.findById(id).select("statusTime status");
    const order = await Order.findById(id);
    if (!order) {
      res.status(400);
      throw new Error("Order does not exist");
    }
    if (
      user.role === ROLE.USER &&
      (order?.user as any)?.toString() !== user?._id?.toString()
    ) {
      res.status(403);
      throw new Error("You do not have permission to perform this action");
    }

    // console.log(createdOrder);

    res.status(200).json(order);
  },
);
// @desc    Get My order
// @route   Get /api/orders
// @access  Private
const getMyOrder = asyncHandler(
  async (
    req: NextApiRequest & {
      query: any;
    },
    res: NextApiResponse,
  ) => {
    // console.log(req.user._id);
    // await dbConnect();

    if (isEmpty(req.query?.limit)) req.query.limit = 8;
    const order = await Order.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(req.user!._id) } },
      {
        $project: {
          _id: "$_id",
          status: "$status",
          total: "$total",
          price: "$price",
          paymentResult: "$paymentResult",
          paymentMethod: "$paymentMethod",
          createdAt: "$createdAt",
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $facet: {
          metadata: [
            { $count: "totalOrders" },
            {
              $addFields: {
                currentPage: Number(req.query.page),
                orderPerPage: Number(req.query.limit),
                totalPages: {
                  $ceil: {
                    $divide: ["$totalOrders", Number(req.query.limit)],
                  },
                },
              },
            },
            // {
            //    $addFields: {
            //       totalPages: Math.ceil(
            //          "totalOrders" / Number(req.query.limit)
            //       ),
            //    },
            // },
            // { $addFields: { orderPerPage: Number(req.query.limit) } },
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
        // $unwind: { path: "$orderItems", preserveNullAndEmptyArrays: true },
        $unwind: { path: "$metadata" },
      },
    ]);
    // console.log(order);
    if (!order) {
      res.status(400);
      throw new Error("Can't find orders for that user");
    }

    res.status(200).json(order[0]);
  },
);
// @desc    Get product to review
// @route   Get /api/user/reviews
// @access  Private
const getProductToReview = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log(req.user._id);
    // let dateOffset = (24*60*60*1000) * 5; //5 days
    // let myDate = new Date();
    // myDate.setTime(myDate.getTime() - dateOffset);

    const orderProduct = await Order.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(req.user._id),
          status: { $ne: "Cancelled" },
          createdAt: {
            // $gte: new Date(dayjs().subtract(3, "day").format("YYYY-MM-DD")),
            $gte: new Date(dayjs().subtract(7, "day").toString()),
          },
        },
      },
      // {
      //    $lookup: {
      //       from: "products",
      //       localField: "orderItems.product",
      //       foreignField: "_id",
      //       as: "product",
      //    },
      // },
      {
        // $unwind: { path: "$orderItems", preserveNullAndEmptyArrays: true },
        $unwind: { path: "$orderItems" },
      },
      {
        $match: { "orderItems.commented": { $ne: true } },
      },
      {
        $lookup: {
          from: "products",
          localField: "orderItems.product",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: { path: "$product" },
      },
      // {
      //    $match: { "orderItems.commented": { $ne: true } },
      // },
      {
        $project: {
          _id: 0,
          orderId: "$_id",
          orderStatus: "$status",
          name: "$product.name",
          // image: "$orderItems.image",
          //! ! image: { $arrayElemAt: ["$product.image", 0] }, cach 2
          image: { $first: "$product.image" },
          quantity: "$orderItems.quantity",
          price: "$orderItems.price",
          commented: "$orderItems.commented",
          productId: "$orderItems.product",
          createdAt: "$createdAt",
        },
      },
      // {
      //    $addFields: { name: req.user.name },
      // },
      { $sort: { createdAt: -1 } },
    ]);

    // console.log(createdOrder);

    res.status(200).json({ products: orderProduct, name: req.user.name });
    // res.status(200).json(orderProduct);
  },
);

// @desc    Get latest order
// @route   GET /api/admin/orders/latest
// @access  Private
const getLatestOrder = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const orders = await Order.find()
      .limit(5)
      .populate({ path: "user", select: "name active", model: User })
      .select("createdAt user total status")
      .sort("-createdAt");

    res.status(200).json(orders);
  },
);
// @desc    Get order table admin
// @route   GET /api/admin/orders
// @access  Private/Admin
const getOrders = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    // { image: { $slice: 1 } }
    // ?between=2021-11-15|2021-11-20
    const qs = new MongoQS({
      custom: {
        between: "createdAt",
      },
    });
    let query: any = { ...req.query };
    // console.log(query);
    query = qs.parse(query);

    // console.log(query);
    const count = await Order.countDocuments({
      ...query,
    });
    // query.fields =
    //    "user orderItems address paymentMethod phone total status statusTime createdAt paymentResult updatedAt";
    query.limit = query?.limit || 8;
    query.page = query?.page || 1;
    query.sort = "-createdAt";
    // console.log(query);

    const features = new APIFeatures(Order.find(), query)
      .filter()
      .sort()
      .limitFields()
      .populate({
        path: "user",
        select: "name active",
        model: User,
      })
      .paginate();

    const orders = await features.query;

    res.json({
      orders,
      currentPage: query.page || 1,
      totalPages: Math.ceil(count / query.limit),
      totalOrder: count,
      orderPerPage: query.limit,
    });
    // res.json(users);
  },
);

// @desc    Put update status order
// @route   PUT /api/admin/orders/:id
// @access  Private/Admin
const updateStatusOrder = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const orderStatus = [
      "Ordered Successfully",
      "Shop Received",
      "Getting Product",
      "Packing",
      "Shipping handover",
      "Shipping",
      "Delivered",
      "Cancelled",
    ];
    let order;
    // console.log(orderStatus.findIndex((or) => or === req.body.status) + 1);
    if (req.body.status === "Cancelled") {
      order = await Order.findById(req.query.id);
      if (order.status === "Cancelled") {
        return res.json("This order has been cancelled");
      }
      order.statusTime.unshift(Date.now());
      order.status = "Cancelled";
      order = await order.save();
    } else {
      // order = await Order.findById(req.query.id);
      // const index = orderStatus.findIndex((or) => or === req.body.status) + 1;
      // if (index < order.statusTime.length)
      //    return res.json("This order has been updated");
      // order.statusTime.unshift(Date.now());
      // order.status = req.body.status;
      // order = await order.save();
      const index = orderStatus.findIndex((or) => or === req.body.status);

      order = await Order.updateOne(
        {
          _id: req.query.id,
          [`statusTime.${index}`]: { $exists: false },

          // $nor: [
          //    {
          //       [`statusTime.${index}`]: { $exists: true },
          //    },
          //    { statusTime: { $size: 0 } },
          //    { name: { $size: 1 } },
          // ],
        },
        {
          $push: {
            statusTime: {
              $each: [Date.now()],
              $position: 0,
            },
          },
          $set: { status: req.body.status },
        },
      );
    }

    if (isEmpty(order)) res.json("This order has been updated");
    // const order = await Order.findById(req.query.id);
    // order.statusTime.unshift(Date.now());
    // order.status = req.body.status;
    // const updatedOrder = await order.save();

    res.status(200).json(order);
  },
);
export {
  updateStatusOrder,
  getOrders,
  createOrder,
  getOrderById,
  getMyOrder,
  getProductToReview,
  getLatestOrder,
};
