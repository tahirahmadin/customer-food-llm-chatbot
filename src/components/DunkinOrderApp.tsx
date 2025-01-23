// src/components/DunkinOrderApp.tsx
import React, { useState, useMemo } from "react";
import { useChatContext } from "../context/ChatContext";
import { ChatService } from "../services/chatService";
import { Header } from "./Header";
import { Filters } from "./Filters";
import { ChatPanel } from "./ChatPanel";
import { SlidePanel } from "./SlidePanel";
import { QueryType } from "../context/ChatContext";
import { config } from "../config";

const chatService = new ChatService();

export const DunkinOrderApp: React.FC = () => {
  const { state, dispatch } = useChatContext();
  const [input, setInput] = useState("");
  const [isVegOnly, setIsVegOnly] = useState(true);
  const [peopleCount, setPeopleCount] = useState(1);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  // Serialize previous messages for memory context
  const serializedMemory = useMemo(() => {
    return state.messages
      .map((message) =>
        message.isBot ? `Bot: ${message.text}` : `User: ${message.text}`
      )
      .join("\n");
  }, [state.messages]);

  const handleSubmit = async (e: React.FormEvent, serializedMemory: string) => {
    e.preventDefault();
    if (!input.trim()) return;

    let vegChoiceText = isVegOnly
      ? "Vegetarian options only"
      : "All types - Veg, non-veg";
    let inputQueryTrim =
      input +
      `And type preference:${vegChoiceText} ` +
      `Order should serve total no of people: ${peopleCount}`;

    // Determine query type
    const queryType = chatService.determineQueryType(input.trim());

    // Create user message with query type
    const userMessage = {
      id: Date.now(),
      text: input.trim(),
      isBot: false,
      time: new Date().toLocaleTimeString(),
      queryType, // Include query type in message
    };

    // Update state
    dispatch({ type: "ADD_MESSAGE", payload: userMessage });
    dispatch({ type: "SET_QUERY_TYPE", payload: queryType });
    setInput("");
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await chatService.queryMenu(
        queryType === "MENU_QUERY" ? inputQueryTrim : input,
        serializedMemory
      );

      // Create bot message
      const botMessage = {
        id: Date.now() + 1,
        text: response.response,
        isBot: true,
        time: new Date().toLocaleTimeString(),
        queryType, // Keep the same query type for the response
      };

      // Add bot message to chat
      dispatch({ type: "ADD_MESSAGE", payload: botMessage });

      // Handle menu items if present in response
      if (response.menuItems) {
        // You could add additional handling here for menu items
        // For example, showing them in a different UI component
        console.log("Menu items:", response.menuItems);
      }
    } catch (error) {
      console.error("Error querying menu:", error);

      // Add error message
      dispatch({
        type: "ADD_MESSAGE",
        payload: {
          id: Date.now() + 1,
          text: "Sorry, I had trouble understanding your question. Please try again.",
          isBot: true,
          time: new Date().toLocaleTimeString(),
          queryType: QueryType.GENERAL,
        },
      });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  // Helper function to get appropriate placeholder text based on current query type
  const getInputPlaceholder = () => {
    switch (state.currentQueryType) {
      case QueryType.MENU_QUERY:
        return "Ask about menu items, prices, or place an order...";
      default:
        return "Type your message here...";
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-[#E0E0E0]">
      <div className="relative bg-white/70 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-white/20">
        <Header
          onOpenPanel={() => setIsPanelOpen(true)}
          queryType={state.currentQueryType}
        />

        <Filters
          isVegOnly={isVegOnly}
          setIsVegOnly={setIsVegOnly}
          peopleCount={peopleCount}
          setPeopleCount={setPeopleCount}
        />

        <ChatPanel
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          placeholder={getInputPlaceholder()}
          onImageUpload={() => {}}
          isLoading={state.isLoading}
          queryType={state.currentQueryType}
        />
      </div>

      <SlidePanel
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        savedAddresses={[]}
        onDeleteAddress={() => {}}
      />
    </div>
  );
};
