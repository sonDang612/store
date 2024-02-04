import { Rate } from "antd";
import React from "react";

const RatingFilter: React.FC<any> = ({ handleFilter }) => {
  return (
    <div className=" space-y-2">
      {Array(5)
        .fill(1)
        .map((_, i) => {
          return (
            <div
              key={i}
              className=" flex items-center space-x-4 cursor-pointer"
              onClick={() =>
                // filterRatingHandler(5 - i)
                handleFilter("rating", 5 - i)
              }
            >
              <div className="">
                <Rate
                  value={5 - i}
                  style={{
                    fontSize: 15,
                    // cursor: "pointer",
                  }}
                  className="pointerStar"
                  disabled
                />
              </div>
              <h2 className=" text-xs text-gray-600">from {5 - i} star</h2>
            </div>
          );
        })}
    </div>
  );
};

export default RatingFilter;
