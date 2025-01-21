// src/components/DunkinOrderApp.tsx
import React, { useState } from 'react';
import { useChatContext } from '../context/ChatContext';
import { ChatService } from '../services/chatService';
import { Header } from './Header';
import { Filters } from './Filters';
import { ChatPanel } from './ChatPanel';
import { SlidePanel } from './SlidePanel';
import { config } from '../config';

const chatService = new ChatService();

export const DunkinOrderApp: React.FC = () => {
  const { state, dispatch } = useChatContext();
  const [input, setInput] = useState('');
  const [isVegOnly, setIsVegOnly] = useState(true);
  const [peopleCount, setPeopleCount] = useState(1);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input.trim(),
      isBot: false,
      time: new Date().toLocaleTimeString(),
    };

    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    setInput('');
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const response = await chatService.queryMenu(input);
      
      const botMessage = {
        id: Date.now() + 1,
        text: response.response,
        isBot: true,
        time: new Date().toLocaleTimeString(),
      };

      dispatch({ type: 'ADD_MESSAGE', payload: botMessage });
    } catch (error) {
      console.error('Error querying menu:', error);
      dispatch({
        type: 'ADD_MESSAGE',
        payload: {
          id: Date.now() + 1,
          text: 'Sorry, I had trouble understanding your question. Please try again.',
          isBot: true,
          time: new Date().toLocaleTimeString(),
        },
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-[#E0E0E0]">
      <div className="relative bg-white/70 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-white/20">
        <Header onOpenPanel={() => setIsPanelOpen(true)} />
        
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
          onImageUpload={() => {}} // Not needed anymore
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