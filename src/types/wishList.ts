import { Product } from "./product";
import { User } from "./user";

export type WishList = {
  user: User;
  products: Product[];
};
