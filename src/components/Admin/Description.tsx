import "suneditor/dist/css/suneditor.min.css";

import { useSize } from "ahooks";
import ReactHtmlParser from "html-react-parser";
import React, { useEffect, useRef, useState } from "react";
// import ReactHtmlParser from "react-html-parser";

const Description: React.FC<{ description: string }> = ({ description }) => {
  const [show, setShow] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const ref = useRef(null);
  const size = useSize(ref);

  useEffect(() => {
    if (size?.height && size?.height < 200) {
      setShowButton(false);
    } else setShowButton(true);
  }, [size?.height]);

  return (
    <div className=" overflow-hidden p-4 mt-10 max-w-[920px] bg-white rounded-sm AlignImage">
      <h3 className="mb-4 ml-5 text-2xl font-medium">Product Description</h3>
      <div
        className=" overflow-hidden relative text-base text-gray-600 mainDescription sun-editor-editable"
        // className=" overflow-hidden relative text-base text-gray-600 mainDescription unreset "
        style={{ maxHeight: show ? undefined : 200 }}
        ref={ref}
      >
        {ReactHtmlParser(description)}
        {showButton &&
          (show ? (
            <div className=" btn-more" onClick={() => setShow(false)}>
              See less content
            </div>
          ) : (
            <div className="justify-center items-end Gradient !flex">
              <div className=" btn-more" onClick={() => setShow(true)}>
                See more content
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Description;
