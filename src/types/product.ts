import { User } from "./user";

export enum Category {
  "Accessories",
  "Home Applications",
  "Kitchen Appliances",
  "Laptops",
  "Smartphone",
  "Televisions",
}

export type Product = {
  _id: number;
  user: User;
  name: string;
  slug: string;
  price: number;
  currentPrice: number;
  image: string[];
  description: string;
  tableInformation: string;
  brand: string;
  category: Category;
  numReviews: number;
  averageRating: number;
  countInStock: number;
  sold: number;
  discount: number;
  active: boolean;
};
