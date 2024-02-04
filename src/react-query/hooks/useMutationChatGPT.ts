import axios from "axios";
import { useMutation } from "react-query";

const sendText = async (body: any) => {
  const { data } = await axios.post(`/api/chatgpt`, body);
  return data;
};

export const useMutationChatGPT = () => {
  return useMutation(sendText);
};
