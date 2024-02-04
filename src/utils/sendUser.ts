import { NextApiResponse } from "next";

import generateToken from "./generateToken";

export const sendUser = (
  res: NextApiResponse,
  user: any,
  cart: any,
  sendToken = false,
) => {
  const userRespond: any = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    gender: user.gender,
    dob: user.dob,
    phone: user.phone || "",
    addressList: user.addressList || [],
  };
  if (sendToken) userRespond.token = generateToken(user._id);
  if (Array.isArray(cart)) userRespond.cart = cart;

  res.json(userRespond);
};
