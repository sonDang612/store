import crypto from "crypto";
import MongoQS from "mongo-querystring";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";

import Cart from "@/models/Cart";
import Product from "@/models/Product";
import User from "@/models/User";
import { ROLE } from "@/src/constant";
import notEmpty from "@/src/utils/not-empty";
import APIFeatures from "@/utils/apiFeatures";
import { asyncHandler } from "@/utils/asyncHandler";
import Email from "@/utils/email";
import generateToken from "@/utils/generateToken";
import { removeEmpty } from "@/utils/removeEmpty";
import { sendUser } from "@/utils/sendUser";

import WishList from "../models/WishList";
// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    // console.log(req.headers.host);
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      res.status(400);
      throw new Error("Please provide email and password!");
    }

    // 2) Check if user exists && password is correct
    const user = await User.findOne(
      removeEmpty({
        email,
        role: req.headers.referer.includes("/admin/login")
          ? ROLE.ADMIN
          : "user",
      }),
    ).select("+password");

    if (user && (await user.matchPassword(password))) {
      if (user.role === ROLE.ADMIN) {
        const userRespond = {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          gender: user.gender,
          dob: user.dob,
          token: generateToken(user._id as unknown as string),
        };
        return res.json(userRespond);
      }

      const cart = await Cart.findOne({ orderdBy: user._id }).populate({
        path: "products.product",
        select: {
          name: 1,
          price: 1,
          image: { $slice: 1 },
          countInStock: 1,
        },
        model: Product,
        // select: "name price image countInStock",
      });
      // const cart = await Cart.findOne({ orderdBy: user._id }).populate({
      //    path: "products.product",
      //    select: "name price image countInStock",
      //    match: { image: { $arrayElemAt: ["$image", 0] } },
      // });

      sendUser(res, user, cart?.products || [], true);
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  },
);

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("Please provide email and password!");
    }
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      email,
      password,
    });
    // await WishList.create({
    //    user: user._id,
    //    products: [],
    // });

    if (user) {
      sendUser(res, user, [], true);
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  },
);

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const user = await User.findById(req.user._id);

    if (user) {
      sendUser(res, user, null, false);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  },
);

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    await user.updateProfile(req.body, res);
  },
);
// @desc    add user address
// @route   POST /api/users/address
// @access  Private
const addAddressUser = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const user = await User.findById(req.user._id);
    const updatedUser = await user.addAddress(req.body);

    sendUser(res, updatedUser, null, false);
  },
);
// @desc    update user address
// @route   PATCH /api/users/address/:id
// @access  Private
const updateAddressUser = asyncHandler(
  async (
    req: NextApiRequest & {
      query: any;
    },
    res: NextApiResponse,
  ) => {
    // const { defaultAddress, ...addressUpdate } = req.body;
    // const user = await User.aggregate([
    //    { $match: { _id: req.user._id } },
    //    { $unwind: { path: "$addressList" } },
    // ]);
    // console.log(user);
    // res.json(user);
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const updatedUser = await user.updateAddress(req.body, req.query.id);
    sendUser(res, updatedUser, null, false);
  },
);
// @desc    delete user address
// @route   delete /api/users/address/:id
// @access  Private
const deleteAddressUser = asyncHandler(
  async (
    req: NextApiRequest & {
      query: any;
    },
    res: NextApiResponse,
  ) => {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    const updatedUser = await user.deleteAddress(req.query.id);
    sendUser(res, updatedUser, null, false);
  },
);

// @desc    add to cart user
// @route   POST /api/users/cart
// @access  Private
const addProductToCartUser = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    // const cart = await Cart.findOne({ orderdBy: req.user._id });
    const cart = await Cart.findOne({ orderdBy: req.user._id });
    // const cart = await Cart.findOne({ orderdBy: req.user._id }).populate({
    //    path: "products.product",
    //    select: "name price image countInStock",
    // });

    if (!cart) {
      // res.status(404);
      // throw new Error("Cart not found");
      const newCart = await Cart.create({
        orderdBy: req.user._id,
        products: [
          {
            product: req.body.product,
            quantity: req.body.quantity,
            check: req.body.check || false,
          },
        ],
      });

      return res.json(newCart.products);
    }

    const updatedCart = await cart.addOrUpdateCart(req.body);

    res.json(updatedCart.products);
  },
);
// @desc    delete product cart user
// @route   DELETE /api/users/cart/:id
// @access  Private
const deleteProductToCartUser = asyncHandler(
  async (
    req: NextApiRequest & {
      query: any;
    },
    res: NextApiResponse,
  ) => {
    // const cart = await Cart.findOne({ orderdBy: req.user._id });
    const cart = await Cart.findOne({ orderdBy: req.user._id });
    // const cart = await Cart.findOne({ orderdBy: req.user._id }).populate({
    //    path: "products.product",
    //    select: "name price image countInStock",
    // });

    if (!cart) {
      res.status(404);
      throw new Error("Cart not found");
    }

    const updatedCart = await cart.deleteProductCart(req.query.id);

    res.json(updatedCart.products);
  },
);

// @desc    update to cart user
// @route   PATCH /api/users/cart
// @access  Private
const updateProductToCartUser = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const cart = await Cart.findOne({ orderdBy: req.user._id }).populate({
      path: "products.product",
      // select: "name price image countInStock",
      select: {
        name: 1,
        currentPrice: 1,
        image: { $slice: 1 },
        countInStock: 1,
        discount: 1,
      },
      model: Product,
    });

    if (!cart) {
      res.status(404);
      throw new Error("Cart not found");
    }

    const updatedCart = await cart.updateQuantityOrCheck(req.body);

    res.json(updatedCart.products);
  },
);

// @desc    Get a user data
// @route   GET /api/users/me
// @access  Private/Admin
const getMe = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    // const cart = await Cart.findOne({ orderdBy: req.user._id });
    // const cart = await Cart.findOne({ orderdBy: req.user._id }).populate({
    //    path: "products.product",
    //    select: "name price image countInStock",
    // });
    // console.log(req.query.cart === "true");
    const { user } = req as any;
    if (req.query.cart === "true") {
      user.cart = await Cart.findOne({ orderdBy: req.user._id }).populate({
        path: "products.product",
        // select: "name price image countInStock",
        select: {
          name: 1,
          currentPrice: 1,
          image: { $slice: 1 },
          countInStock: 1,
          discount: 1,
          active: 1,
        },
        model: Product,
      });
    }
    sendUser(
      res,
      req.user,
      (user?.cart?.products || []).filter(
        (p: any) => p?.product?.active !== false,
      ),
      false,
    );
    // sendUser(res, req.user, cart?.products || [], false);
    // sendUser(res, req.user, [], false);
  },
);

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const user = await User.findById(req.query.id).select("-password");

    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  },
);
// @desc    Get user by ID
// @route   GET /api/users/:token
// @access  Private/Admin
const checkTokenReset = asyncHandler(
  async (
    req: NextApiRequest & {
      query: any;
    },
    res: NextApiResponse,
  ) => {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.query.token)
      .digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // if (!user) {
    //    res.status(400);
    //    throw new Error("Token is invalid or has expired");
    // }
    res.json({ message: user ? "ok" : "Token is invalid or has expired" });
  },
);

const forgotPassword = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(404);
      throw new Error("There is no user with email address.");
    }

    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    try {
      const resetURL = `${process.env.ROOT_URL}/resetpassword/${resetToken}`;
      // const resetURL = `${req.headers.referer}resetpassword/${resetToken}`;
      console.log(resetURL);

      await new Email(user, resetURL).sendPasswordReset();
      res.json({
        status: "success",
        message: `An email have sent to your email ${req.body.email}!`,
      });
      // res.status(200).json({
      //    status: "success",
      //    message: `Token sent to email ${req.body.email}!`,
      // });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
      console.log(err);
      res.status(500);
      throw new Error("There was an error sending the email. Try again later!");
    }
  },
);

const resetPassword = asyncHandler(
  async (
    req: NextApiRequest & {
      query: any;
    },
    res: NextApiResponse,
    next: NextHandler,
  ) => {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.query.token)
      .digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      res.status(400);
      throw new Error("Token is invalid or has expired");
    }
    user.password = req.body.password;

    // user.passwordChangedAt = Date.now() - 1000;
    user.passwordChangedAt = Date.now() as unknown as Date;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({
      status: "success",
      message: `Password reset successfully`,
    });
  },
);
// @desc    Get user table admin
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = asyncHandler(
  async (
    req: NextApiRequest & {
      query: any;
    },
    res: NextApiResponse,
  ) => {
    // { image: { $slice: 1 } }
    // ?between=2021-11-15|2021-11-20
    const qs = new MongoQS({
      custom: {
        between: "createdAt",
      },
    });
    let query = { ...req.query };
    query = qs.parse(query);
    // query.fields = "";
    // console.log(query);
    const count = await User.countDocuments({
      role: { $ne: "admin" },
      ...query,
    });
    query.limit = query?.limit || 8;
    query.page = query?.page || 1;
    // console.log(query);

    const features = new APIFeatures(
      User.find({ role: { $ne: ROLE.ADMIN } }),
      // User.find({ role: { $ne: "admin" } }),
      // User.find({ role: { $ne: "admin" } }, { addressList: { $slice: 1 } }),
      query,
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const users = await features.query;

    res.json({
      users,
      currentPage: query.page || 1,
      totalPages: Math.ceil(count / query.limit),
      totalUser: count,
      userPerPage: query.limit,
    });
    // res.json(users);
  },
);
// @desc    update user information
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const {
      city,
      district,
      ward,
      addressDetail,
      phoneAddress,
      nameAddress,
      addressId,
      name,
      phone,
      email,
      dob,
      gender,
    } = req.body;
    // console.log(req.body);
    const conditionUpdate = removeEmpty({
      _id: req.query.id,
      "addressList._id": addressId,
    });
    const updateObject = removeEmpty({
      [`addressList.$.city`]: city,
      [`addressList.$.district`]: district,
      [`addressList.$.ward`]: ward,
      [`addressList.$.address`]: addressDetail,
      [`addressList.$.phone`]: phoneAddress,
      [`addressList.$.name`]: nameAddress,
      name,
      phone,
      email,
      dob,
      gender,
    });
    // console.log(updateObject);
    // const result = await User.findByIdAndUpdate(
    //    req.query.id,

    //    {
    //       ...updateObject,
    //    },
    //    { new: true }
    // );
    const result = await User.updateOne(
      {
        ...conditionUpdate,
      },
      {
        $set: {
          ...updateObject,
        },
      },
    );
    // console.log(result);
    res.json(result);
    // res.json(users);
  },
);
// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(
  async (
    req: NextApiRequest & {
      query: any;
    },
    res: NextApiResponse,
  ) => {
    let result = null;
    const arrayUserId = req.query.id.split(",");

    if (arrayUserId.length !== 1) {
      result = await User.updateMany(
        { _id: { $in: arrayUserId } },
        {
          $set: {
            active: false,
          },
        },
      );
    } else {
      result = await User.updateOne({ _id: arrayUserId }, [
        {
          $set: {
            active: { $cond: [{ $eq: ["$active", true] }, false, true] },
          },
        },
      ]);
    }

    res.json(result);
    // res.json(users);
  },
);
// @desc    Delete user address admin
// @route   DELETE /api/admin/users/:id/address/:addressId
// @access  Private/Admin
const deleteUserAddressAdmin = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse) => {
    const result = await User.updateOne(
      { _id: req.query.id },
      { $pull: { addressList: { _id: req.query.addressId } } },
    );

    res.json(result);
    // res.json(users);
  },
);
// @desc    Get a admin data
// @route   GET /api/users/admin
// @access  Private/Admin
const getMeAdmin = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    if (req.user.role !== ROLE.ADMIN) {
      next(new Error("You do not have permission to perform this action"));
    }

    const userRespond = {
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      gender: req.user.gender,
      dob: req.user.dob,
      // token: generateToken(user._id),
    };
    return res.json(userRespond);
  },
);
// @desc    Get user like product
// @route   GET /api/users/likeProduct?id=123
// @access  Public
const checkUserLikeProduct = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    let like = false;
    if (notEmpty(req.user) && req.user.role === ROLE.USER) {
      like =
        (await WishList.countDocuments({
          user: req.user._id,
          products: {
            $elemMatch: { $eq: req.query.id },
          },
        })) > 0;
      // console.log(req.user, like);
    }
    res.json({ like: Boolean(like) });
  },
);
export {
  checkTokenReset,
  getMeAdmin,
  deleteUserAddressAdmin,
  resetPassword,
  forgotPassword,
  getUserById,
  updateUser,
  deleteUser,
  updateProductToCartUser,
  getMe,
  getUsers,
  deleteProductToCartUser,
  authUser,
  registerUser,
  getUserProfile,
  addAddressUser,
  updateUserProfile,
  addProductToCartUser,
  deleteAddressUser,
  updateAddressUser,
  checkUserLikeProduct,
};
