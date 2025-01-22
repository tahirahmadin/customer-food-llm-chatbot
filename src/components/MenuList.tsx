import React from "react";
import { RefreshCw, ShoppingBag } from "lucide-react";
import { MenuItem } from "./MenuItem";

interface MenuListProps {
  messageId: number;
  items: any[];
}

export const MenuList: React.FC<MenuListProps> = ({ messageId, items }) => {
  return (
    <div className="mt-4 -mx-4">
      <div className="flex overflow-x-auto pb-4 px-4 gap-4 snap-x scrollbar-hide">
        {items.map((meal, index) => (
          <MenuItem
            key={index}
            name={meal.name}
            price={meal.price}
            image={
              "https://static.vecteezy.com/system/resources/previews/034/468/048/non_2x/donuts-doughnut-donut-doughnuts-donuts-transparent-background-ai-generated-png.png"
            }
            quantity={2}
          />
        ))}
      </div>
      <div className="flex justify-center gap-2 -mb-4">
        <button
          onClick={() => {
            null;
          }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition-all shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="text-sm font-medium">New Mix</span>
        </button>
        <button
          onClick={() => {
            null;
          }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition-all shadow-sm"
        >
          <ShoppingBag className="w-4 h-4 mr-1" />
          <span className="text-sm font-medium">$21 • Order</span>
        </button>
      </div>
    </div>
  );
};
