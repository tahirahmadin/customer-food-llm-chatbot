import React, { useMemo } from "react";
import { RefreshCw, ShoppingBag } from "lucide-react";
import { MenuItem } from "./MenuItem";
import { menuItems } from "../data/menuData";

interface MenuListProps {
  messageId: number;
  items: any[];
}

export const MenuList: React.FC<MenuListProps> = ({ messageId, items }) => {
  const filteredMenuItems = useMemo(() => {
    // Create a map from the items array for quick lookup
    const itemMap = new Map(items.map((item) => [item.id, item.quantity]));

    console.log(itemMap);
    // Filter menuItems and include the quantity from the items array
    return menuItems
      .filter((menuItem) => itemMap.has(menuItem.id.toString()))
      .map((menuItem) => ({
        ...menuItem,
        quantity: itemMap.get(menuItem.id.toString()), // Add quantity to the result
      }));
  }, [items, menuItems]);

  return (
    <div className="mt-4 -mx-4">
      <div className="flex overflow-x-auto pb-4 px-4 gap-4 snap-x scrollbar-hide">
        {console.log(filteredMenuItems)}
        {filteredMenuItems.map((meal, index) => (
          <MenuItem
            key={index}
            name={meal.name}
            price={meal.price}
            image={meal.image}
            quantity={meal.quantity}
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
