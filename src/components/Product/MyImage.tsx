import { Image } from "antd";
import React, { useState } from "react";

import isEmpty from "@/utils/is-empty";

import ReactImageZoom from "../ProductCard/ReactImageZoom";

const MyImage: React.FC<any> = ({ product }) => {
  const [visible, setVisible] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <div>
      <div>
        <div className="relative h-[460px]">
          {!isEmpty(product) &&
            product.image.map((img: any, i: any) => {
              return (
                <div
                  key={i}
                  className="absolute h-[460px] cursor-pointer"
                  onClick={() => setVisible(true)}
                >
                  <ReactImageZoom
                    src={img}
                    alt={img}
                    // key={i}
                    style={{
                      zIndex: i === index ? 10 : 0,
                      visibility: i === index ? "visible" : "hidden",
                    }}
                  />
                </div>
              );
            })}
        </div>

        <div style={{ display: "none" }}>
          <Image.PreviewGroup
            preview={{
              visible,
              onVisibleChange: (vis) => setVisible(vis),
              current: index,
            }}
          >
            {product.image.map((img: any, i: any) => {
              return (
                <Image
                  src={img}
                  alt={img}
                  key={i}
                  // width={i === index ? undefined : 0}
                  // className="hidden cursor-pointer"
                />
              );
            })}
          </Image.PreviewGroup>
        </div>
      </div>
      <div className="ml-3">
        {product.image.map((src: any, i: any) => {
          return (
            <div
              key={i}
              className="inline-block mr-2"
              onClick={() => setIndex(i)}
            >
              <Image
                src={src}
                alt={src}
                width={70}
                preview={false}
                className={
                  i === index
                    ? "border-[1px] border-[#1a94ff] border-solid transition-all duration-200 cursor-pointer"
                    : "border-[1px] border-transparent hover:border-[#1a94ff] border-solid transition-all duration-200 cursor-pointer"
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyImage;
