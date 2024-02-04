import dayjs from "dayjs";
import type { NextApiRequest, NextApiResponse } from "next";

import Order from "@/models/Order";
import Product from "@/models/Product";
import Review from "@/models/Review";
import User from "@/models/User";
import { ROLE } from "@/src/constant";
import { asyncHandler } from "@/utils/asyncHandler";
// @desc    get statistic web
// @route   get /api/admin/statistic
// @access  Private
const getStatisticWeb = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const numUsers = await User.countDocuments({ role: { $ne: ROLE.ADMIN } });
    const numReviews = await Review.countDocuments({ isAdmin: { $ne: true } });
    const numProducts = await Product.countDocuments();
    const numOrders = await Order.countDocuments();

    res.status(200).json([numReviews, numUsers, numOrders, numProducts]);
  },
);
// @desc    get each category sell
// @route   get /api/admin/category?year=
// @access  Private
const getEachCategorySell = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const year = req.query?.year || new Date().getFullYear();

    let categoryStatistic = await Order.aggregate([
      {
        $addFields: {
          year: {
            $year: { date: "$createdAt", timezone: "Asia/Ho_Chi_Minh" },
          },
        },
      },
      { $match: { year: Number(year) } },
      {
        $unwind: { path: "$orderItems" },
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
      //   {
      //      $addFields: { category: "$product.category" },
      //   },
      {
        $group: {
          _id: {
            $month: {
              date: "$createdAt",
              timezone: "Asia/Ho_Chi_Minh",
            },

            // year: {
            //    $year: { date: "$createdAt", timezone: "Asia/Ho_Chi_Minh" },
            // },
          },
          // "Accessories",
          // "Home Applications",
          // "Kitchen Appliances",
          // "Laptops",
          // "Smartphone",
          // "Televisions",
          Accessories: {
            $sum: {
              $cond: [{ $eq: ["$product.category", "Accessories"] }, 1, 0],
            },
          },
          "Home Applications": {
            $sum: {
              $cond: [
                { $eq: ["$product.category", "Home Applications"] },
                1,
                0,
              ],
            },
          },
          "Kitchen Appliances": {
            $sum: {
              $cond: [
                { $eq: ["$product.category", "Kitchen Appliances"] },
                1,
                0,
              ],
            },
          },
          Laptops: {
            $sum: {
              $cond: [{ $eq: ["$product.category", "Laptops"] }, 1, 0],
            },
          },
          Smartphone: {
            $sum: {
              $cond: [{ $eq: ["$product.category", "Smartphone"] }, 1, 0],
            },
          },
          Televisions: {
            $sum: {
              $cond: [{ $eq: ["$product.category", "Televisions"] }, 1, 0],
            },
          },
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      {
        $project: {
          _id: 0,
        },
      },
      //   {
      //      $group: {
      //         _id: "$product.category",
      //         total: { $sum: 1 },
      //         //    averageRating: { $avg: "$rating" },
      //      },
      //   },
    ]);
    // console.log(categoryStatistic);
    function add(arr: any[], object: any, callback: any) {
      const found = arr.find(callback);
      if (!found) {
        arr.push(object);
      }
      return arr;
    }
    if (Number(year) === 2021) {
      const listFake = [
        {
          month: 1,
          Accessories: 3,
          "Home Applications": 5,
          "Kitchen Appliances": 6,
          Laptops: 9,
          Smartphone: 5,
          Televisions: 7,
        },
        {
          month: 2,
          Accessories: 6,
          "Home Applications": 2,
          "Kitchen Appliances": 7,
          Laptops: 5,
          Smartphone: 8,
          Televisions: 2,
        },
        {
          month: 3,
          Accessories: 5,
          "Home Applications": 3,
          "Kitchen Appliances": 3,
          Laptops: 2,
          Smartphone: 1,
          Televisions: 6,
        },
        {
          month: 4,
          Accessories: 2,
          "Home Applications": 7,
          "Kitchen Appliances": 5,
          Laptops: 4,
          Smartphone: 9,
          Televisions: 2,
        },
        {
          month: 5,
          Accessories: 7,
          "Home Applications": 10,
          "Kitchen Appliances": 13,
          Laptops: 7,
          Smartphone: 9,
          Televisions: 5,
        },
        {
          month: 6,
          Accessories: 3,
          "Home Applications": 2,
          "Kitchen Appliances": 2,
          Laptops: 10,
          Smartphone: 5,
          Televisions: 13,
        },
        {
          month: 7,
          Accessories: 4,
          "Home Applications": 6,
          "Kitchen Appliances": 6,
          Laptops: 8,
          Smartphone: 3,
          Televisions: 1,
        },
        {
          month: 8,
          Accessories: 5,
          "Home Applications": 2,
          "Kitchen Appliances": 8,
          Laptops: 13,
          Smartphone: 3,
          Televisions: 7,
        },
        {
          month: 9,
          Accessories: 2,
          "Home Applications": 5,
          "Kitchen Appliances": 3,
          Laptops: 2,
          Smartphone: 7,
          Televisions: 10,
        },
        {
          month: 10,
          Accessories: 2,
          "Home Applications": 8,
          "Kitchen Appliances": 5,
          Laptops: 4,
          Smartphone: 3,
          Televisions: 8,
        },
        {
          month: 11,
          Accessories: 4,
          "Home Applications": 9,
          "Kitchen Appliances": 5,
          Laptops: 10,
          Smartphone: 7,
          Televisions: 6,
        },
        {
          month: 12,
          Accessories: 5,
          "Home Applications": 3,
          "Kitchen Appliances": 9,
          Laptops: 10,
          Smartphone: 12,
          Televisions: 7,
        },
      ];

      for (let i = 1; i <= 12; i++) {
        add(categoryStatistic, listFake[i - 1], (el: any) => el.month === i);
      }
    } else {
      for (let i = 1; i <= 12; i++) {
        add(
          categoryStatistic,
          {
            month: i,
            Accessories: 0,
            "Home Applications": 0,
            "Kitchen Appliances": 0,
            Laptops: 0,
            Smartphone: 0,
            Televisions: 0,
          },
          (el: any) => el.month === i,
        );
      }
    }
    categoryStatistic = categoryStatistic
      .sort((a, b) => a.month - b.month)
      .map((data) => {
        return {
          ...data,
          month: dayjs(`2000-${data.month}-1`).format("MMMM"),
        };
      });
    // console.log(categoryStatistic);
    res.status(200).json(categoryStatistic);
  },
);
// @desc    get revenue every day in month
// @route   get /api/admin/revenue
// @access  Private
const getTotalRevenue = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const year = req.query?.year || new Date().getFullYear();
    const month = req.query?.month || new Date().getMonth() + 1;

    // console.log(year);
    // console.log(month);
    let categoryStatistic = await Order.aggregate([
      {
        $project: {
          // orderItems: "$orderItems",
          // quantity: { $first: "$orderItems.quantity" },
          // price: { $first: "$orderItems.price" },
          total: "$total",

          // total: {
          //    $multiply: [
          //       { $first: "$orderItems.price" },
          //       { $first: "$orderItems.quantity" },
          //    ],
          // },
          createdAt: "$createdAt",
          month: {
            $month: { date: "$createdAt", timezone: "Asia/Ho_Chi_Minh" },
          },
          year: {
            $year: { date: "$createdAt", timezone: "Asia/Ho_Chi_Minh" },
          },
          // month: { $month: "$createdAt" },
        },
      },
      // { $match: { month: 12, year: 2021 } },
      { $match: { month: Number(month), year: Number(year) } },
      // { $match: { createdAt: dayjs().get("month") + 1 } },
      // {
      //    $unwind: { path: "$orderItems" },
      // },
      // {
      //    $lookup: {
      //       from: "products",
      //       localField: "orderItems.product",
      //       foreignField: "_id",
      //       as: "product",
      //    },
      // },
      // {
      //    $unwind: { path: "$product" },
      // },
      // //   {
      // //      $addFields: { category: "$product.category" },
      // //   },
      {
        $group: {
          _id: {
            $dayOfMonth: {
              date: "$createdAt",
              timezone: "Asia/Ho_Chi_Minh",
            },
          },
          totalRevenue: {
            $sum: "$total",
          },
          month: { $first: "$month" },
          // quantity: { $sum: "$orderItems.quantity" },
        },
      },
      // {
      //    $addFields: {
      //       totalRevenue: {
      //          $multiply: ["$orderItems.quantity", "$orderItems.price"],
      //       },
      //    },
      // },
      {
        $addFields: { day: "$_id" },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    function add(arr: any[], object: any, callback: any) {
      const found = arr.find(callback);
      if (!found) {
        arr.push(object);
      }
      return arr;
    }
    const totalDay = dayjs(`${year}-${month}-22`).daysInMonth();
    if (Number(month) === 1 && Number(year) === 2021) {
      for (let i = 1; i <= totalDay; i++) {
        let totalRevenue = i % 3 === 0 ? 100 * (i + 1.9) : 90 * (i + 2);
        if (i > 3 && i < 10) totalRevenue = (i + 1) * 300;
        add(
          categoryStatistic,
          {
            totalRevenue,
            month,
            day: i,
          },
          (el: any) => el.day === i,
        );
      }
    } else {
      for (let i = 1; i <= totalDay; i++) {
        add(
          categoryStatistic,
          {
            totalRevenue: 0,
            month,
            day: i,
          },
          (el: any) => el.day === i,
        );
      }
    }

    categoryStatistic = categoryStatistic
      .sort((a, b) => a.day - b.day)
      .map((data) => {
        return {
          date: dayjs(`${year}-${data.month}-${data.day}`).format("YYYY-MM-DD"),
          value: data.totalRevenue,
        };
      });
    // console.log(categoryStatistic);
    res.status(200).json(categoryStatistic);
  },
);

export { getEachCategorySell, getTotalRevenue, getStatisticWeb };
