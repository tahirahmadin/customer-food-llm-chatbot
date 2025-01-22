// src/context/ChatContext.tsx
import React, { createContext, useContext, useReducer } from "react";

export enum QueryType {
  MENU_QUERY = "MENU_QUERY",
  GENERAL = "GENERAL"
}

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  time: string;
  queryType: QueryType;
}

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  currentQueryType: QueryType;
}

type ChatAction =
  | { type: "ADD_MESSAGE"; payload: Message }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_QUERY_TYPE"; payload: QueryType }
  | { type: "CLEAR_MESSAGES" };

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case "ADD_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
      };
    case "SET_QUERY_TYPE":
      return {
        ...state,
        currentQueryType: action.payload,
      };
    case "CLEAR_MESSAGES":
      return {
        ...state,
        messages: [],
      };
    default:
      return state;
  }
};

const initialState: ChatState = {
  messages: [
    {
      id: 1,
      text: "Hi! I'm your menu assistant. What would you like to know about our offerings?",
      isBot: true,
      time: new Date().toLocaleTimeString(),
      queryType: QueryType.GENERAL
    },
  ],
  isLoading: false,
  error: null,
  currentQueryType: QueryType.GENERAL
};

const ChatContext = createContext<{
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
} | null>(null);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};