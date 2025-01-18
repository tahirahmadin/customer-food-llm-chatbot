import React from 'react';
import { Header } from './components/Header';
import { Filters } from './components/Filters';
import { ChatInput } from './components/ChatInput';
import { Message } from './components/Message';
import { SlidePanel } from './components/SlidePanel';
import { User, MapPin, ShoppingBag, Gift, Award, Home, Trash2 } from 'lucide-react';

interface Address {
  id: string;
  name: string;
  address: string;
  phone: string;
}

const dunkinMenu = [
  {
    name: "Glazed Donut",
    image: "https://cdn3d.iconscout.com/3d/premium/thumb/doughnut-3d-icon-download-in-png-blend-fbx-gltf-file-formats--delicious-logo-donat-bagel-food-pack-drink-icons-5299286.png",
    price: 1.49,
    category: "donut"
  },
  {
    name: "Chocolate Frosted Donut",
   image: "https://png.pngtree.com/png-clipart/20240901/original/pngtree-boston-cream-donut-png-image_15904461.png",
    price: 2.5,
    category: "donut"
  },
  {
    name: "Boston Cream Donut",
    image: "https://cdn3d.iconscout.com/3d/premium/thumb/donut-3d-icon-download-in-png-blend-fbx-gltf-file-formats--delicious-logo-doughnut-bakery-cake-breakfast-favorite-food-pack-drink-icons-8550474.png",
    price: 1.89,
    category: "donut"
  },
  {
    name: "Iced Coffee",
    image: "https://dunkin.co.uk/media/catalog/product/cache/59f43ce58882b8d0a2cdacb95e7b95d8/f/r/frozen-dunkin-coffee_1.png",
    price: 2.99,
    category: "beverage"
  },
  {
    name: "Hot Latte",
    image: "https://dunkin.co.uk/media/catalog/product/cache/59f43ce58882b8d0a2cdacb95e7b95d8/f/r/frozen-dunkin-coffee_1.png",
    price: 3.49,
    category: "beverage"
  },
  {
    name: "Strawberry Coolatta",
    image: "https://hips.hearstapps.com/hmg-prod/images/strawberry-coollatta-1577974044.png?crop=0.551xw:0.898xh;0.219xw,0.0953xh&resize=980:*",
    price: 3.79,
    category: "beverage"
  },
  {
    name: "Chocolate Chip Cookie",
    image: "https://png.pngtree.com/png-clipart/20240327/original/pngtree-cute-chocolate-chip-cookie-png-image_14689318.png",
    price: 1.29,
    category: "cookies"
  },
  {
    name: "Oatmeal Raisin Cookie",
    image: "https://png.pngtree.com/png-clipart/20240227/original/pngtree-oatmeal-raisin-cookie-dessert-photo-png-image_14426860.png",
    price: 1.29,
    category: "cookies"
  },
  {
    name: "Powdered Donut",
    image: "https://png.pngtree.com/png-vector/20230831/ourmid/pngtree-pink-strawberry-donut-with-sprinkles-illustration-png-image_9969629.png",
    price: 1.59,
    category: "donut"
  },
  {
    name: "Caramel Macchiato",
    image: "https://dunkin.co.uk/media/catalog/product/cache/59f43ce58882b8d0a2cdacb95e7b95d8/f/r/frozen-dunkin-coffee_1.png",
    price: 3.99,
    category: "beverage"
  }
];

const getMenuItems = (query: string) => {
  query = query.toLowerCase();
  const beverages = dunkinMenu.filter(item => item.category === 'beverage');
  const randomBeverage = beverages[Math.floor(Math.random() * beverages.length)];

  if (query.includes('donut')) {
    const donuts = dunkinMenu.filter(item => item.category === 'donut');
    return [...donuts, randomBeverage];
  } else if (query.includes('beverage') || query.includes('drink') || query.includes('coffee')) {
    return dunkinMenu.filter(item => item.category === 'beverage');
  } else if (query.includes('cookie')) {
    const cookies = dunkinMenu.filter(item => item.category === 'cookies');
    return [...cookies, randomBeverage];
  }
  // For default case, ensure at least one beverage
  const nonBeverages = dunkinMenu.filter(item => item.category !== 'beverage');
  const randomItems = nonBeverages.sort(() => 0.5 - Math.random()).slice(0, 2);
  return [...randomItems, randomBeverage];
};

const messages = [
  {
    id: 1,
    text: "Welcome to order assistance, What do you want to order?",
    isBot: true,
    time: "23:40"
  }
];

function App() {
  const [input, setInput] = React.useState("");
  const [isVegOnly, setIsVegOnly] = React.useState(true);
  const [peopleCount, setPeopleCount] = React.useState(1);
  const [allMessages, setAllMessages] = React.useState(messages);
  const [savedAddresses, setSavedAddresses] = React.useState<Address[]>(() => {
    const stored = localStorage.getItem('savedAddresses');
    return stored ? JSON.parse(stored) : [];
  });
  const [messageCards, setMessageCards] = React.useState<{ [key: number]: any[] }>({});
  const [isPanelOpen, setIsPanelOpen] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null);
  const [quantities, setQuantities] = React.useState<{ [key: number]: number }>({});
  const [checkoutStep, setCheckoutStep] = React.useState<'items' | 'details' | 'payment' | 'confirmation'>('items');
  const [orderDetails, setOrderDetails] = React.useState({
    name: '',
    address: '',
    phone: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const chatContainerRef = React.useRef<HTMLDivElement>(null);

  // Update quantities when peopleCount changes
  React.useEffect(() => {
    setQuantities(prev => {
      const newQuantities = { ...prev };
      dunkinMenu.forEach((_, index) => {
        newQuantities[index] = peopleCount;
      });
      return newQuantities;
    });
  }, [peopleCount]);

  // Auto scroll to bottom
  React.useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [allMessages, messageCards]);

  const handleDeleteAddress = (id: string) => {
    setSavedAddresses(prev => {
      const updated = prev.filter(addr => addr.id !== id);
      localStorage.setItem('savedAddresses', JSON.stringify(updated));
      return updated;
    });
  };

  const handleRemoveCard = (messageId: number, cardId: number) => {
    setMessageCards(prev => ({
      ...prev,
      [messageId]: prev[messageId]?.filter(card => card.id !== cardId) || []
    }));
  };

  const generateRandomCards = (messageId: number) => {
    const beverages = dunkinMenu.filter(item => item.category === 'beverage');
    const randomBeverage = beverages[Math.floor(Math.random() * beverages.length)];
    const nonBeverages = dunkinMenu.filter(item => item.category !== 'beverage');
    const shuffledNonBeverages = nonBeverages.sort(() => 0.5 - Math.random());
    const numOtherCards = Math.floor(Math.random() * 2) + 1; // 1 or 2 other items
    const selectedItems = [...shuffledNonBeverages.slice(0, numOtherCards), randomBeverage];
    const selectedCards = selectedItems.map(item => ({
      id: dunkinMenu.indexOf(item),
      name: item.name,
      price: item.price.toFixed(2),
      image: item.image,
      quantity: 1
    }));
    
    setMessageCards(prev => ({
      ...prev,
      [messageId]: selectedCards
    }));
  };

  React.useEffect(() => {
    // Initialize message cards from initial messages
    const initialCards = allMessages.reduce((acc, message) => {
      if (message.mealCards) {
        acc[message.id] = message.mealCards;
      }
      return acc;
    }, {});
    setMessageCards(initialCards);
  }, []);

  const handleQuantityChange = (id: number, change: number) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + change)
    }));
  };

  const calculateTotal = (cards: any[]) => {
    return cards.reduce((total, card) => total + (parseFloat(card.price) * quantities[card.id]), 0).toFixed(2);
  };

  const handleCheckout = (messageId: number) => {
    const currentCards = messageCards[messageId] || [];
    const total = calculateTotal(currentCards);
    
    const checkoutMessage = {
      id: allMessages.length + 1,
      text: "Please provide your delivery details:",
      isBot: true,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      checkout: {
        step: 'details',
        total,
        items: currentCards.map(card => ({
          ...card,
          quantity: quantities[card.id]
        }))
      }
    };

    setAllMessages(prev => [...prev, checkoutMessage]);
    setCheckoutStep('details');
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderDetails.name || !orderDetails.address || !orderDetails.phone) return;

    // Save the new address
    const newAddress: Address = {
      id: Date.now().toString(),
      name: orderDetails.name,
      address: orderDetails.address,
      phone: orderDetails.phone
    };
    
    setSavedAddresses(prev => {
      const updated = [...prev, newAddress];
      localStorage.setItem('savedAddresses', JSON.stringify(updated));
      return updated;
    });

    const paymentMessage = {
      id: allMessages.length + 1,
      text: `Hi ${orderDetails.name}, please confirm your order:`,
      isBot: true,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      checkout: { 
        step: 'payment',
        total: allMessages[allMessages.length - 1].checkout.total,
        items: allMessages[allMessages.length - 1].checkout.items
      }
    };

    setAllMessages(prev => [...prev, paymentMessage]);
    setCheckoutStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const confirmationMessage = {
      id: allMessages.length + 1,
      text: "🎉 Order placed successfully! Your delicious treats are on the way.",
      isBot: true,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      checkout: { step: 'confirmation' }
    };

    setAllMessages(prev => [...prev, confirmationMessage]);
    setCheckoutStep('confirmation');
    setOrderDetails({
      name: '',
      address: '',
      phone: '',
      cardNumber: '',
      expiryDate: '',
      cvv: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: allMessages.length + 1,
      text: input,
      isBot: false,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
    };

    setAllMessages(prev => [...prev, userMessage]);

    // Add bot response
    const botResponse = {
      id: allMessages.length + 2,
      text: input.toLowerCase().includes('donut') ? "Here are our delicious donuts:" :
            input.toLowerCase().includes('beverage') || input.toLowerCase().includes('drink') || input.toLowerCase().includes('coffee') ? "Here are our refreshing beverages:" :
            input.toLowerCase().includes('cookie') ? "Here are our tasty cookies:" :
            "Here are some popular items from our menu:",
      isBot: true,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      mealCards: getMenuItems(input).map(item => ({
        id: dunkinMenu.indexOf(item),
        name: item.name,
        price: item.price.toFixed(2),
        image: item.image,
        quantity: 1
      })),
      options: input.toLowerCase().includes("order") ? ["Donuts", "Coffee", "Breakfast Sandwiches", "Bagels"] : undefined
    };

    // Initialize cards for the new message
    if (botResponse.mealCards) {
      setMessageCards(prev => ({
        ...prev,
        [botResponse.id]: botResponse.mealCards
      }));
    }

    setTimeout(() => {
      setAllMessages(prev => [...prev, botResponse]);
    }, 500);

    setInput("");
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setSelectedImage(base64String);
        
        // Add user's image message
        const imageMessage = {
          id: allMessages.length + 1,
          text: "",
          isBot: false,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          image: base64String
        };
        
        setAllMessages(prev => [...prev, imageMessage]);

        // Add bot's response with suggested menu items
        const botResponse = {
          id: allMessages.length + 2,
          text: "Based on your image, here are some items you might like:",
          isBot: true,
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
          mealCards: dunkinMenu.slice(0, 3).map(item => ({
            id: dunkinMenu.indexOf(item),
            name: item.name,
            price: item.price.toFixed(2),
            image: item.image,
            quantity: 1
          }))
        };

        setTimeout(() => {
          setAllMessages(prev => [...prev, botResponse]);
          setMessageCards(prev => ({
            ...prev,
            [botResponse.id]: botResponse.mealCards
          }));
        }, 500);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 bg-[#E0E0E0]">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 bg-repeat opacity-5"
        style={{ backgroundSize: '400px',backgroundSize:'cover' }}
      />
      
      {/* Glass Container */}
      <div className="relative bg-white/70 backdrop-blur-md rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-white/20">
        <Header onOpenPanel={() => setIsPanelOpen(true)} />
        
        <Filters
          isVegOnly={isVegOnly}
          setIsVegOnly={setIsVegOnly}
          peopleCount={peopleCount}
          setPeopleCount={setPeopleCount}
        />

        {/* Chat Messages */}
        <div 
          ref={chatContainerRef}
          className="h-[500px] overflow-y-auto p-4 bg-white/30 backdrop-blur-sm scroll-smooth"
        >
          {allMessages.map((message) => (
            <Message
              key={message.id}
              message={message}
              messageCards={messageCards}
              quantities={quantities}
              peopleCount={peopleCount}
              orderDetails={orderDetails}
              setOrderDetails={setOrderDetails}
              onQuantityChange={handleQuantityChange}
              onRemoveCard={handleRemoveCard}
              onGenerateNewCards={generateRandomCards}
              onCheckout={handleCheckout}
              calculateTotal={calculateTotal}
              onDetailsSubmit={handleDetailsSubmit}
              onPaymentSubmit={handlePaymentSubmit}
            />
          ))}
        </div>

        <ChatInput
          input={input}
          setInput={setInput}
          onSubmit={handleSubmit}
          onImageUpload={handleImageUpload}
        />
      </div>
      <SlidePanel
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)} 
        savedAddresses={savedAddresses}
        onDeleteAddress={handleDeleteAddress}
      />
    </div>
  );
}

export default App;