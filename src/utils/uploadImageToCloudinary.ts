import { message } from "antd";
import axios from "axios";

export async function uploadImageToCloudinary(
  arrayImage: any[],
  data?: string,
) {
  let newData = data;
  if (data) {
    await Promise.all(
      arrayImage.map(async (acceptedFile) => {
        try {
          const formData = new FormData();
          const file = acceptedFile?.url || acceptedFile;
          formData.append("file", file);
          formData.append(
            "upload_preset",
            process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
          );
          const result = await axios.post<{ url: string }>(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
            formData,
          );
          newData = newData.replace(file, result?.data?.url);

          return result?.data.url;
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error);
          message.error(JSON.stringify(error));
        }
      }),
    );
    return newData;
  }

  return Promise.all(
    arrayImage.map(async (acceptedFile: any) => {
      try {
        if (!acceptedFile.new) return acceptedFile.url;
        const file = acceptedFile?.url || acceptedFile;

        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        );
        const result = await axios.post<{ url: string }>(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
          formData,
        );
        return result?.data?.url;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        message.error(JSON.stringify(error));
      }
    }),
  );
}
