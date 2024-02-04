import React from "react";

const SingleCategory: React.FC<any> = ({ bg, h, img, name, numProduct }) => {
  return (
    <div className="">
      <div
        className=" overflow-hidden w-full rounded-md"
        style={{ backgroundColor: bg }}
      >
        <div className=" overflow-hidden relative z-0" style={{ height: h }}>
          <div
            className="absolute top-0 left-0 z-40 w-[96.5%] bg-transparent cursor-pointer hoverCategory"
            style={{ height: h }}
          ></div>
          <div className="absolute z-20 pt-6 pl-8 nameCategory">
            <h3 className=" text-[18px] font-medium capitalize">
              {name
                .replace(/-/g, " ")
                .replace(/(^\w{1})|(\s+\w{1})/g, (letter: any) =>
                  letter.toUpperCase(),
                )}
            </h3>
            <h4 className="mt-1 text-[14px] font-normal">
              {numProduct} products
            </h4>
          </div>
          <div className="overflow-hidden absolute top-0 left-0 z-10 w-full zoomCategory">
            <img className=" object-fill w-full" src={img} alt="Mobiles" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCategory;
