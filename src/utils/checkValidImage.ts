import { message } from "antd";

export const checkValidImage = (file: any) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  // const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  // console.log(isJpgOrPng && isLt2M);
  return isJpgOrPng && isLt2M;
};
