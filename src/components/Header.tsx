import React from 'react';
import { MoreHorizontal } from 'lucide-react';

interface HeaderProps {
  onOpenPanel: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenPanel }) => {
  return (
    <div className="p-4 border-b border-white/20 flex items-center justify-between bg-white/50 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <img 
          src="https://i.pinimg.com/474x/fc/39/fc/fc39fcad149b7149317c4ae616673eda.jpg"
          alt="Dunkin' Donuts Logo"
          className="w-8 h-8 rounded-full object-cover"
        />
        <div>
          <h1 className="font-semibold">Dunkin'static Order Agent</h1>
        </div>
      </div>
      <button 
        onClick={onOpenPanel} 
        className="p-2 hover:bg-black/5 rounded-full transition-colors"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>
    </div>
  );
};