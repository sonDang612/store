import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Carousel, Col, Row } from "antd";
import React, { useRef, useState } from "react";

import { QUOTES } from "@/src/constant";

import Quotes from "./Quotes";

const SlickArrowLeft: React.FC<any> = ({
  currentSlide,
  slideCount,
  ...props
}) => {
  return <LeftOutlined {...props} />;
};

const SlickArrowRight: React.FC<any> = ({
  currentSlide,
  slideCount,
  ...props
}) => {
  return <RightOutlined {...props} />;
};
const ClientSay = () => {
  const [selected, setSelected] = useState(0);
  const sliderRef = useRef<any>();
  const settings = {
    beforeChange(current: any, next: any) {
      setSelected(next);
    },
    arrows: true,
    infinite: true,
    className: " cursor-pointer",
    dots: false,
    slidesToShow: 3,
    swipeToSlide: true,
    draggable: true,
    pauseOnHover: false,
  };

  return (
    <div className=" p-16 mt-10 bg-white">
      <div className=" mx-auto max-w-[1270px]">
        <h3 className="py-3 ml-10 text-3xl font-bold">What Client Says</h3>
        <div className="relative mt-3 disableSvg">
          <Carousel
            autoplay
            {...settings}
            prevArrow={<SlickArrowLeft />}
            nextArrow={<SlickArrowRight />}
            ref={sliderRef}
          >
            {QUOTES.map((quote, i) => {
              return (
                <div key={i}>
                  <div className="p-10">
                    <Quotes quote={quote} />
                  </div>
                </div>
              );
            })}
          </Carousel>
          <Row className="pr-8 pl-[180px] mt-4">
            {Array(4)
              .fill(1)
              .map((_, i) => {
                return (
                  <Col
                    key={i}
                    span={6}
                    className=" cursor-pointer effectSelected"
                    onClick={() => sliderRef.current.goTo(i)}
                  >
                    <button
                      // onClick={() => sliderRef.current.goTo(0)}
                      className={
                        selected === i
                          ? `w-full h-[2px] bg-[#f02757] `
                          : `w-full h-[2px] bg-[#e5e5e5] `
                      }
                    ></button>
                  </Col>
                );
              })}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ClientSay;
