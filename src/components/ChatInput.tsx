// src/components/ChatInput.tsx
import React from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  onSubmit,
  isLoading = false
}) => {
  return (
    <div className="p-4 border-t border-white/20 bg-white/50 backdrop-blur-sm">
      <form onSubmit={onSubmit} className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask about the menu..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          className="flex-1 p-2 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 backdrop-blur-sm placeholder:text-gray-500 disabled:opacity-50"
        />
        <button 
          type="submit" 
          disabled={isLoading || !input.trim()}
          className="p-2 bg-orange-500 hover:bg-orange-600 rounded-full text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};