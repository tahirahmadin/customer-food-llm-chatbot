import React from 'react';
import { ShoppingBag, CreditCard } from 'lucide-react';

interface CheckoutFormProps {
  step: 'details' | 'payment';
  orderDetails: {
    name: string;
    address: string;
    phone: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
  setOrderDetails: (details: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  total?: string;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  step,
  orderDetails,
  setOrderDetails,
  onSubmit,
  total
}) => {
  if (step === 'details') {
    return (
      <form onSubmit={onSubmit} className="mt-4 space-y-3">
        <input
          type="text"
          placeholder="Full Name"
          value={orderDetails.name}
          onChange={(e) => setOrderDetails({ ...orderDetails, name: e.target.value })}
          className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="text"
          placeholder="Delivery Address"
          value={orderDetails.address}
          onChange={(e) => setOrderDetails({ ...orderDetails, address: e.target.value })}
          className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={orderDetails.phone}
          onChange={(e) => setOrderDetails({ ...orderDetails, phone: e.target.value })}
          className="w-full p-2 rounded-lg bg-white/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          type="submit"
          className="w-full p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Continue to Payment
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3">
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-2xl text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-orange-100 text-sm">Total Amount</p>
            <p className="text-2xl font-bold">${total}</p>
          </div>
          <CreditCard className="w-8 h-8 text-orange-200" />
        </div>
        <div className="space-y-1">
          <p className="text-sm text-orange-100">Delivery to:</p>
          <p className="font-medium">{orderDetails.name}</p>
          <p className="text-sm text-orange-100">{orderDetails.address}</p>
        </div>
      </div>
      <button
        type="submit"
        className="w-full p-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all shadow-lg flex items-center justify-center gap-2 mt-4"
      >
        <ShoppingBag className="w-4 h-4" />
        Pay ${total} & Place Order
      </button>
    </form>
  );
};