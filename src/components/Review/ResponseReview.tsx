import { CheckCircleFilled } from "@ant-design/icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import React from "react";

import { getShortName } from "@/utils/getShortName";

dayjs.extend(relativeTime);
const ResponseReview: React.FC<any> = ({ review }) => {
  const name =
    review?.user?.active || review?.active
      ? review.user?.name || review.name
      : "User was deleted";
  // const name = notEmpty(review?.user?.name || review?.name)
  //    ? review.user?.name || review.name
  //    : "User was deleted";
  return (
    <div className="flex ml-3 space-x-2">
      {review?.isAdmin ? (
        <div className="flex justify-center items-center w-8 h-8 bg-gradient-to-r from-purple-200 via-pink-300 to-red-300 rounded-[50%]">
          <span className=" text-xs font-medium" style={{ color: "#999999" }}>
            {name !== "User was deleted" && getShortName(name)}
          </span>
        </div>
      ) : (
        <div className="flex justify-center items-center w-8 h-8 bg-[#f2f2f2] rounded-[50%]">
          <span className=" text-xs font-medium" style={{ color: "#999999" }}>
            {name !== "User was deleted" && getShortName(name)}
          </span>
        </div>
      )}
      <div className="py-2 px-3 w-full bg-[#FAFAFA] rounded-2xl border-[1px] border-gray-200 border-solid">
        <div className=" flex items-center space-x-2 text-xs">
          <span
            className={
              name === "User was deleted"
                ? " font-medium capitalize text-red-500"
                : "font-medium capitalize"
            }
          >
            {review?.isAdmin ? (
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                {name}
              </span>
            ) : (
              name
            )}

            {/* {notEmpty(review?.user?.name || review?.name) ? (
                     `${review.user?.name || review.name}`
                  ) : (
                     <span className="text-base font-medium text-red-500">
                        User was deleted
                     </span>
                  )} */}

            {review?.isAdmin && (
              <span style={{ color: "#0B74E5" }} className="ml-1">
                {" "}
                <CheckCircleFilled />
              </span>
            )}
          </span>
          <span className=" -mt-2" style={{ lineHeight: 0 }}>
            .
          </span>
          {review?.isAdmin ? (
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
              {dayjs(review.createdAt).fromNow()}
            </span>
          ) : (
            <span style={{ color: "#999999" }}>
              {dayjs(review.createdAt).fromNow()}
            </span>
          )}
        </div>
        <p className="mt-1 text-[13px]">{review.comment}</p>
      </div>
    </div>
  );
};

export default ResponseReview;
