import { Col, Row } from "antd";
import React from "react";
import CountUp from "react-countup";

const CardNumber: React.FC<any> = ({ data }) => {
  return (
    <div className="py-12 pl-8 bg-white duration-150 cursor-pointer CardNumber">
      <Row>
        <Col span={8}>
          {data.icon}
          {/* <ShoppingCartOutlined
                  style={{ fontSize: 54, color: "#F8B2B3" }}
               /> */}
        </Col>
        <Col span={14}>
          <div className=" -mt-4 space-y-1">
            <h2 className=" text-base text-gray-600">{data.name}</h2>
            <div>
              <CountUp
                start={0}
                end={data.total}
                duration={2.75}
                useEasing
                useGrouping
                separator=","
                className="text-xl text-gray-600"
              />
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default CardNumber;
