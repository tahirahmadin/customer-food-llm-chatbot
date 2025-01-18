import React from 'react';
import { MenuList } from './MenuList';
import { CheckoutForm } from './CheckoutForm';

interface MessageProps {
  message: any;
  messageCards: { [key: number]: any[] };
  quantities: { [key: number]: number };
  peopleCount: number;
  orderDetails: any;
  setOrderDetails: (details: any) => void;
  onQuantityChange: (id: number, change: number) => void;
  onRemoveCard: (messageId: number, cardId: number) => void;
  onGenerateNewCards: (messageId: number) => void;
  onCheckout: (messageId: number) => void;
  calculateTotal: (cards: any[]) => string;
  onDetailsSubmit: (e: React.FormEvent) => void;
  onPaymentSubmit: (e: React.FormEvent) => void;
}

export const Message: React.FC<MessageProps> = ({
  message,
  messageCards,
  quantities,
  peopleCount,
  orderDetails,
  setOrderDetails,
  onQuantityChange,
  onRemoveCard,
  onGenerateNewCards,
  onCheckout,
  calculateTotal,
  onDetailsSubmit,
  onPaymentSubmit
}) => {
  return (
    <div className={`mb-4 flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`max-w-[80%] rounded-2xl p-3 ${
        message.isBot
          ? 'bg-white/80 shadow-sm backdrop-blur-sm'
          : 'bg-orange-500 text-white'
      }`}>
        {message.text && <p>{message.text}</p>}
        {message.image && (
          <img 
            src={message.image} 
            alt="Uploaded" 
            className="max-w-full rounded-lg mb-2"
          />
        )}
        {message.mealCards && (
          <MenuList
            messageId={message.id}
            items={messageCards[message.id] || []}
            quantities={quantities}
            peopleCount={peopleCount}
            onQuantityChange={onQuantityChange}
            onRemoveCard={onRemoveCard}
            onGenerateNewCards={onGenerateNewCards}
            onCheckout={onCheckout}
            calculateTotal={calculateTotal}
          />
        )}
        {message.checkout?.step === 'details' && (
          <CheckoutForm
            step="details"
            orderDetails={orderDetails}
            setOrderDetails={setOrderDetails}
            onSubmit={onDetailsSubmit}
          />
        )}
        {message.checkout?.step === 'payment' && (
          <CheckoutForm
            step="payment"
            orderDetails={orderDetails}
            setOrderDetails={setOrderDetails}
            onSubmit={onPaymentSubmit}
            total={message.checkout.total}
          />
        )}
        {message.options && (
          <div className="mt-3 space-y-2">
            {message.options.map((option: string) => (
              <button
                key={option}
                className="block w-full text-left p-3 rounded-lg bg-white/50 hover:bg-white/70 transition-colors backdrop-blur-sm"
              >
                {option}
              </button>
            ))}
          </div>
        )}
        <span className="text-xs text-gray-500 mt-1 block">
          {message.time}
        </span>
      </div>
    </div>
  );
};