import React from 'react';
import { RefreshCw, ShoppingBag } from 'lucide-react';
import { MenuItem } from './MenuItem';

interface MenuListProps {
  messageId: number;
  items: any[];
  quantities: { [key: number]: number };
  peopleCount: number;
  onQuantityChange: (id: number, change: number) => void;
  onRemoveCard: (messageId: number, cardId: number) => void;
  onGenerateNewCards: (messageId: number) => void;
  onCheckout: (messageId: number) => void;
  calculateTotal: (cards: any[]) => string;
}

export const MenuList: React.FC<MenuListProps> = ({
  messageId,
  items,
  quantities,
  peopleCount,
  onQuantityChange,
  onRemoveCard,
  onGenerateNewCards,
  onCheckout,
  calculateTotal
}) => {
  return (
    <div className="mt-4 -mx-4">
      <div className="flex overflow-x-auto pb-4 px-4 gap-4 snap-x scrollbar-hide">
        {items.map((meal) => (
          <MenuItem
            key={meal.id}
            {...meal}
            quantity={quantities[meal.id] || peopleCount}
            peopleCount={peopleCount}
            onQuantityChange={onQuantityChange}
            onRemove={() => onRemoveCard(messageId, meal.id)}
          />
        ))}
      </div>
      <div className="flex justify-center gap-2 -mb-4">
        <button
          onClick={() => onGenerateNewCards(messageId)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition-all shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm font-medium">New Mix</span>
        </button>
        <button
          onClick={() => onCheckout(messageId)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all shadow-sm"
        >
          <ShoppingBag className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">${calculateTotal(items)} • Order</span>
        </button>
      </div>
    </div>
  );
};