/* eslint-disable @next/next/no-img-element */
import { Button } from "antd";
import React from "react";

const SingleAddress: React.FC<any> = ({
  address,
  i,
  handleDeleteAddress,
  handleOpenModalUpdate,
}) => {
  return (
    <div className="p-3 bg-white rounded-md" key={address._id}>
      <div className="flex justify-between items-center">
        <div className="flex justify-between items-center space-x-3">
          <h3 className="uppercase">{address.name}</h3>
          {i === 0 && (
            <div className=" flex items-center space-x-1">
              <img src="/images/yes.svg" alt="yes.svg" className=" w-3 h-3" />

              <h4 className=" text-xs" style={{ color: "#26bc4e" }}>
                Default address
              </h4>
            </div>
          )}
        </div>

        <Button
          type="text"
          className=" !text-[#0387fa] rounded-md"
          // className=" !text-[#0387fa] rounded-md"
          onClick={() => handleOpenModalUpdate(address, i)}
        >
          Modify
        </Button>
      </div>
      <div className=" space-y-1">
        <div className="flex justify-between items-center">
          <h3 className="text-[13px] tracking-[0.1px]">
            {" "}
            <span className="text-gray-400">Address:</span>
            {`${address.address} , ${address.ward} , ${address.district} , ${address.city}`}
          </h3>
          {i !== 0 && (
            <Button
              type="text"
              className=" rounded-md !b"
              // className=" !bg-red-500 rounded-md !border-red-500"
              danger
              onClick={() => handleDeleteAddress(address._id)}
            >
              Delete
            </Button>
          )}
        </div>
        <h3 className="text-[13px] tracking-[0.1px]">
          {" "}
          <span className="text-gray-400">Phone Number:</span> {address.phone}
        </h3>
      </div>
    </div>
  );
};

export default SingleAddress;
