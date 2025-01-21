// src/components/Message.tsx
import React from 'react';
import { Message as MessageType } from '../types';
import { AlertTriangle } from 'lucide-react';

interface MessageProps {
  message: MessageType;
  onRetry: () => void;
}

export const Message: React.FC<MessageProps> = ({ message, onRetry }) => {
  const isError = message.text.toLowerCase().includes('error') || message.text.toLowerCase().includes('sorry');

  return (
    <div className={`mb-4 flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[80%] rounded-2xl p-3 ${
          message.isBot
            ? isError 
              ? 'bg-red-50 text-red-700' 
              : 'bg-white/80 shadow-sm backdrop-blur-sm'
            : 'bg-orange-500 text-white'
        }`}
      >
        {message.text && (
          <div className="flex items-start gap-2">
            {isError && message.isBot && (
              <AlertTriangle className="w-4 h-4 mt-1 flex-shrink-0" />
            )}
            <p>{message.text}</p>
          </div>
        )}
        
        {message.image && (
          <img 
            src={message.image} 
            alt="Uploaded" 
            className="max-w-full rounded-lg my-2"
          />
        )}

        {message.mealCards && message.isBot && (
          <div className="mt-4">
            {/* Render meal cards here if needed */}
          </div>
        )}

        <span className="text-xs text-gray-500 mt-1 block">
          {message.time}
        </span>

        {isError && message.isBot && (
          <button
            onClick={onRetry}
            className="mt-2 text-sm text-orange-500 hover:text-orange-600 transition-colors"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  );
};