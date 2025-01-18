import React from 'react';
import { Paperclip, Send } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  onSubmit,
  onImageUpload
}) => {
  return (
    <div className="p-4 border-t border-white/20 bg-white/50 backdrop-blur-sm">
      <form onSubmit={onSubmit} className="flex items-center gap-2">
        <label className="p-2 hover:bg-black/5 rounded-full transition-colors cursor-pointer">
          <input
            type="file"
            accept="image/*"
            onChange={onImageUpload}
            className="hidden"
          />
          <Paperclip className="w-5 h-5 text-gray-500" />
        </label>
        <input
          type="text"
          placeholder="Message Dunkin Donuts Bot"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 rounded-lg bg-white/50 focus:outline-none focus:ring-2 focus:ring-orange-500 backdrop-blur-sm placeholder:text-gray-500"
        />
        <button type="submit" className="p-2 bg-orange-500 hover:bg-orange-600 rounded-full text-white transition-colors">
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};