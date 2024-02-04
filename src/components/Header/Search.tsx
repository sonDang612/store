import Image from "next/image";
import React from "react";

import { saveDataToLocalStorage } from "@/utils/saveDataToLocalStorage";

import ImageFallBackImgTag from "../ImageFallBackImgTag";

const Search: React.FC<any> = ({ product, handleFocus }) => {
  return (
    <div className=" flex items-center mt-[0.5px]">
      <div>
        <Image src="/images/search.png" width={35} height={35} alt="search: " />
      </div>
      <div className="ml-1">
        {product?.image && (
          <ImageFallBackImgTag
            src={product.image[0]}
            width={25}
            height={25}
            alt={product.image[0]}
          />
        )}
      </div>
      <div className=" ml-5 w-[350px] truncate">{product?.name || product}</div>
      <div className="ml-auto">
        {typeof product === "string" && (
          <Image
            src="/images/delete.png"
            width={24}
            height={24}
            alt="delete: "
            onClick={(e) => {
              e.stopPropagation();
              const listHistorySearch = localStorage
                .getObject("search-keyword")
                .filter((kw: any) => kw !== product);

              saveDataToLocalStorage("search-keyword", listHistorySearch);
              handleFocus();
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Search;
