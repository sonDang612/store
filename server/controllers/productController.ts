/* eslint-disable no-console */

import recommend from "collaborative-filter";
import MongoQS from "mongo-querystring";
import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import slugify from "slugify";

import Product from "@/models/Product";
import WishList from "@/models/WishList";
import { ROLE } from "@/src/constant";
import { keyBy } from "@/src/utils/keyBy";
import APIFeatures from "@/utils/apiFeatures";
import { asyncHandler } from "@/utils/asyncHandler";
import { convertCategory } from "@/utils/convertCategory";
import isEmpty from "@/utils/is-empty";
import notEmpty from "@/utils/not-empty";
import { removeEmpty } from "@/utils/removeEmpty";
// @desc    Fetch all products name
// @route   GET /api/products/names
// @access  Public
const getNameProduct = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    // const names = await Product.aggregate([
    //    {
    //       $project: {
    //          image: { $arrayElemAt: ["$image", 0] },
    //          name: 1,
    //       },
    //    },
    // ]);
    // res.json(names);
    const names = await Product.find(
      { active: { $ne: false } },
      { image: { $slice: 1 } },
    ).select("name _id");
    res.json(names);
  },
);

// @desc    Fetch all products with keyword
// @route   GET /api/products/search
// @access  Public
const getProducts = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    let query: any = { ...req.query };
    // console.log(query);
    const qs = new MongoQS({
      // string: {
      //    toNumber: true,
      //    toBoolean: true,
      // },
    });
    // console.log(query);
    query = qs.parse(query);
    // console.log(query);
    const queryCount = { ...query };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryCount[el]);

    // query.limit = query?.limit || 12;
    // !co slice roi thi khoi select image nua
    // query.fields = "name,currentPrice,averageRating,sold,discount,slug";

    if (
      notEmpty(query.averageRating) &&
      typeof query.averageRating !== "object"
    ) {
      const arrayRating = Number.isInteger(query.averageRating)
        ? [query.averageRating]
        : query.averageRating.split(",");
      const queryRating = arrayRating.map((rating: string) => {
        // console.log(rating);
        return {
          averageRating: { $gte: Number(rating), $lt: Number(rating) + 1 },
        };
      });

      delete queryCount.averageRating;
      delete query.averageRating;
      queryCount.$or = queryRating;
      query.$or = queryRating;
      // console.log(queryRating);
    }

    const count = await Product.countDocuments({
      ...queryCount,
    });
    // query["$or"] = [
    //    { averageRating: { $gte: 4, $lt: 5 } },
    //    { averageRating: { $gte: 1, $lte: 2 } },
    //    // { averageRating: { $gte: 4, $lt: 5 } },
    //    // { averageRating: { $gte: 2, $lt: 3 } },
    // ];
    // console.log(query);
    // { active: { $ne: false } }
    const features = new APIFeatures(
      Product.find({}, { image: { $slice: 1 } }),
      query,
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const productFilter = await features.query;

    // const condition = () => {
    //    let queryMaxMin = {};
    //    if (query.category) queryMaxMin.category = query.category;
    //    if (query.name) queryMaxMin.name = query.name;
    //    return queryMaxMin;
    // };
    // let maxMinPrice;
    // if (notEmpty(productFilter)) {
    //    maxMinPrice = await Product.aggregate([
    //       { $match: condition() },
    //       {
    //          $group: {
    //             _id: query.category ? "$category" : null,
    //             minPrice: { $min: "$price" },
    //             maxPrice: { $max: "$price" },
    //          },
    //       },
    //    ]);
    // }

    res.json({
      products: productFilter,
      currentPage: query.page || 1,
      totalPages: Math.ceil(count / query.limit),
      totalProduct: count,
      productPerPage: query.limit,

      // test: await Product.find({}, { image: { $slice: 1 } }).limit(8),
      // minPrice: notEmpty(maxMinPrice) ? Math.floor(maxMinPrice[0].minPrice) : 0,
      // maxPrice: notEmpty(maxMinPrice) ? Math.ceil(maxMinPrice[0].maxPrice) : 0,
      ...req?.maxMinPrice,
    });
  },
);

// @desc    Fetch all products discount
// @route   GET /api/products/discount
// @access  Public
const getProductsDiscount = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log(req.headers.referer);
    // await dbConnect();
    // const now = dayjs().format("YYYY-MM-DD");
    // console.log(now);
    const productsDiscount = await Product.find(
      {
        discount: { $gt: 0 },
        active: { $ne: false },
      },
      { image: { $slice: 1 } },
    ).select("currentPrice discount slug");
    // }).limit(6);

    res.json(productsDiscount);
  },
);
// @desc    Fetch all products category
// @route   GET /api/products/category/:category
// @access  Public
const getProductsCategory = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const category = convertCategory(req.query.category as string); // viet hoa thoi voi thay dau - thanh ' '
    // console.log(req.query);
    const qs = new MongoQS({
      // string: {
      //    toNumber: false,
      //    toBoolean: false,
      // },
    });
    let query: any = { ...req.query, category };
    query = qs.parse(query);
    query.fields = "-description";
    query.limit = query?.limit || 12;
    query.page = query?.page || 1;
    // console.log(query);
    const features = new APIFeatures(Product.find({}), query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const productsCategory = await features.query;

    const maxMinPrice = await Product.aggregate([
      { $match: { category } },
      {
        $group: {
          _id: "$category",
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);
    const { minPrice, maxPrice } = maxMinPrice[0];
    // console.log(maxMinPrice[0], productsCategory.length);
    res.json({
      productsCategory,
      minPrice: Math.floor(minPrice),
      maxPrice: Math.ceil(maxPrice),
    });
    // res.json(query);
  },
);

// @desc    Fetch all number of products on each category
// @route   GET /api/products/category
// @access  Public
const getProductsNumberCategory = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log(req.headers.referer);
    // await dbConnect();
    const productsNumberCategory = await Product.aggregate([
      { $match: { active: { $ne: false } } },
      { $group: { _id: "$category", total: { $sum: 1 } } },
    ]);
    // console.log(productsNumberCategory);
    res.json(productsNumberCategory);
  },
);

// @desc    Fetch all products new arrival
// @route   GET /api/products/new
// @access  Public
const getProductsNewArrival = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log(req.headers.referer);
    // await dbConnect();

    const productsNewArrival = await Product.find(
      { active: { $ne: false } },
      { image: { $slice: 1 } },
    )
      .select("name currentPrice averageRating sold discount slug numReviews")
      .sort("-createdAt")
      .limit(12);
    res.json(productsNewArrival);
  },
);
// @desc    Fetch all products top rating
// @route   GET /api/products/toprating
// @access  Public
const getProductsTopRating = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log(req.headers.referer);
    // await dbConnect();
    const productsTopRating = await Product.find(
      { active: { $ne: false } },
      { image: { $slice: 1 } },
    )
      .select("name currentPrice averageRating sold discount slug numReviews")
      .sort("-averageRating")
      .limit(12);
    res.json(productsTopRating);
  },
);

// @desc    Fetch all products best selling
// @route   GET /api/products/bestselleing
// @access  Public
const getProductsBestSelling = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log(req.headers.referer);
    // await dbConnect();
    const productsBestSelling = await Product.find(
      { active: { $ne: false } },
      { image: { $slice: 1 } },
    )
      .select("currentPrice slug sold averageRating numReviews name discount")
      .sort("-sold")
      .limit(7);
    res.json(productsBestSelling);
  },
);

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const product: any = await Product.findOne({ _id: req.query.id });

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    // console.log(req.user);
    // console.log(product._doc);
    // let like = false;
    // if (notEmpty(req.user) && req.user.role === ROLE.USER) {
    //   like =
    //     (await WishList.countDocuments({
    //       user: req.user._id,
    //       products: {
    //         $elemMatch: { $eq: req.query.id },
    //       },
    //     })) > 0;
    //   // console.log(req.user, like);
    // }
    // product._doc.like = Boolean(like);
    // const productDetail = { ...product._doc, like };
    // console.log(product);

    res.json(product);
  },
);

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(4);

    res.json(products);
  },
);
// @desc    Edit a product
// @route   PUT /api/admin/products/:id
// @access  Public
const updateProduct = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const {
      image,
      name,
      price,
      category,
      countInStock,
      discount,
      description,
      brand,
      active,
      tableInformation,
    } = req.body;
    // console.log(
    //    removeEmpty({
    //       image,
    //       name,
    //       price,
    //       category,
    //       countInStock,
    //       discount: discount === "" ? 0 : discount,
    //       description,
    //       brand,
    //       slug: name ? slugify(name) : null,
    //       currentPrice:
    //          discount > 0 ? (price * (1 - discount / 100)).toFixed(2) : price,
    //       active: active ? active : null,
    //    })
    // );
    const product = await Product.findByIdAndUpdate(
      req.query.id,
      removeEmpty({
        image: image?.length === 0 ? ["/images/sample.png"] : image,
        name,
        price,
        category,
        countInStock,
        discount,
        description,
        brand,
        slug: name ? slugify(name) : null,
        currentPrice:
          discount > 0 ? (price * (1 - discount / 100)).toFixed(2) : price,
        active: active || null,
        tableInformation,
      }),
      { new: true },
    );
    // console.log(product.description);
    res.json(product);
  },
);
// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const product = await Product.findByIdAndUpdate(req.query.id, {
      active: false,
    });

    if (product) {
      res.json({ message: "Product removed", product });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  },
);
// @desc    Create a product
// @route   POST /api/products
// @access  Public
const createProduct = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const {
      image,
      name,
      price,
      category,
      countInStock,
      discount,
      description,
      brand,
    } = req.body;
    // console.log(
    //    removeEmpty({
    //       user: req.user._id,
    //       name,
    //       slug: name ? slugify(name) : null,
    //       price,
    //       currentPrice:
    //          discount > 0 ? (price * (1 - discount / 100)).toFixed(2) : price,
    //       image: isEmpty(image) ? ["/images/sample.png"] : image,
    //       description,
    //       brand,
    //       category,
    //       countInStock,
    //       discount,
    //       active: true,
    //    })
    // );
    const product = await Product.create(
      removeEmpty({
        user: req.user._id,
        name,
        slug: name ? slugify(name) : null,
        price,
        currentPrice:
          discount > 0 ? (price * (1 - discount / 100)).toFixed(2) : price,
        image: isEmpty(image) ? ["/images/sample.png"] : image,
        description,
        brand,
        category,
        countInStock,
        discount,
        active: true,
      }),
    );
    res.json(product);
  },
);
// @desc    Get suggest products
// @route   GET /api/products/:id/suggest
// @access  Public
const getSuggestProduct = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log(req.headers.referer);
    // await dbConnect();
    // recommend
    const { id } = req.query;
    const { category } = await Product.findById(id);
    // const suggestProduct = await Product.find(
    //   {
    //     _id: { $ne: id },
    //     active: { $ne: false },
    //     category,
    //   },
    //   { image: { $slice: 1 } },
    // )
    //   .select(
    //     "name currentPrice averageRating sold discount slug category numReviews",
    //   )
    //   .sort("-sold")
    //   .limit(6);
    let productLiked = await WishList.aggregate([
      {
        $unwind: {
          path: "$products",
        },
      },
      {
        $group: {
          _id: "$products",
          liked: {
            $sum: 1,
          },
        },
      },
    ]);
    productLiked = keyBy(productLiked, "_id");
    let suggestProducts = await Product.find(
      {
        // _id: { $ne: id },
        active: { $ne: false },
        category,
      },
      { image: { $slice: 1 } },
    ).select(
      "name currentPrice averageRating sold discount slug category numReviews active",
    );
    // .sort("-sold -averageRating");
    suggestProducts = suggestProducts.sort((a, b) => {
      const num1Like = productLiked[a.id]?.liked || 0;
      const num2Like = productLiked[b.id]?.liked || 0;
      return num2Like - num1Like;
    });
    // console.log(
    //   "🚀 ~ file: productController.ts:498 ~ suggestProducts=suggestProducts.sort ~ suggestProducts",
    //   suggestProducts,
    // );
    const currentUserId = req.user?.id;

    const users = await WishList.find();
    const userIndex = users.findIndex((u) =>
      (u.user.equals as any)(currentUserId),
    );
    const matrixLike: number[][] = [];
    users.forEach((user, i) => {
      const userWishlist = user.products;
      if ((user.user.equals as any)(currentUserId)) {
        userWishlist.push(new mongoose.Types.ObjectId(id as string) as any);
      }

      suggestProducts.forEach((product) => {
        if (userWishlist.includes(product.id)) {
          (matrixLike[i] = matrixLike[i] || []).push(1);
        } else (matrixLike[i] = matrixLike[i] || []).push(0);
      });
    });
    if (!currentUserId) {
      const productIndex = suggestProducts.findIndex(
        (p) => p.id.toString() === id.toString(),
      );
      matrixLike.push(Array(suggestProducts.length).fill(0));
      matrixLike[matrixLike.length - 1][productIndex] = 1;
    }
    // console.log("🚀 ~ file: productController.ts:527 ~ matrixLike", matrixLike);
    const result: number[] = recommend.cFilter(
      matrixLike,

      userIndex >= 0 ? userIndex : matrixLike.length - 1,
    );
    // console.log(matrixLike);
    // const array = JSON.parse(JSON.stringify(suggestProducts));
    let newSuggestProducts: typeof suggestProducts = [];
    result.forEach((priorityIndex) => {
      newSuggestProducts.push(suggestProducts[priorityIndex]);
    });

    newSuggestProducts = [
      ...newSuggestProducts,
      ...suggestProducts.filter(
        (p, i) => !(result.includes(i) || p.id.toString() === id),
      ),
    ].filter(Boolean);

    res.json(newSuggestProducts);
    // res.json(newSuggestProducts.filter((p) => p.id.toString() !== id));
    // res.json(suggestProducts.filter((p) => p.id.toString() !== id));
  },
);
export {
  getSuggestProduct,
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  getTopProducts,
  getNameProduct,
  getProductsDiscount,
  getProductsNewArrival,
  getProductsBestSelling,
  getProductsCategory,
  getProductsNumberCategory,
  getProductsTopRating,
};
