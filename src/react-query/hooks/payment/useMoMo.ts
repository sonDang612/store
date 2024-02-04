import axios from "axios";
import { useRouter } from "next/router";
import { useMutation } from "react-query";

const getUrlMoMo = async (orderPayload: any) => {
  const { data: qrCodeUrl } = await axios.post("/api/momo", orderPayload);
  return qrCodeUrl;
};

export const useMoMo = () => {
  const router = useRouter();
  return useMutation(getUrlMoMo, {
    onSuccess: (urlQrCode) => {
      router.push(urlQrCode);
    },
  });
};
