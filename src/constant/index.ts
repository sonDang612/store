const COLOR = {
  green: "#64ea91",
  blue: "#8fc9fb",
  purple: "#d897eb",
  red: "#f69899",
  yellow: "#f8c82e",
  peach: "#f797d6",
  borderBase: "#e5e5e5",
  borderSplit: "#f4f4f4",
  grass: "#d6fbb5",
  sky: "#c1e0fc",
};

const PRODUCT_CATEGORY = [
  { name: "Accessories", color: COLOR.green },
  { name: "Home Applications", color: COLOR.blue },
  { name: "Kitchen Appliances", color: COLOR.red },
  { name: "Laptops", color: COLOR.yellow },
  { name: "Smartphone", color: COLOR.purple },
  { name: "Televisions", color: COLOR.peach },
];

const PRODUCT_CATEGORY_COLOR: any = {
  Accessories: COLOR.green,
  "Home Applications": COLOR.blue,
  "Kitchen Appliances": COLOR.red,
  Laptops: COLOR.yellow,
  Smartphone: COLOR.purple,
  Televisions: COLOR.peach,
};

const TAG_CATEGORIES = [
  "Accessories",
  "Home Applications",
  "Kitchen Appliances",
  "Laptops",
  "Smartphone",
  "Televisions",
];

const ORDER_STATUS = [
  "Ordered Successfully",
  "Shop Received",
  "Getting Product",
  "Packing",
  "Shipping handover",
  "Shipping",
  "Delivered",
  "Cancelled",
];

const ORDER_STATUS_WITHOUT_CANCEL = [
  "Ordered Successfully",
  "Shop Received",
  "Getting Product",
  "Packing",
  "Shipping handover",
  "Shipping",
  "Delivered",
  "Cancelled",
];
const ORDER_STATUS_REVERSE = [
  "Delivered",
  "Shipping",
  "Shipping handover",
  "Packing",
  "Getting Product",
  "Shop Received",
  "Ordered Successfully",
];

const ORDER_STATUS_COLOR: any = {
  "Ordered Successfully": "green",
  "Shop Received": "blue",
  "Getting Product": "gold",
  Packing: "orange",
  "Shipping handover": "magenta",
  Shipping: "purple",
  Delivered: "cyan",
  Cancelled: "red",
};

const PAYMENT_COLOR: any = {
  cash: "cyan",
  paypal: "geekblue",
  "Stripe Card": "purple",
  zaloPay: "blue",
  MoMo: "magenta",
};

const TAG_RATING = ["1", "2", "3", "4", "5"];

const REVIEW_STATUS: any = [
  "Very unsatisfied",
  "Unsatisfied",
  "Normal",
  "Satisfied",
  "Extremely satisfied",
];

const REVIEW_PRODUCT_STATUS = [
  "Please rate the product",
  "Very unsatisfied",
  "Unsatisfied",
  "Normal",
  "Satisfied",
  "Extremely satisfied",
];

const QUESTION_PRODUCT = [
  "Share more product information",
  "What is your problem ?",
  "What is your problem ?",
  "What is your problem ?",
  "What is your problem ?",
  "Why do you love the product?",
];

const FILTER_CATEGORY = [
  "all",
  "smartphone",
  "laptops",
  "home-applications",
  "televisions",
  "kitchen-appliances",
  "accessories",
];
const MAP_CATEGORY: Record<string, string> = {
  "Kitchen Appliances": FILTER_CATEGORY[5],
  Smartphone: FILTER_CATEGORY[1],
  Laptops: FILTER_CATEGORY[2],
  Accessories: FILTER_CATEGORY[6],
  Televisions: FILTER_CATEGORY[4],
  "Home Applications": FILTER_CATEGORY[3],
};

const MENU_FILTER = [
  { key: "all", name: "All" },
  { key: "-sold", name: "Selling" },
  { key: "-createdAt", name: "New" },
  { key: "currentPrice", name: " Low Price" },
  { key: "-currentPrice", name: "High Price" },
];

const MENU_USER_INFORMATION = [
  {
    infor: "Account information",
    img: "/images/account.svg",
    url: "/customer/account",
  },
  {
    infor: "Order Management",
    img: "/images/order.svg",
    url: "/customer/order",
  },
  {
    infor: "Address",
    img: "/images/address.svg",
    url: "/customer/address",
  },
  {
    infor: "Review purchased products",
    img: "/images/review.svg",
    url: "/customer/review-product",
  },
  {
    infor: "Wishlist",
    img: "/images/heart.svg",
    url: "/customer/wishlist",
  },
];

const MENU_PRODUCT_CATEGORY = [
  {
    img: "/images/smartphone.jpg",
    name: "smartphone",
    numProduct: "6",
    bg: "#EEDAC2",
  },
  {
    img: "/images/laptop.jpg",
    name: "laptops",
    numProduct: "5",
    bg: "#D1CCE0",
  },
  {
    img: "/images/home-application.jpg",
    name: "home-applications",
    numProduct: "9",
    bg: "#DFE2D7",
  },
  {
    img: "/images/tv.jpg",
    name: "televisions",
    numProduct: "5",
    bg: "#CCE0EB",
  },
  {
    img: "/images/washing-machine.jpg",
    name: "kitchen-appliances",
    numProduct: "3",
    bg: "#EAE1B8",
  },
  {
    img: "/images/accessories.jpg",
    name: "accessories",
    numProduct: "4",
    bg: "#D5EBDE",
  },
];

const QUOTES = [
  {
    name: "Thomas Kin",
    title: "“Fast, Quality Service”",
    city: "Boston, LA",
    avatar: "/images/avatar3.jpg",

    content:
      "“Thank you for your prompt reply! I like dealing with you guys in that you are prompt, helpful and professional and your gear has always worked as advertised.”",
  },
  {
    name: "Vallie Howell",
    title: "“Excellent Work”",

    city: "Boston, LA",
    avatar: "/images/avatar2.jpg",
    content:
      "“I was highly impressed with technical support's efforts, and their immediate response in getting new software out to me.Can you help me install the new software”",
  },
  {
    name: "Bruce Jones",
    title: "“Excellent Service”",

    city: "Boston, LA",
    avatar: "/images/avatar1.jpg",
    content:
      "“I am very impressed with Technocy. They provide my company with a product of superb quality at a great cost. We look forward to a long and prosperous relationship.”",
  },
  {
    name: "John Matthews ",
    title: "“Highly Recommended”",

    city: "Boston, LA",
    avatar: "/images/avatar4.jpg",
    content:
      "“I was highly impressed with technical support's efforts, and their immediate response in getting new software out to me.Can you help me install the new software”",
  },
];

const ROLE = {
  ADMIN: "admin",
  USER: "user",
};
export {
  COLOR,
  PRODUCT_CATEGORY,
  ORDER_STATUS,
  ORDER_STATUS_WITHOUT_CANCEL,
  PRODUCT_CATEGORY_COLOR,
  TAG_CATEGORIES,
  TAG_RATING,
  ORDER_STATUS_COLOR,
  PAYMENT_COLOR,
  REVIEW_STATUS,
  FILTER_CATEGORY,
  MENU_FILTER,
  REVIEW_PRODUCT_STATUS,
  QUESTION_PRODUCT,
  ORDER_STATUS_REVERSE,
  MENU_USER_INFORMATION,
  MENU_PRODUCT_CATEGORY,
  QUOTES,
  ROLE,
  MAP_CATEGORY,
};
