export enum Gender {
  male,
  female,
  other,
}

export type Address = {
  name: string;
  phone: string;
  city: string;
  district: string;
  ward: string;
  address: string;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  addressList: Address[];
  phone: string;
  gender: Gender;
  dob: Date;
  active: boolean;
  cart?: any;
  passwordChangedAt: Date;
  passwordResetToken: string;
  passwordResetExpires: Date;
};
