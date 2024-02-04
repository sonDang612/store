import "suneditor/dist/css/suneditor.min.css";

import ReactHtmlParser from "html-react-parser";
import React from "react";

const ProductSpecification: React.FC<{ tableInformation: string }> = ({
  tableInformation,
}) => {
  return (
    <div className=" overflow-hidden p-4 mt-10 max-w-[920px] bg-white rounded-sm AlignImage">
      <h3 className="mb-4 ml-5 text-2xl font-medium">Product Specification</h3>
      <div className=" overflow-hidden relative text-base text-gray-600 mainDescription sun-editor-editable">
        {ReactHtmlParser(tableInformation)}
      </div>
    </div>
  );
};

export default ProductSpecification;
