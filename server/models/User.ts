/* eslint-disable no-invalid-this */
import bcrypt from "bcryptjs";
import crypto from "crypto";
import mongoose, { InferSchemaType, Model } from "mongoose";
import { NextApiResponse } from "next";

import { ROLE } from "@/src/constant";
import { sendUser } from "@/utils/sendUser";

import WishList from "./WishList";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      default() {
        return this.email.split("@")[0].replace(/[^a-zA-Z ]/g, "");
      },
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],

      select: false,
    },
    role: {
      type: String,
      enum: [ROLE.USER, ROLE.ADMIN],
      default: ROLE.USER,
    },
    addressList: {
      type: [
        {
          name: String,
          phone: {
            type: String,
            maxLength: [15, "Phone number cannot be longer than 15 characters"],
          },
          city: String,
          district: String,
          ward: String,
          address: String,
        },
      ],
      default: [],
    },

    phone: {
      type: String,
      maxLength: [15, "Phone number cannot be longer than 15 characters"],
      default: "",
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "male",
    },
    dob: {
      type: Date,
      default: "2000-01-01",
    },
    active: {
      type: Boolean,
      default: true,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual populate
userSchema.virtual("cart", {
  ref: "Cart",
  foreignField: "orderdBy",
  localField: "_id",
  justOne: true,
});
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
userSchema.methods.matchPassword = async function (enteredPassword: any) {
  return bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (this: any, next) {
  this.wasNew = this.isNew; // de access post middware
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
userSchema.pre(/^findOne/, function (this: any, next) {
  this.find({ active: { $ne: false } });

  next();
});
userSchema.post("save", async function (this: any, doc, next) {
  // this point to document the schema cua mongoose con doc la cai ma save to database
  if (this.wasNew) {
    await this.model("WishList", WishList).create({
      user: doc._id,
      products: [],
    });
  }
  // console.log(this.wasNew);
  // console.log(await doc.model("WishList").find());  duopc luon hay this hay doc cung duoc
  next();
});
userSchema.methods.changedPasswordAfter = function (
  this: any,
  JWTTimestamp: any,
) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      (this.passwordChangedAt.getTime() / 1000).toString(),
      10,
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

userSchema.methods.addAddress = async function ({
  defaultAddress,
  ...address
}: any) {
  // if (defaultAddress) {
  //    this.addressList.unshift({ ...address });
  // } else this.addressList.push({ ...address });

  // return await this.save();
  const condition = {
    $each: [{ ...address }],
    $position: defaultAddress ? 0 : undefined,
  };

  return this.constructor.findByIdAndUpdate(
    this._id,
    {
      $push: {
        addressList: {
          ...condition,
        },
      },
    },
    { new: true },
  );
};
userSchema.methods.updateAddress = async function (
  { defaultAddress, ...addressUpdate }: any,
  addressId: any,
) {
  let newAddress;
  if (defaultAddress) {
    this.addressList = this.addressList.filter((address: any) => {
      if (address._id.toString() === addressId.toString()) {
        address.name = addressUpdate.name;
        address.phone = addressUpdate.phone;
        address.city = addressUpdate.city;
        address.district = addressUpdate.district;
        address.ward = addressUpdate.ward;
        address.address = addressUpdate.address;
        newAddress = address;
        return false;
      }
      return true;
    });
    this.addressList.unshift(newAddress);
  } else {
    this.addressList = this.addressList.map((address: any) => {
      if (address._id.toString() === addressId.toString()) {
        address.name = addressUpdate.name;
        address.phone = addressUpdate.phone;
        address.city = addressUpdate.city;
        address.district = addressUpdate.district;
        address.ward = addressUpdate.ward;
        address.address = addressUpdate.address;
      }
      return address;
    });
  }

  return this.save();
};
userSchema.methods.deleteAddress = async function (addressId: any) {
  this.addressList = this.addressList.filter((address: any) => {
    return address._id.toString() !== addressId.toString();
  });
  return this.save();
};
userSchema.methods.updateProfile = async function (user: any, res: any) {
  let changePass = false;

  this.name = user.name || this.name;
  this.phone = user.phone || "";
  this.dob = user.dob || this.dob;
  this.gender = user.gender || this.gender;
  if (user.email) {
    this.email = user.email;
  }
  if (user.password) {
    if (!(await this.matchPassword(user.oldPassword))) {
      res.status(401);
      throw new Error("Wrong password");
    }
    this.password = user.password;
    this.passwordChangedAt = Date.now();
    changePass = true;
  }

  const updatedUser = await this.save();

  sendUser(res, updatedUser, null, changePass);
};
export type UserSchema = InferSchemaType<typeof userSchema>;

export type addressType = UserSchema["addressList"][number];

export interface IUserMethods {
  deleteAddress: (addressId: string) => UserSchema;
  updateProfile: (user: UserSchema, res: NextApiResponse) => void;
  createPasswordResetToken: () => string;
  matchPassword: (enteredPassword: string) => string;
  changedPasswordAfter: (JWTTimestamp: number) => boolean;
  addAddress: (addressObject: addressType) => boolean;
  updateAddress: (
    addressObject: Partial<addressType>,
    addressId: string,
  ) => UserSchema;
}

interface UserDB extends Model<UserSchema, {}, IUserMethods> {}
export type { UserDB };
const User = (mongoose.models.User ||
  mongoose.model("User", userSchema)) as UserDB;

export default User;
