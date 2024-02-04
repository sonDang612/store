import axios from "axios";
import { useRouter } from "next/router";
import { useMutation } from "react-query";

const getUrlZaloPay = async (orderPayload: any) => {
  const { data } = await axios.post("/api/zalopay", orderPayload);
  return data.order_url;
};

export const useZaloPay = () => {
  const router = useRouter();
  return useMutation(getUrlZaloPay, {
    onSuccess: (urlQrCode) => {
      router.push(urlQrCode);
    },
  });
};
