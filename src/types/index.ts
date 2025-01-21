// src/types/index.ts

export interface Message {
    id: number;
    text: string;
    isBot: boolean;
    time: string;
    image?: string;
    mealCards?: MenuCard[];
    checkout?: {
      step: 'details' | 'payment' | 'confirmation';
      total?: string;
      items?: any[];
    };
  }
  
  export interface MenuCard {
    id: number;
    name: string;
    price: string;
    image: string;
    quantity: number;
  }
  
  export interface ChatState {
    messages: Message[];
    isLoading: boolean;
    error: string | null;
    restaurantId: string | null;
  }
  
  export interface Address {
    id: string;
    name: string;
    address: string;
    phone: string;
  }
  
  export interface OrderDetails {
    name: string;
    address: string;
    phone: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  }