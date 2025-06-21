// src/types/index.ts
export interface MenuItem {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  sizePricing: {
    Small: number;
    Regular: number;
    Large: number;
  };
  image: string;
  category: string;
}

export interface CartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  customizations?: {
    size: string;
    milk: string;
    toppings: string[];
    notes: string;
  };
}

export interface FavoriteItem {
  id: string;
  menuItemId: string;
  name: string;
  customizations: {
    size: string;
    milk: string;
    toppings: string[];
    notes: string;
  };
  totalPrice: number;
  savedAt: Date;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  orderDate: Date;
  status: 'completed' | 'preparing' | 'ready';
}