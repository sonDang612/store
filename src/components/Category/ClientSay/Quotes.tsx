/* eslint-disable @next/next/no-img-element */
import { Rate } from "antd";
import React from "react";

const Quotes: React.FC<any> = ({ quote }) => {
  return (
    <div className="flex flex-col justify-between py-[35px] px-[50px] min-h-[350px] rounded-md border-[1px] border-gray-300 border-solid">
      <div className="relative">
        <div className="absolute -top-14 z-30">
          <img src="/images/quote.png" alt="quote" className="w-[45px]" />
        </div>
        <h3 className="text-xl font-bold">{quote.title}</h3>
      </div>
      <div>
        <Rate
          allowHalf
          value={5}
          disabled
          style={{ fontSize: 15 }}
          //  style={{ fontSize: 14, color: "red" }}
        />
      </div>
      <div
        className=" text-[15px] leading-[26px] text-justify"
        style={{ color: "#747474" }}
      >
        {quote.content}
      </div>
      <div className="flex items-center">
        <div className="w-[80px]">
          <img
            src={quote.avatar}
            //   src="/images/avartar1.jpg"
            alt="avartar1"
            className="w-[60px] rounded-[50%]"
          />
        </div>
        <div className="">
          <div className="text-[16px] font-bold leading-[24px] uppercase">
            {quote.name}
          </div>{" "}
          <div className="text-[13px] leading-[16px] text-gray-400">
            {quote.city}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quotes;
