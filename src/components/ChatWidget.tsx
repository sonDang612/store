import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import type { Widget as WidgetType } from "react-chat-widget";
import { useSelector } from "react-redux";

import { useMutationChatGPT } from "../react-query/hooks/useMutationChatGPT";
import { ChatGPTResponse } from "../redux/reducers/chatGPTReducer";
import { RootState } from "../redux/store";
import { useActions } from "../redux/useActions";

let addResponseMessage: any;
let dropMessages: any;
let addUserMessage: any;
let markAllAsRead: any;
let toggleMsgLoader: any;
const Widget = dynamic<React.ReactNode>(
  () => import("react-chat-widget").then((mod: any) => mod.Widget as any),
  {
    loading: () => <>Loading&nbsp;&hellip;</>,
    ssr: false,
  },
) as typeof WidgetType;

const ChatWidget = () => {
  const actions = useActions();
  const arrayMessage = useSelector<RootState, ChatGPTResponse["data"]>(
    (state) => state.chatGPT.data,
  );

  const { mutateAsync } = useMutationChatGPT();

  const handleNewUserMessage = async (newMessage: string) => {
    const {
      conversationId,
      id,
      //  parentMessageId, role, text
    } =
      [...arrayMessage]
        .reverse()
        .find((mess) => !!(mess?.id && mess?.conversationId)) || {};

    actions.setChatGPTState({ text: newMessage });
    try {
      toggleMsgLoader();
      const result = await mutateAsync({
        conversationId,
        parentMessageId: id,
        text: newMessage,
      });
      toggleMsgLoader();
      actions.setChatGPTState(result);
      addResponseMessage(result.text);
    } catch (error) {
      console.error(error);
    }
  };
  const clearChat = () => {
    dropMessages();
    actions.clearChatGPTState();
  };
  const addResponseMessageAndState = (message: string) => {
    addResponseMessage(message);
    actions.setChatGPTState({ text: message, id: Date.now().toString() });
  };
  useEffect(() => {
    import("react-chat-widget").then((mod) => {
      addResponseMessage = mod.addResponseMessage;
      dropMessages = mod.dropMessages;
      addUserMessage = mod.addUserMessage;
      markAllAsRead = mod.markAllAsRead;
      toggleMsgLoader = mod.toggleMsgLoader;
      // clearChat();
      if (arrayMessage.length) {
        arrayMessage.forEach((message) => {
          if (message.id) {
            addResponseMessage(message.text);
          } else addUserMessage(message.text, new Date("2021/04/22"));
        });
        markAllAsRead();
      } else {
        addResponseMessageAndState("Do you need any help!");
      }
    });
    return () => dropMessages();
  }, []);

  return (
    <Widget
      profileAvatar="/images/admin-avatar.png"
      handleNewUserMessage={handleNewUserMessage}
      subtitle={<button onClick={clearChat}>+ New chat</button>}
      title="Welcome!"
      showTimeStamp
    ></Widget>
  );
};

export default ChatWidget;
