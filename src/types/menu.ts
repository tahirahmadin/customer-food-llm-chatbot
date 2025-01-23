// src/types/menu.ts
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  category: string | null;
  price: string;
  currency: string;
  restaurant: string;
  image: string;
}
