// src/services/chatService.ts
import { config } from "../config";

// Interfaces for type safety
interface ChatResponse {
  response: string;
}

interface MenuResult {
  text?: string;
  content?: string;
  score?: number;
  relevance?: string;
  metadata?: Record<string, any>;
}

interface MilvusResponse {
  response?: {
    results?: MenuResult[];
    query_context?: {
      original_query?: string;
      processed_query?: string;
      timestamp?: string;
    };
  };
  results?: MenuResult[];
  data?: {
    results?: MenuResult[];
  };
  query_context?: {
    original_query?: string;
    processed_query?: string;
    timestamp?: string;
  };
}

export class ChatService {
  private readonly restaurantId: string;
  private readonly queryUrl: string;
  private readonly openaiKey: string;

  constructor() {
    // Validate and extract environment variables
    const restaurantId = import.meta.env.VITE_RESTAURANT_ID;
    const queryUrl = import.meta.env.VITE_PUBLIC_QUERY_DOCUMENT_API_URL;
    const openaiKey = import.meta.env.VITE_PUBLIC_OPENAI_API_KEY;

    // Throw error if any required variable is missing
    if (!restaurantId || !queryUrl || !openaiKey) {
      throw new Error("Missing required environment variables");
    }

    this.restaurantId = restaurantId;
    this.queryUrl = queryUrl;
    this.openaiKey = openaiKey;
  }

  menuItems = [
    {
      id: 137,
      name: "Double Choco Overload",
      description: "Donut with chocolate glaze and sprinkles.",
      category: "Dessert",
      price: "8.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__3.png",
    },
    {
      id: 138,
      name: "The Viral Pistachio Kunafa Box of 6",
      description: "Box of 6 donuts with pistachio kunafa.",
      category: "Dessert",
      price: "47.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__4.png",
    },
    {
      id: 139,
      name: "The Viral Pistachio Kunafa Donut",
      description: "Donut with pistachio kunafa and crushed pistachios.",
      category: "Dessert",
      price: "9.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__5.png",
    },
    {
      id: 140,
      name: "Nutella Donut Box of 6",
      description: "Box of 6 Nutella donuts in assorted flavors.",
      category: "Dessert",
      price: "45.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__6.png",
    },
    {
      id: 141,
      name: "Nutella Munchkins - 10 pieces",
      description: "Bite-sized delights filled with creamy Nutella.",
      category: "Dessert",
      price: "15.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__7.png",
    },
    {
      id: 142,
      name: "Nutella Wonder Star",
      description: "Star-shaped donut filled with Nutella and brownie chunks.",
      category: "Dessert",
      price: "9.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__8.png",
    },
    {
      id: 143,
      name: "Choco Surprise",
      description: "Nutella frosted donut topped with a chocolate munchkin.",
      category: "Dessert",
      price: "9.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__9.png",
    },
    {
      id: 144,
      name: "Dream Cake",
      description: " cake donut with Nutella frosting and hazelnuts.",
      category: "Dessert",
      price: "9.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__10.png",
    },
    {
      id: 145,
      name: "Nutella Frappe",
      description: "Rich Nutella frappe topped with whipped cream.",
      category: "Beverage",
      price: "22.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__11.png",
    },
    {
      id: 146,
      name: "Nutella Croissant",
      description: "Golden croissant filled with creamy Nutella.",
      category: "Dessert",
      price: "15.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__12.png",
    },
    {
      id: 147,
      name: "Nutella Hot Chocolate",
      description: "Velvety hot chocolate infused with Nutella.",
      category: "Hot Beverage",
      price: "20.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__13.png",
    },
    {
      id: 148,
      name: "Bubble Tea",
      description: "Brown sugar milk tea with boba.",
      category: "Cold Beverage",
      price: "21.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__14.png",
    },
    {
      id: 149,
      name: "Hami Melon Bubble Tea",
      description: "Milk tea with Hami melon and boba.",
      category: "Cold Beverage",
      price: "21.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__15.png",
    },
    {
      id: 150,
      name: "Taro Bubble Tea",
      description: "Milk tea with taro flavor and boba.",
      category: "Cold Beverage",
      price: "21.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__16.png",
    },
    {
      id: 151,
      name: "Matcha Bubble Tea",
      description: "Milk tea with matcha and boba.",
      category: "Cold Beverage",
      price: "24.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__17.png",
    },
    {
      id: 152,
      name: "Iced Americano",
      description: "Dairy and sugar-free iced coffee.",
      category: "Cold Beverage",
      price: "16.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__18.png",
    },
    {
      id: 153,
      name: "Iced Tea",
      description: "Refreshing iced tea.",
      category: "Cold Beverage",
      price: "18.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__19.png",
    },
    {
      id: 154,
      name: "Shaken Iced Espresso",
      description: "Smooth iced espresso shaken for flavor.",
      category: "Cold Beverage",
      price: "18.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__20.png",
    },
    {
      id: 155,
      name: "Iced Latte",
      description: "Dairy and sugar-free iced latte.",
      category: "Cold Beverage",
      price: "18.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__21.png",
    },
    {
      id: 156,
      name: "Iced Coffee (Drip Coffee)",
      description: "Dairy and sugar-free drip coffee.",
      category: "Cold Beverage",
      price: "18.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__22.png",
    },
    {
      id: 157,
      name: "Iced Spanish Latte",
      description: "Creamy iced Spanish latte.",
      category: "Cold Beverage",
      price: "22.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__23.png",
    },
    {
      id: 158,
      name: "Iced Chocolate",
      description: "Refreshing iced chocolate drink.",
      category: "Cold Beverage",
      price: "20.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__24.png",
    },
    {
      id: 159,
      name: "Iced Caramel Macchiato",
      description: "Iced coffee with caramel flavor.",
      category: "Cold Beverage",
      price: "20.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__25.png",
    },
    {
      id: 160,
      name: "Iced Mocha",
      description: "Iced coffee with a hint of mocha.",
      category: "Cold Beverage",
      price: "20.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__26.png",
    },
    {
      id: 161,
      name: "Iced French Vanilla Latte",
      description: "Iced latte with French vanilla flavor.",
      category: "Cold Beverage",
      price: "21.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__27.png",
    },
    {
      id: 162,
      name: "Iced Matcha Green Tea",
      description: "Iced tea with matcha flavor.",
      category: "Cold Beverage",
      price: "20.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__28.png",
    },
    {
      id: 163,
      name: "Strawberry & Cream Frappe",
      description: "Strawberry frappe served without whipped cream.",
      category: "Cold Beverage",
      price: "22.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__29.png",
    },
    {
      id: 164,
      name: "Cookies & Cream Frappe - Made with Oreo",
      description: "Oreo frappe served without whipped cream.",
      category: "Cold Beverage",
      price: "23.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__30.png",
    },
    {
      id: 165,
      name: "Strawberry Cheesecake Crush Frappe",
      description: "Creamy strawberry cheesecake frappe.",
      category: "Cold Beverage",
      price: "22.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__31.png",
    },
    {
      id: 166,
      name: "Double Chocolate Frappe",
      description: "Rich chocolate frappe without whipped cream.",
      category: "Cold Beverage",
      price: "22.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__32.png",
    },
    {
      id: 167,
      name: "Banana Blueberry Frappe",
      description: "Fruity frappe with banana and blueberry.",
      category: "Cold Beverage",
      price: "23.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__33.png",
    },
    {
      id: 168,
      name: "Boston Kreme Frappe",
      description: "Boston kreme frappe blended with milk and ice.",
      category: "Cold Beverage",
      price: "23.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__34.png",
    },
    {
      id: 169,
      name: "Caramel Frappe",
      description: "Caramel frappe served without whipped cream.",
      category: "Cold Beverage",
      price: "21.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__35.png",
    },
    {
      id: 170,
      name: "Madagascar Vanilla Frappe",
      description: "Vanilla frappe served without whipped cream.",
      category: "Cold Beverage",
      price: "21.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__36.png",
    },
    {
      id: 171,
      name: "Lotus Cheesecake Dream Frappe",
      description: "Blended Lotus Biscoff with cheesecake and milk.",
      category: "Cold Beverage",
      price: "22.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__37.png",
    },
    {
      id: 172,
      name: "Dulce De Leche Frappe",
      description: "Rich and creamy indulgent Dulce De Leche frappe.",
      category: "Cold Beverage",
      price: "23.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__38.png",
    },
    {
      id: 173,
      name: "Matcha Frappe",
      description: "Matcha frappe served without whipped cream.",
      category: "Cold Beverage",
      price: "23.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__39.png",
    },
    {
      id: 174,
      name: "Mango Cheesecake Bliss Frappe",
      description: "Mango cheesecake frappe for fruity delight.",
      category: "Cold Beverage",
      price: "22.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__40.png",
    },
    {
      id: 175,
      name: "Chicken Tikka Lunch Combo",
      description: "Sandwich, refresher, and fresh donut combo.",
      category: "Meal Deal",
      price: "52.73 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__41.png",
    },
    {
      id: 176,
      name: "Spicy Cheese Lunch Combo",
      description: "Sandwich, refresher, and fresh donut combo.",
      category: "Meal Deal",
      price: "52.73 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__42.png",
    },
    {
      id: 177,
      name: "Turkey & Cheese Lunch Combo",
      description: "Sandwich, refresher, and fresh donut combo.",
      category: "Meal Deal",
      price: "52.73 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__43.png",
    },
    {
      id: 178,
      name: "Chicken Tikka Sourdough Meal",
      description: "Chicken Tikka sandwich with coffee.",
      category: "Meal Deal",
      price: "28.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__44.png",
    },
    {
      id: 179,
      name: "Spicy Cheese Sandwich Meal",
      description: "Paneer Tikka sandwich with coffee.",
      category: "Meal Deal",
      price: "28.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__45.png",
    },
    {
      id: 180,
      name: "Turkey & Cheese Sourdough Meal",
      description: "Turkey & cheese sandwich with coffee.",
      category: "Meal Deal",
      price: "28.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__46.png",
    },
    {
      id: 181,
      name: "Build Your Own Double Egg Sandwich Combo",
      description: "Egg sandwich and coffee combo.",
      category: "Meal Deal",
      price: "25.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__47.png",
    },
    {
      id: 182,
      name: "Egg Sandwich Combo",
      description: "Egg sandwich and any coffee.",
      category: "Meal Deal",
      price: "21.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__48.png",
    },
    {
      id: 183,
      name: "Cream Cheese Bagel Combo",
      description: "Bagel with cream cheese and coffee.",
      category: "Meal Deal",
      price: "19.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__49.png",
    },
    {
      id: 184,
      name: "Plain Croissant Combo",
      description: "Plain croissant with any coffee.",
      category: "Meal Deal",
      price: "21.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__50.png",
    },
    {
      id: 185,
      name: "Cheese Croissant Combo",
      description: "Cheese croissant with any coffee.",
      category: "Meal Deal",
      price: "21.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__51.png",
    },
    {
      id: 186,
      name: "Turkey and Cheese Croissant Combo",
      description: "Turkey & cheese croissant with coffee.",
      category: "Meal Deal",
      price: "23.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__52.png",
    },
    {
      id: 187,
      name: "Happy Birthday Dozen Box",
      description: "Celebrate with 12 freshly-made donuts.",
      category: "Gifting Box",
      price: "58.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__53.png",
    },
    {
      id: 188,
      name: "Thank You Dozen Box",
      description: "Say thanks with 12 handcrafted donuts.",
      category: "Gifting Box",
      price: "58.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__54.png",
    },
    {
      id: 189,
      name: "Congrats Dozen Box",
      description: "Celebrate with 12 freshly-handcrafted donuts.",
      category: "Gifting Box",
      price: "58.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__55.png",
    },
    {
      id: 190,
      name: "2 Dozen Donuts",
      description: "Enjoy 24 fresh, hand-made donuts.",
      category: "Special Offers",
      price: "99.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__56.png",
    },
    {
      id: 191,
      name: "Dozen Donuts Buy 8 get 4 Free",
      description: "12 freshly handcrafted donuts.",
      category: "Special Offers",
      price: "56.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__57.png",
    },
    {
      id: 192,
      name: "Half Dozen Donuts (Buy 5 get 1 Free)",
      description: "6 freshly hand-made donuts.",
      category: "Special Offers",
      price: "35.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__58.png",
    },
    {
      id: 193,
      name: "Assorted Box Of 12 Buy 8 Get 4 Free",
      description: "12 assorted fresh donuts.",
      category: "Special Offers",
      price: "56.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__59.png",
    },
    {
      id: 194,
      name: "Assorted Box of 6 (Buy 5 get 1 Free)",
      description: "6 assorted fresh donuts.",
      category: "Special Offers",
      price: "35.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__60.png",
    },
    {
      id: 195,
      name: "Box Of 3 Donuts",
      description: "Enjoy 3 freshly-made donuts.",
      category: "Special Offers",
      price: "19.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__61.png",
    },
    {
      id: 196,
      name: "Munchkins Bundle",
      description: "20 munchkins with a medium coffee box.",
      category: "Dessert Bundles",
      price: "52.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__62.png",
    },
    {
      id: 197,
      name: "Family Deal",
      description: "Perfect meal for the family.",
      category: "Dessert Bundles",
      price: "59.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__63.png",
    },
    {
      id: 198,
      name: "Super Family Deal",
      description: "12 donuts + 4 coffee servings.",
      category: "Dessert Bundles",
      price: "71.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__64.png",
    },
    {
      id: 199,
      name: "Dunkin' Medium Coffee Box Serves 4",
      description: "Coffee box for 4 servings.",
      category: "Dessert Bundles",
      price: "32.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__65.png",
    },
    {
      id: 200,
      name: "Dunkin' Large Coffee Box Serves 10",
      description: "Coffee box for 10 servings.",
      category: "Dessert Bundles",
      price: "99.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__66.png",
    },
    {
      id: 201,
      name: "Wow Deal For 1",
      description: "Hot/Cold Medium Coffee with 2 donuts.",
      category: "Combo",
      price: "20.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__67.png",
    },
    {
      id: 202,
      name: "Assorted Freshly Made Munchkins 10 Pcs",
      description: "10 assorted munchkins in pre-selected flavors.",
      category: "Dessert Snack",
      price: "12.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__68.png",
    },
    {
      id: 203,
      name: "Freshly Made Munchkins 20pcs",
      description: "20 assorted munchkins with various flavors.",
      category: "Dessert Snack",
      price: "20.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__69.png",
    },
    {
      id: 204,
      name: "Espresso Double",
      description: "Rich double espresso shot.",
      category: "Hot Beverage",
      price: "13.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__70.png",
    },
    {
      id: 205,
      name: "Americano",
      description: "Smooth, rich Americano coffee.",
      category: "Cold Beverage",
      price: "16.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__71.png",
    },
    {
      id: 206,
      name: "Tea",
      description: "Classic tea blend.",
      category: "Hot Beverage",
      price: "16.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__72.png",
    },
    {
      id: 207,
      name: "Cappuccino",
      description: "Creamy cappuccino with frothy milk.",
      category: "Hot Beverage",
      price: "18.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__73.png",
    },
    {
      id: 208,
      name: "Latte",
      description: "Smooth latte with steamed milk.",
      category: "Cold Beverage",
      price: "18.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__74.png",
    },
    {
      id: 209,
      name: "Spanish Latte",
      description: "Rich latte with Spanish flavors.",
      category: "Cold Beverage",
      price: "23.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__75.png",
    },
    {
      id: 210,
      name: "Matcha Green Tea Latte",
      description: "Green tea latte with matcha flavors.",
      category: "Cold Beverage",
      price: "20.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__76.png",
    },
    {
      id: 211,
      name: "Hot Chocolate",
      description: "Rich, creamy hot chocolate.",
      category: "Hot Beverage",
      price: "23.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__77.png",
    },
    {
      id: 212,
      name: "Dulce De Leche Latte",
      description: "Sweet latte with Dulce De Leche flavors.",
      category: "Cold Beverage",
      price: "20.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__78.png",
    },
    {
      id: 213,
      name: "Dunkin Original Coffee",
      description: "Classic Dunkin coffee blend.",
      category: "Hot Beverage",
      price: "11.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__79.png",
    },
    {
      id: 214,
      name: "Caramel Macchiato",
      description: "Sweet caramel coffee blend.",
      category: "Cold Beverage",
      price: "20.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__80.png",
    },
    {
      id: 215,
      name: "French Vanilla Latte",
      description: "Classic latte with French vanilla.",
      category: "Cold Beverage",
      price: "20.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__81.png",
    },
    {
      id: 216,
      name: "Mocha",
      description: "Rich mocha coffee blend.",
      category: "Cold Beverage",
      price: "20.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontenddunkin_dubai_images/image__82.png",
    },
    {
      id: 217,
      name: "Peach Refresher",
      description: "Fruity and refreshing peach drink.",
      category: "Cold Beverage",
      price: "20.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__83.png",
    },
    {
      id: 218,
      name: "Strawberry Refresher",
      description: "Fruity and refreshing strawberry drink.",
      category: "Cold Beverage",
      price: "20.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__84.png",
    },
    {
      id: 219,
      name: "Blue Lagoon Refresher",
      description: "Refreshing blue lagoon drink.",
      category: "Cold Beverage",
      price: "20.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__85.png",
    },
    {
      id: 220,
      name: "Watermelon Refresher",
      description: "Fruity watermelon drink.",
      category: "Cold Beverage",
      price: "20.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__86.png",
    },
    {
      id: 221,
      name: "Mango Refresher",
      description: "Tropical mango drink.",
      category: "Cold Beverage",
      price: "20.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__87.png",
    },
    {
      id: 222,
      name: "Sugared Donut",
      description: "Classic sugared donut.",
      category: "Donut",
      price: "7.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__88.png",
    },
    {
      id: 223,
      name: "Glazed Donut",
      description: "Soft glazed donut.",
      category: "Donut",
      price: "7.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__89.png",
    },
    {
      id: 224,
      name: "Choco Frosted Donut",
      description: "Chocolate frosted donut.",
      category: "Donut",
      price: "7.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__90.png",
    },
    {
      id: 225,
      name: "Strawberry Frosted Donut",
      description: "Strawberry frosted donut.",
      category: "Donut",
      price: "7.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__91.png",
    },
    {
      id: 226,
      name: "Bavarian Donut",
      description: "Cream-filled Bavarian donut.",
      category: "Donut",
      price: "7.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__92.png",
    },
    {
      id: 227,
      name: "Chocolate Sprinkles Donut",
      description: "Donut with chocolate sprinkles.",
      category: "Donut",
      price: "7.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__93.png",
    },
    {
      id: 228,
      name: "Cinnamon Roll",
      description: "Classic cinnamon roll.",
      category: "Pastry",
      price: "7.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__94.png",
    },
    {
      id: 229,
      name: "Blue Marble Donut",
      description: "Blue marble-styled donut.",
      category: "Donut",
      price: "7.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__95.png",
    },
    {
      id: 230,
      name: "Boston Kreme Donut",
      description: "Boston Kreme-filled donut.",
      category: "Donut",
      price: "7.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__96.png",
    },
    {
      id: 231,
      name: "Chocolate Eclair",
      description: "",
      category: null,
      price: "8.00 AED",
      restaurant: "Dunkin Dubai",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__97.png",
    },
    {
      id: 232,
      name: "Vanilla All",
      description: "",
      category: "Pastry",
      price: "7.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__98.png",
    },
    {
      id: 233,
      name: "Choco Wacko Donut",
      description: "Choco Wacko Donut",
      category: "Donut",
      price: "7.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__99.png",
    },
    {
      id: 234,
      name: "Cookies & Cream Made with Oreo",
      description: "",
      category: "Donut",
      price: "8.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__100.png",
    },
    {
      id: 235,
      name: "Choco Butternut Donut",
      description: "",
      category: "Donut",
      price: "8.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__101.png",
    },
    {
      id: 236,
      name: "Chicken Tikka Sourdough",
      description:
        "Enjoy the bold flavors of our freshly made Chicken Tikka Sourdough Sandwich with juicy chicken tikka, creamy mayonnaise, zesty sriracha, and melted cheese.",
      category: "Sandwich",
      price: "23.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__102.png",
    },
    {
      id: 237,
      name: "Spicy Cheese Sandwich",
      description:
        "Paneer Tikka Sourdough Sandwich with creamy mayonnaise, spicy sriracha, and gooey cheese.",
      category: "Sandwich",
      price: "23.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__103.png",
    },
    {
      id: 238,
      name: "Egg Sandwich",
      description:
        "Egg sandwich with your choice of sauce and optional cheese.",
      category: "Sandwich",
      price: "14.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__104.png",
    },
    {
      id: 239,
      name: "Double Egg Bagel",
      description: "",
      category: "Bagel",
      price: "18.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__105.png",
    },
    {
      id: 240,
      name: "Cream Cheese Bagel",
      description: "Bagel with cream cheese filling.",
      category: "Bagel",
      price: "14.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__106.png",
    },
    {
      id: 241,
      name: "Cheese Croissant",
      description: "Cheese in a flaky buttery croissant.",
      category: "Pastry",
      price: "16.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__107.png",
    },
    {
      id: 242,
      name: "Double Egg Croissant",
      description: "",
      category: "Pastry",
      price: "18.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__108.png",
    },
    {
      id: 243,
      name: "Turkey & Cheese Sourdough",
      description: "",
      category: "Sandwich",
      price: "21.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__109.png",
    },
    {
      id: 244,
      name: "Double Egg Potato Bun Sandwich",
      description:
        "Choice of double egg sandwich with your choice of sauce and optional cheese.",
      category: "Sandwich",
      price: "18.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__110.png",
    },
    {
      id: 245,
      name: "Egg Croissant",
      description: "",
      category: "Pastry",
      price: "14.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__111.png",
    },
    {
      id: 246,
      name: "Turkey and Cheese Croissant",
      description: "Turkey and cheese in a flaky buttery croissant.",
      category: "Pastry",
      price: "18.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__112.png",
    },
    {
      id: 247,
      name: "Plain Croissant",
      description: "Made with layers of flaky and buttery pastry dough.",
      category: "Pastry",
      price: "11.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__113.png",
    },
    {
      id: 248,
      name: "Sandwiches",
      description: "Chicken Caesar Wrap",
      category: "Sandwich",
      price: "24.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__114.png",
    },
    {
      id: 249,
      name: "Halloumi & Avocado Muffin",
      description: "",
      category: "Muffin",
      price: "24.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__115.png",
    },
    {
      id: 250,
      name: "Cheese Toastie",
      description: "",
      category: "Toast",
      price: "24.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__116.png",
    },
    {
      id: 251,
      name: "Grilled Chicken Pesto",
      description: "",
      category: "Sandwich",
      price: "24.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__117.png",
    },
    {
      id: 252,
      name: "Roasted Beef",
      description: "",
      category: "Sandwich",
      price: "24.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__118.png",
    },
    {
      id: 253,
      name: "Tuna Melt",
      description: "",
      category: "Sandwich",
      price: "24.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__119.png",
    },
    {
      id: 254,
      name: "Bakery",
      description:
        "Walnut Brownies made with walnuts, dense, fudgy, and with a chewy texture. The walnuts add a nutty flavor and crunch.",
      category: "Bakery",
      price: "10.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__120.png",
    },
    {
      id: 255,
      name: "Chocolate Muffins with Filling",
      description:
        "Mixed with chocolate chips and filled with chocolate sauce.",
      category: "Muffin",
      price: "13.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__121.png",
    },
    {
      id: 256,
      name: "Blueberry Muffins with Filling",
      description: "",
      category: "Muffin",
      price: "13.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__122.png",
    },
    {
      id: 257,
      name: "Brew At Home",
      description:
        "Dunkin Espresso Capsules - Signature Blend (10 Capsules). Smooth and flavorful medium-dark roast espresso.",
      category: "Beverage Capsules",
      price: "21.50 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__123.png",
    },
    {
      id: 258,
      name: "Dunkin Espresso Capsules - Light Roast (10 Capsules)",
      description: "Bright and balanced taste. Recommended anytime of the day.",
      category: "Beverage Capsules",
      price: "21.50 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__124.png",
    },
    {
      id: 259,
      name: "Dunkin Espresso Capsules - Bold Roast (10 Capsules)",
      description:
        "A deliciously smooth dark-roasted espresso with a robust finish.",
      category: "Beverage Capsules",
      price: "21.50 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__125.png",
    },
    {
      id: 260,
      name: "Hazelnut (Ground)",
      description: "100% Arabica Coffee.",
      category: "Beverages Capsules",
      price: "51.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__126.png",
    },
    {
      id: 261,
      name: "Original Blend (Whole Bean)",
      description: "100% Arabica Coffee.",
      category: "Beverages Capsules",
      price: "51.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__127.png",
    },
    {
      id: 262,
      name: "Dark Roast Ground",
      description: "100% Arabica Coffee.",
      category: "Beverages Capsules",
      price: "61.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__128.png",
    },
    {
      id: 263,
      name: "Original Blend (Ground)",
      description: "100% Arabica Coffee.",
      category: "Beverages Capsules",
      price: "51.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__129.png",
    },
    {
      id: 264,
      name: "Other Beverages",
      description: "Water",
      category: "Water",
      price: "6.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__130.png",
    },
    {
      id: 265,
      name: "BLU - Sparkling Water",
      description: "",
      category: "Beverages",
      price: "8.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__131.png",
    },
    {
      id: 266,
      name: "Fresh Orange Juice",
      description: "",
      category: "Cold Beverages",
      price: "13.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__132.png",
    },
    {
      id: 267,
      name: "Coke",
      description: "",
      category: "Cold Beverages",
      price: "7.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__133.png",
    },
    {
      id: 268,
      name: "Sprite",
      description: "",
      category: "Cold Beverages",
      price: "7.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__134.png",
    },
    {
      id: 269,
      name: "Fanta",
      description: "",
      category: "Cold Beverages",
      price: "7.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__135.png",
    },
    {
      id: 270,
      name: "Diet Coke",
      description: "",
      category: "Cold Beverages",
      price: "7.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__136.png",
    },
    {
      id: 271,
      name: "Red Bull",
      description: "",
      category: "Cold Beverages",
      price: "17.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__137.png",
    },
    {
      id: 272,
      name: "Red Bull - Sugar Free",
      description: "",
      category: "Cold Beverages",
      price: "17.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__138.png",
    },
    {
      id: 273,
      name: "Red Bull - Red Edition",
      description: "",
      category: "Cold Beverages",
      price: "17.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__139.png",
    },
    {
      id: 274,
      name: "Stainless Thermos Bottle White 500ML",
      description: "",
      category: "Bottle Merchandise",
      price: "61.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__140.png",
    },
    {
      id: 275,
      name: "Stainless Thermos Bottle Pink 500ML",
      description: "",
      category: "Bottle Merchandise",
      price: "61.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__141.png",
    },
    {
      id: 276,
      name: "Stainless Thermos Bottle Gold 500ML",
      description: "",
      category: "Bottle Merchandise",
      price: "61.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__142.png",
    },
    {
      id: 277,
      name: "Stainless Thermos Bottle Orange 500ML",
      description: "",
      category: "Bottle Merchandise",
      price: "61.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__143.png",
    },
    {
      id: 278,
      name: "Double Walled Water Bottle White 500ML",
      description: "",
      category: "Bottle Merchandise",
      price: "61.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__144.png",
    },
    {
      id: 279,
      name: "Double Walled Water Bottle Pink 500ML",
      description: "",
      category: "Bottle Merchandise",
      price: "61.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__145.png",
    },
    {
      id: 280,
      name: "Double Walled Water Bottle Gold 500ML",
      description: "",
      category: "Bottle Merchandise",
      price: "61.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__146.png",
    },
    {
      id: 281,
      name: "Double Walled Water Bottle Orange 500ML",
      description: "",
      category: "Bottle Merchandise",
      price: "61.00 AED",
      restaurant: "Dunkin Donut",
      image: "/dunkinpapajones_frontend/dunkin_dubai_images/image__143.png",
    },
  ];
  // Comprehensive method to extract menu context from Milvus response
  private extractMenuContext(milvusData: any): string {
    // Logging for debugging
    console.log("Raw Milvus Data:", JSON.stringify(milvusData, null, 2));

    // Multiple strategies to extract results
    const resultsExtractionStrategies = [
      () => milvusData.response?.results,
      () => milvusData.results,
      () => milvusData.data?.results,
    ];

    // Find first non-empty result set
    let extractedResults: MenuResult[] | undefined;
    for (const strategy of resultsExtractionStrategies) {
      extractedResults = strategy();
      if (extractedResults && extractedResults.length > 0) {
        break;
      }
    }

    // Log extracted results
    console.log(
      "Extracted Results:",
      JSON.stringify(extractedResults, null, 2)
    );

    // Handle case of no results
    if (!extractedResults || extractedResults.length === 0) {
      console.warn("No menu results found");
      return "";
    }

    // Process and clean menu items
    const menuItems = extractedResults
      .map((result) => {
        // Ensure we have text to process
        const text = (result.text || result.content || "").trim();

        // Extract prices
        const priceMatches = text.match(/AED\s*\d+(\.\d{2})?/g) || [];
        const prices = priceMatches.map((p) => p.trim());

        // Clean description by removing prices
        const description = text
          .replace(/AED\s*\d+(\.\d{2})?/g, "")
          .replace(/\s+/g, " ")
          .trim();

        // Combine price and description
        return prices.length > 0 ? `${prices[0]} ${description}` : description;
      })
      .filter((item) => item.length > 0)
      .filter(
        (item, index, self) => self.findIndex((t) => t === item) === index
      );

    // Log processed menu items
    console.log("Processed Menu Items:", menuItems);

    return menuItems.join("\n");
  }

  private createSystemPrompt(menuContext: string, query: string): string {
    return `You are a helpful assistant for ordering food from a restaurant menu. A user will provide natural language queries to order food, and your goal is to interpret their requests and match them with relevant menu items. Your response should only include the names of the food items, ensuring clarity and simplicity for the user.
  
  Here’s your process:
  1. **Understand the user’s request**: Accurately interpret food-related requests, such as specific dish names, types of cuisine, or dietary preferences. Ensure the user’s intent is clear.
  2. **Search the menu**: The menu is provided as an array of objects, where each object represents a food item with fields such as name, description, price, and category.
  3. **Respond with food item names**: Based on the user’s request, provide a response that contains only the names of the menu items they are interested in or that match their query. 
     - Example for a direct request: If the user asks for "pizza," your response could be: ["Margherita Pizza", "Pepperoni Pizza"].
     - Example for ambiguous requests: If the user says, "I’m hungry," your response could suggest options like: ["Spaghetti Carbonara", "Margherita Pizza"].
  4. **Clarify ambiguities**: If the user’s query is unclear or too broad, respond with a question to guide them toward making a choice. Example: "What kind of food are you in the mood for? (e.g., pasta, pizza, salads)"
  

   User Query: ${query}
   Available Menu Items:${menuContext}


  ### Output Format:
  - **Items**: Always respond in the following format:
    - **Array of item names only**: ["Item Name 1", "Item Name 2"]
  - Do not include descriptions, prices, or additional details in your response.
  
  ### Example Menu:
  [
    { "name": "Spaghetti Carbonara", "description": "Classic Italian pasta with creamy sauce and bacon", "price": 12.99, "category": "Pasta" },
    { "name": "Margherita Pizza", "description": "Pizza with fresh mozzarella, basil, and tomato", "price": 9.99, "category": "Pizza" }
  ]
  
  ### Example Queries and Responses:
  1. Query: "I want pizza."
     Response: ["Margherita Pizza"]
  2. Query: "I’m hungry."
     Response: ["Spaghetti Carbonara", "Margherita Pizza"]
  3. Query: "Do you have pasta?"
     Response: ["Spaghetti Carbonara"]
  
  ### Final Instructions:
  Use the provided menu data and the user query to generate a concise response containing only the names of relevant food items. If the user query cannot be matched to specific items, ask clarifying questions to help them decide.`;
  }

  // Main method to query menu
  async queryMenu(query: string): Promise<ChatResponse> {
    try {
      // Validate input
      if (!query || typeof query !== "string") {
        throw new Error("Invalid query provided");
      }

      // Fetch from Milvus backend
      const milvusResponse = await fetch(this.queryUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          restaurantId: this.restaurantId,
          query,
        }),
      });
      console.log("milvusResponse");
      console.log(milvusResponse);
      // Check Milvus response
      if (!milvusResponse.ok) {
        const errorText = await milvusResponse.text();
        console.error("Milvus Error:", errorText);
        throw new Error(`Milvus fetch failed: ${errorText}`);
      }

      // Parse Milvus response
      const milvusData: MilvusResponse = await milvusResponse.json();

      // Extract menu context
      const menuContext = this.extractMenuContext(milvusData);

      // Handle empty menu context
      if (!menuContext.trim()) {
        return {
          response:
            "I apologize, but I couldn't find any menu items matching your query.",
        };
      }

      // Prepare OpenAI request
      const openaiResponse = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.openaiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: this.createSystemPrompt(menuContext, query),
              },
              {
                role: "user",
                content: query,
              },
            ],
            temperature: 0.3,
            max_tokens: 150,
          }),
        }
      );

      // Validate OpenAI response
      if (!openaiResponse.ok) {
        const errorText = await openaiResponse.text();
        console.error("OpenAI Error:", errorText);
        throw new Error(`OpenAI request failed: ${errorText}`);
      }

      // Process OpenAI response
      const openaiData = await openaiResponse.json();
      const response = openaiData.choices[0].message.content;

      // Final validation
      // if (!response.includes("AED") && menuContext.includes("AED")) {
      //   return this.queryMenu(
      //     `Please list the exact items and prices (in AED) for: ${query}`
      //   );
      // }

      return { response };
    } catch (error) {
      console.error("Comprehensive Error in ChatService:", error);
      return {
        response:
          "I apologize, but there was an error processing your request.",
      };
    }
  }
}
