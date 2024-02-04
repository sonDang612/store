import type { Product } from "./product";
import type { User } from "./user";

export type CartItem = {
  product: Product;
  quantity: number;
  check: boolean;
};

export type Cart = {
  products: CartItem[];
  orderedBy: User;
};
