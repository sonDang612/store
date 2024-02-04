import type { Product } from "./product";
import type { User } from "./user";

export type OrderItem = {
  id: number;
  name: string;
  quantity: number;
  image: string;
  price: number;
  product: Product;
  commented: boolean;
};

export type PaymentResult = {
  id: string;
  status: string;
  created: string;
  receipt_email: string;
  receipt_name: string;
};

export enum OrderStatus {
  "Ordered Successfully",
  "Shop Received",
  "Getting Product",
  "Packing",
  "Shipping handover",
  "Shipping",
  "Delivered",
  "Cancelled",
}

export type Order = {
  _id: number;
  user: User;
  orderItems: Array<OrderItem>;
  address: string;
  paymentMethod: string;
  phone: string;
  paymentResult: PaymentResult;
  totalPrice: number;
  shippingPrice: number;
  discountPrice: number;
  total: number;
  status: OrderStatus;
  statusTime: [Date];
  createdAt: Date;
};
