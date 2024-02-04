/* eslint-disable prefer-destructuring */
import jwt from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";

import Cart from "@/models/Cart";
import User, { UserDB } from "@/models/User";
import { asyncHandler } from "@/utils/asyncHandler";

const protect = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    // else if (req.cookies.tokenUser || req.cookies.tokenAdmin) {
    //   token = req.cookies.tokenUser || req.cookies.tokenAdmin;
    // }

    if (!token) {
      res.status(401);

      return next(
        new Error("You are not logged in! Please log in to get access."),
      );
    }
    // console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;

    // let currentUser: InstanceType<UserDB>;
    let currentUser: InstanceType<UserDB>;

    if (req.query.cart === "true") {
      currentUser = await User.findById(decoded.id);
    } else {
      currentUser = await User.findById(decoded.id).populate({
        path: "cart",
        model: Cart,
      });
    }

    // else currentUser = await User.findById(decoded.id).populate("cart");
    // const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      res.status(401);
      return next(
        new Error("The user belonging to this token does no longer exist."),
      );
    }

    if (currentUser.changedPasswordAfter(decoded.iat)) {
      res.status(401);
      return next(
        new Error("User recently changed password! Please log in again."),
      );
    }

    req.user = currentUser;

    next();
  },
);
const getUser = asyncHandler(
  async (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      req.user = null;
      return next();
    }
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET,
    ) as jwt.JwtPayload & { id: string };
    const currentUser: InstanceType<UserDB> = await User.findById(decoded.id);

    req.user = currentUser;

    next();
  },
);

// const admin = (req, res, next) => {
//    if (req.user && req.user.isAdmin) {
//       next();
//    } else {
//       res.status(401);
//       throw new Error("Not authorized as an admin");
//    }
// };
const restrictTo = (...roles: string[]) => {
  return (req: NextApiRequest, res: NextApiResponse, next: NextHandler) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      res.status(403);
      return next(
        new Error("You do not have permission to perform this action"),
      );
    }

    next();
  };
};
export { protect, restrictTo, getUser };
