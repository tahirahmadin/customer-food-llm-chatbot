import React from "react";
import { X, Plus, Minus } from "lucide-react";

interface MenuItemProps {
  name: string;
  price: string;
  image: string;
  quantity: number;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  name,
  price,
  image,
  quantity,
}) => {
  return (
    <div className="flex-shrink-0 w-[120px] bg-[#ECF0E7] rounded-xl overflow-hidden shadow-lg snap-start p-2">
      <div className="relative">
        <button
          onClick={() => {
            null;
          }}
          className="absolute -right-1 -top-1 p-0.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
        >
          <X className="w-3 h-3 text-gray-600" />
        </button>
        <div className="aspect-square w-full flex items-center justify-center rounded-xl border border-gray-100">
          <img
            src={image}
            alt={name}
            className="w-100 h-100 object-contain rounded-xl"
          />
        </div>
        <h3 className="font-medium text-gray-800 text-xs  line-clamp-2">
          {name}
        </h3>
        <p className="text-orange-500 font-bold text-xs">{price} AED</p>
        <div className="flex items-center justify-center mt-1 bg-gray-100/50 rounded-xl p-1.5">
          <button
            onClick={() => null}
            className="w-8 h-8 bg-white flex items-center justify-center rounded-full shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-3 h-3 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
};
