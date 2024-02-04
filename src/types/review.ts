import type { Product } from "./product";
import type { User } from "./user";

export type ResponseReview = {
  user: User;
  comment: string;
  createdAt: Date;
  isAdmin: boolean;
};

export type Review = {
  user: User;
  product: Product;
  possessed: boolean;
  rating: number;
  hide: boolean;
  comment: string;
  numLike: number;
  responseReview: ResponseReview[];
  userLiked: User[];
};
