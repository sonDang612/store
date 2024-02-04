import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// {
//   "role": "assistant",
//   "id": "cmpl-6j7am7ek7JadaPXFpPMmqW88kSm3I",
//   "parentMessageId": "b203a57e-8f4e-457a-ad38-24ae057e2ea8",
//   "conversationId": "7f2593d6-8584-4168-9849-78111b9818b4",
//   "text": "Cảm ơn bạn đã hỏi. Beats Solo3 Wireless Headphones được đánh giá cao về âm thanh tốt và thời lượng pin dài."
//   }
export type ChatGPTResponse = {
  data: {
    role?: string;
    id?: string;
    parentMessageId?: string;
    conversationId?: string;
    text: string;
  }[];
};
const initialState: ChatGPTResponse = { data: [] } as ChatGPTResponse;
const chatGPTReducer = createSlice({
  name: "chatGPTReducer",
  initialState,
  reducers: {
    setChatGPTState: (
      state,
      actions: PayloadAction<ChatGPTResponse["data"][number]>,
    ) => {
      state.data.push(actions.payload);
    },
    clearChatGPTState: (_state) => {
      return initialState;
    },
  },
});

const chatGPTActions = chatGPTReducer.actions;
export { chatGPTActions };
export default chatGPTReducer.reducer;
