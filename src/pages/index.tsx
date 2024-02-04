import { useRef } from "react";

import BestSelling from "@/components/BestSelling/BestSelling";
import CarouselHome from "@/components/Carousel/CarouselHome";
import Category from "@/components/Category/Category";
import ProductsDiscount from "@/components/Discount/ProductsDiscount";
import Facebook from "@/components/Facebook";
import Featured from "@/components/Featured/Featured";

import ChatWidget from "../components/ChatWidget";

export default function Home() {
  const newArrivalRef = useRef<HTMLDivElement | null>(null);

  return (
    <div>
      <div className=" bg-gray-50">
        <CarouselHome newArrivalRef={newArrivalRef} />
        <ProductsDiscount />
        <Category />
        <BestSelling />
        <Featured newArrivalRef={newArrivalRef} />
      </div>
      <Facebook />
      <ChatWidget />
    </div>
  );
}
