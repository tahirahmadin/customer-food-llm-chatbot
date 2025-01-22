// src/components/ChatPanel.tsx
import React, { useRef, useEffect, useMemo } from "react";
import { Message } from "./Message";
import { ChatInput } from "./ChatInput";
import { useChatContext } from "../context/ChatContext";

interface ChatPanelProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  input,
  setInput,
  onSubmit,
}) => {
  const { state } = useChatContext();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [state.messages]);

  const cleanMessages = useMemo(() => {
    if (state.messages?.length > 0) {
      let result = state.messages.map((message) => {
        if (
          message.queryType === "MENU_QUERY" &&
          message.isBot &&
          message.text
        ) {
          // Parse the text field into JSON
          const parsedText = JSON.parse(message.text);

          console.log("parsedText");
          console.log(parsedText);
          // Restructure the message object
          return {
            id: message.id,
            isBot: message.isBot,
            time: message.time,
            text: message.text,
            queryType: message.queryType,
            structuredText: {
              start: parsedText.start,
              menu: parsedText.menu,
              end: parsedText.end,
            },
          };
        } else {
          return message;
        }
      });
      return result;
    } else {
      return [];
    }
  }, [state.messages]);

  return (
    <>
      <div
        ref={chatContainerRef}
        className="h-[500px] overflow-y-auto p-4 bg-white/30 backdrop-blur-sm scroll-smooth"
      >
        {cleanMessages.map((message) => (
          <Message key={message.id} message={message} onRetry={() => {}} />
        ))}

        {console.log("cleanMessages")}
        {console.log(cleanMessages)}
        {state.isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
          </div>
        )}
      </div>

      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={onSubmit}
        isLoading={state.isLoading}
      />
    </>
  );
};
