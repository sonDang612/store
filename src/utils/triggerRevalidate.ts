import { message } from "antd";
import axios from "axios";

export const triggerRevalidate = async (id: any) => {
  try {
    await axios.get(
      `/api/revalidate?secret=${process.env.NEXT_PUBLIC_MY_SECRET_TOKEN}&id=${id}`,
    );
    message.success(`revalidate product ${id} successfully`);
  } catch (error) {
    message.error(error.message);
  }
};
