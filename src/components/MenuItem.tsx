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
    <div className="flex-shrink-0 w-[100px] bg-[#ECF0E7] rounded-2xl overflow-hidden shadow-lg snap-start p-2">
      <div className="relative">
        <button
          onClick={() => {
            null;
          }}
          className="absolute -right-1 -top-1 p-0.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
        >
          <X className="w-3 h-3 text-gray-600" />
        </button>
        <div className="aspect-square w-full flex items-center justify-center rounded-xl mb-3 border border-gray-100">
          <img src={image} alt={name} className="w-4/5 h-4/5 object-contain" />
        </div>
        <h3 className="font-medium text-gray-800 text-xs mb-0.5 line-clamp-1">
          {name}
        </h3>
        <p className="text-orange-500 font-bold text-xs">${price}</p>
        <div className="flex items-center justify-between mt-3 bg-gray-100/50 rounded-xl p-1.5">
          <button
            onClick={() => null}
            className="w-5 h-5 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Minus className="w-3 h-3 text-gray-600" />
          </button>
          <span className="font-medium text-xs">{quantity} pc</span>
          <button
            onClick={() => null}
            className="w-5 h-5 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
          >
            <Plus className="w-3 h-3 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};
