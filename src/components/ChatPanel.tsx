import React from "react";
import { Message } from "./Message";
import { ChatInput } from "./ChatInput";

interface ChatPanelProps {
  messages: any[];
  messageCards: { [key: number]: any[] };
  quantities: { [key: number]: number };
  peopleCount: number;
  orderDetails: any;
  input: string;
  setInput: (value: string) => void;
  setOrderDetails: (details: any) => void;
  onQuantityChange: (id: number, change: number) => void;
  onRemoveCard: (messageId: number, cardId: number) => void;
  onGenerateNewCards: (messageId: number) => void;
  onCheckout: (messageId: number) => void;
  calculateTotal: (cards: any[]) => string;
  onDetailsSubmit: (e: React.FormEvent) => void;
  onPaymentSubmit: (e: React.FormEvent) => void;
  onSubmit: (e: React.FormEvent) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  messageCards,
  quantities,
  peopleCount,
  orderDetails,
  input,
  setInput,
  setOrderDetails,
  onQuantityChange,
  onRemoveCard,
  onGenerateNewCards,
  onCheckout,
  calculateTotal,
  onDetailsSubmit,
  onPaymentSubmit,
  onSubmit,
  onImageUpload,
}) => {
  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, messageCards]);

  return (
    <>
      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="h-[500px] overflow-y-auto p-4 bg-white/30 backdrop-blur-sm scroll-smooth"
      >
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            messageCards={messageCards}
            quantities={quantities}
            peopleCount={peopleCount}
            orderDetails={orderDetails}
            setOrderDetails={setOrderDetails}
            onQuantityChange={onQuantityChange}
            onRemoveCard={onRemoveCard}
            onGenerateNewCards={onGenerateNewCards}
            onCheckout={onCheckout}
            calculateTotal={calculateTotal}
            onDetailsSubmit={onDetailsSubmit}
            onPaymentSubmit={onPaymentSubmit}
          />
        ))}
      </div>

      <ChatInput
        input={input}
        setInput={setInput}
        onSubmit={onSubmit}
        onImageUpload={onImageUpload}
      />
    </>
  );
};
