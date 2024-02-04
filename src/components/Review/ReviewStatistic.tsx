import { StarFilled, StarOutlined } from "@ant-design/icons";
import { Col, Progress, Rate, Row } from "antd";
import React from "react";

import notEmpty from "@/utils/not-empty";

const ReviewStatistic: React.FC<any> = ({
  product,
  reviews,
  statisticReview,
  star,
  setStar,
}) => {
  return (
    <Row>
      <Col flex="0 0 335px" className="">
        <div className=" p-2 px-10">
          <Row gutter={[40, 0]} align="middle" className="mb-2">
            <Col flex="0 0 45px">
              <div className="text-3xl font-bold">{product.averageRating}</div>
            </Col>
            <Col flex="1">
              <div>
                <Rate
                  allowHalf
                  value={product.averageRating}
                  disabled
                  style={{ fontSize: 20 }}
                  //  style={{ fontSize: 14, color: "red" }}
                />
              </div>
              <div className="text-sm font-normal text-gray-400">
                {reviews?.reviews?.length || 0} comments
              </div>
            </Col>
          </Row>
          {notEmpty(statisticReview) &&
            notEmpty(reviews) &&
            statisticReview.statisticReview.map((rvStatistic: any, i: any) => {
              const percent =
                (rvStatistic.total * 100) / statisticReview.totalReview;
              return (
                <Row key={i} gutter={[10, 0]} align="middle">
                  <Col flex="0 0 110px">
                    <Rate
                      value={5 - i}
                      disabled
                      style={{ fontSize: 12 }}
                      //  style={{ fontSize: 14, color: "red" }}
                    />
                  </Col>
                  <Col flex="1">
                    <Progress
                      percent={percent}
                      // showInfo={false}

                      strokeColor={"#808089"}
                      // strokeColor={{
                      //    "0%": "#808089",
                      //    "100%": "#808089",
                      // }}
                      format={() => (
                        <span className="text-xs text-gray-400">
                          {Math.floor(rvStatistic.total)}
                        </span>
                      )}
                    />{" "}
                  </Col>
                </Row>
              );
            })}
        </div>
      </Col>
      <Col flex="1 0 0" className=" self-end p-2 px-14 h-full">
        <div className="flex items-center space-x-4 h-full">
          <h3>Filter review: </h3>
          {Array(7)
            .fill(1)
            .map((_, i) => {
              const content = () => {
                if (i === 0) return "All";
                if (i === 1) return "Newest";
                return (
                  <>
                    <div className="inline-block">{7 - i}</div>
                    {7 - i === star ? (
                      <StarFilled
                        style={{
                          color: "#ffa142",
                        }}
                      />
                    ) : (
                      <StarOutlined />
                    )}
                  </>
                );
              };
              return (
                <div
                  key={i}
                  className={
                    7 - i === star
                      ? "py-[5px] px-4 space-x-1 bg-blue-100 rounded-[100px] border-[1px] border-solid cursor-pointer border-blue-400"
                      : "py-[5px] px-4 space-x-1 bg-gray-100 rounded-[100px] cursor-pointer border-[1px] border-solid border-transparent"
                  }
                  onClick={() => setStar(7 - i)}
                >
                  {content()}
                </div>
              );
            })}
        </div>
      </Col>
    </Row>
  );
};

export default ReviewStatistic;
