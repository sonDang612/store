import { CheckCircleFilled, LikeFilled, LikeOutlined } from "@ant-design/icons";
import { Button, Col, Input, Rate, Row } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useQueryClient } from "react-query";

import { REVIEW_STATUS } from "@/src/constant";
import { queryKeys } from "@/src/react-query/constants";
import { useMutationLikeReview } from "@/src/react-query/hooks/review/useMutationLikeReview";
import { useMutationReplyReview } from "@/src/react-query/hooks/review/useMutationReplyReview";
import { useUserData } from "@/src/react-query/hooks/user/useUserData";
import { useActions } from "@/src/redux/useActions";
import { User } from "@/src/types/user";
import { getShortName } from "@/utils/getShortName";
import isEmpty from "@/utils/is-empty";
import notEmpty from "@/utils/not-empty";

import ResponseReview from "./ResponseReview";

dayjs.extend(relativeTime);
const Comment: React.FC<any> = ({ review, productId, page, limit, rating }) => {
  const queryClient = useQueryClient();
  const actions = useActions();
  const { data: user } = useUserData(false, false);
  const [hasReview, setHasReview] = useState(false);
  const [textReply, setTextReply] = useState("");
  const [moreReply, setMoreReply] = useState([0, 1]);
  const [me, setMe] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { mutate: likeReview, isLoading: isLoadingLike } =
    useMutationLikeReview(productId, page, limit, rating);
  const { mutate: replyReview, isLoading: isLoadingReply } =
    useMutationReplyReview(productId, review._id, page, limit, rating);
  const handleLikeReview = () => {
    if (isEmpty(user)) {
      actions.showModalLogin();
      return;
    }
    likeReview(review._id);
  };
  const handleComment = () => {
    if (isEmpty(user)) {
      actions.showModalLogin();
      return;
    }
    setIsModalVisible((old) => !old);
  };
  const handleSendReview = () => {
    if (!textReply) return;
    replyReview({ id: review._id, comment: textReply });
    setTextReply("");
    if (moreReply.length === 2) return setMoreReply([0]);
  };

  useEffect(() => {
    if (isEmpty(user)) return;

    setHasReview(review.userLiked.includes(user._id.toString()));
  }, [queryClient, review.userLiked]);
  useEffect(() => {
    const user = queryClient.getQueryData<User>(queryKeys.getUserData);

    if (isEmpty(user)) return;
    setMe((review.user?._id || review.user).toString() === user._id.toString());
  }, [queryClient, review.user]);
  return (
    <div className="px-5">
      <Row>
        <Col flex="0 0 335px" className="space-y-3">
          <Row justify="center" align="middle" className="ml-3 space-x-2">
            <Col flex="0 0 50px">
              <div className="flex justify-center items-center w-12 h-12 bg-[#f2f2f2] rounded-[50%]">
                <span className="font-medium text-[#999999]">
                  {review?.user?.active ? getShortName(review.user.name) : " "}

                  {/* {getShortName(review.user.name)} */}
                </span>
              </div>
            </Col>
            <Col flex="1">
              <div className="font-medium">
                {review?.user?.active ? (
                  `${review.user.name} `
                ) : (
                  <span className="text-base font-medium text-red-500">
                    User was deleted
                  </span>
                )}

                {/* {review.user.name}{" "} */}
                {me ? (
                  <span className="text-gray-700">
                    {
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
                        (You)
                      </span>
                    }
                  </span>
                ) : (
                  ""
                )}
              </div>
              <div className="text-[#999999]">
                Joined{" "}
                {notEmpty(review?.user) &&
                  dayjs(review.user.createdAt).fromNow()}
              </div>
            </Col>
          </Row>
          <div className="flex items-center ml-4 space-x-2 text-gray-400">
            <div className="mr-3">
              <LikeOutlined style={{ fontSize: 15 }} />
            </div>{" "}
            Liked : <span className="text-gray-600">{review.numLike}</span>
          </div>
        </Col>
        <Col flex="1" className=" p-2 px-10 space-y-2">
          <div>
            <Rate
              // tooltips={desc}
              allowHalf
              value={review.rating}
              disabled
              style={{ fontSize: 18 }}
              //  style={{ fontSize: 14, color: "red" }}
            />
            {review.rating ? (
              <span className="ml-4 capitalize ant-rate-text">
                {REVIEW_STATUS[Math.ceil(review.rating) - 1]}
              </span>
            ) : (
              ""
            )}
          </div>
          {review?.possessed && (
            <div className=" space-x-1 text-xs" style={{ color: "#009900" }}>
              <span>
                {" "}
                <CheckCircleFilled />
              </span>{" "}
              <span> Purchased the product</span>
            </div>
          )}
          {review?.hide ? (
            <p className=" py-3 text-sm text-red-500">
              ****************** This comment uses inappropriate words and has
              been hidden ******************
            </p>
          ) : (
            <p className=" text-sm text-gray-700">{review.comment}</p>
          )}
          <h3 className=" text-[13px] text-gray-400">
            Reviewed {dayjs(review.createdAt).fromNow()}
          </h3>
          <div className="space-x-4">
            <Button
              type="default"
              size="middle"
              className={
                hasReview
                  ? " mt-1 rounded-md useFullClick"
                  : " mt-1 rounded-md useFull"
              }
              onClick={handleLikeReview}
              // loading={isLoadingLike}
              disabled={isLoadingLike}
            >
              {hasReview ? <LikeFilled /> : <LikeOutlined />}
              {/* <LikeFilled /> */}
              Like
            </Button>
            <Button
              type="link"
              size="middle"
              className=" mt-1 rounded-md"
              onClick={handleComment}
            >
              {/* {review.responseReview.length > 0 &&
                        review.responseReview.length}{" "} */}
              Comment
            </Button>
          </div>
          {isModalVisible && (
            <div className="flex items-center space-x-3">
              <div className="mt-1">
                <Image
                  src="/images/cmt-avatar.png"
                  alt="/images/cmt-avatar.png"
                  width={35}
                  height={35}
                  className="bg-gray-200 rounded-[50%]"
                />
              </div>
              <div className="flex items-center w-full">
                <Input
                  placeholder="Write answer"
                  className=" w-[90%] text-gray-600 rounded-3xl"
                  value={textReply}
                  onPressEnter={handleSendReview}
                  onChange={(e) => setTextReply(e.target.value)}
                />
                <Button
                  type={textReply ? "primary" : "ghost"}
                  className=" -ml-16 border-0"
                  shape="round"
                  onClick={handleSendReview}
                  loading={isLoadingReply}
                >
                  Send
                </Button>
              </div>
            </div>
          )}
          {review.responseReview.slice(...moreReply).map((rpReview: any) => {
            return (
              <div key={rpReview._id} className="">
                {" "}
                <ResponseReview review={rpReview} />
              </div>
            );
          })}
          {/* {review.responseReview.length > 0 && moreReply.length === 2 && ( */}
          {review.responseReview.length > 0 && (
            <div
              className=" flex items-center space-x-3 cursor-pointer"
              onClick={() => {
                setMoreReply((old) => {
                  if (old.length === 1) return [0, 1];
                  return [0];
                });
              }}
            >
              {review.responseReview.length > 1 && (
                <>
                  <Image
                    src="/images/more.png"
                    alt="/images/more.png"
                    width={20}
                    height={20}
                  ></Image>
                  <span
                    style={{ color: "#0b74e5" }}
                    className="mt-1 text-[13px]"
                  >
                    See{" "}
                    {moreReply.length === 2 && review.responseReview.length - 1}{" "}
                    {moreReply.length === 2 ? "more" : "less"} answers
                  </span>
                </>
              )}
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Comment;
