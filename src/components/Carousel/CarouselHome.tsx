import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Carousel, Col, Image, Row } from "antd";
import Link from "next/link";
import React from "react";

const SlickArrowLeft: React.FC<any> = ({
  currentSlide,
  slideCount,
  ...props
}) => <LeftOutlined {...props} />;
// eslint-disable-next-line no-unused-vars
const SlickArrowRight: React.FC<any> = ({
  currentSlide,
  slideCount,
  ...props
}) => <RightOutlined {...props} />;
const CarouselHome: React.FC<any> = ({ newArrivalRef }) => {
  return (
    <div className=" mt-1 bg-gray-200">
      <Row gutter={27}>
        <Col
          span={16}
          className="overflow-hidden h-[305px] rounded-lg styleCarousel"
        >
          <Carousel
            autoplay
            pauseOnHover={false}
            arrows
            prevArrow={<SlickArrowLeft />}
            nextArrow={<SlickArrowRight />}
            infinite
            className="cursor-pointer hoverArrow"
          >
            <div>
              <Image
                src="./images/carousel/img1.PNG"
                alt="carousel/1"
                height={305}
              ></Image>
            </div>
            <div>
              <Image
                src="./images/carousel/img2.PNG"
                alt="carousel/2"
                height={305}
              ></Image>
            </div>
            <div>
              <Image
                src="./images/carousel/img3.PNG"
                alt="carousel/3"
                height={305}
              ></Image>
            </div>
            <div>
              <Image
                src="./images/carousel/img4.PNG"
                alt="carousel/3"
                height={305}
              ></Image>
            </div>
          </Carousel>
        </Col>
        <Col
          span={8}
          className=" overflow-hidden !pr-0 !pl-5 max-w-[419px] rounded-lg cursor-pointer"
        >
          <div className="relative h-full bg-[#B9DCF0] textRight">
            <div className=" absolute z-10 w-full h-full rightCarousel"></div>
            <div className=" absolute top-[23%] left-[60%] z-20 h-[90%]">
              <div className="flex flex-col justify-between h-[60%]">
                <div className="">
                  <div
                    onClick={() =>
                      newArrivalRef.current.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      })
                    }
                  >
                    <span className="py-1 px-2 text-xs font-medium text-gray-900 uppercase bg-white rounded-[0.14rem] transition-all duration-200 cursor-pointer newArrival">
                      new arrival
                    </span>
                  </div>
                </div>
                <div className="text-lg font-medium uppercase">
                  redmi
                  <br />
                  note 10s{" "}
                </div>
                <div
                  className="flex justify-center items-center p-1 hover:text-white hover:bg-[#1a94ff] rounded-t-sm border-b-[2px]
                        border-black transition-colors duration-300 cursor-pointer shopButton"
                >
                  <Link href="/products/search" passHref>
                    <span className="font-bold"> Shop Now &rarr; </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          {/* <div>
                  <h3
                     style={contentStyle}
                     className=" flex justify-center items-center h-[250px]"
                  >
                     0
                  </h3>
               </div> */}
        </Col>
      </Row>
    </div>
  );
};

export default CarouselHome;
