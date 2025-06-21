// src/data/menuItems.ts
import { MenuItem } from '../types';
import imgCoffee from "../assets/Coffee.png";

export const menuItems: MenuItem[] = [
  {
    id: "1",
    name: "Americano",
    description: "Strong coffee with hot water",
    basePrice: 25000,
    sizePricing: { Small: 20000, Regular: 25000, Large: 30000 },
    image: imgCoffee,
    category: "Coffee"
  },
  {
    id: "2",
    name: "Latte",
    description: "Espresso with steamed milk and foam",
    basePrice: 30000,
    sizePricing: { Small: 25000, Regular: 30000, Large: 35000 },
    image: imgCoffee,
    category: "Latte"
  },
  {
    id: "3",
    name: "Cappuccino",
    description: "Espresso topped with thick foam and steamed milk",
    basePrice: 32000,
    sizePricing: { Small: 27000, Regular: 32000, Large: 37000 },
    image: imgCoffee,
    category: "Cappuccino"
  },
  {
    id: "4",
    name: "Mocha",
    description: "Espresso with chocolate and steamed milk",
    basePrice: 35000,
    sizePricing: { Small: 30000, Regular: 35000, Large: 40000 },
    image: imgCoffee,
    category: "Mocha"
  },
  {
    id: "5",
    name: "Flat White",
    description: "A velvety blend of espresso and microfoam",
    basePrice: 28000,
    sizePricing: { Small: 23000, Regular: 28000, Large: 33000 },
    image: imgCoffee,
    category: "Coffee"
  },
  {
    id: "6",
    name: "Espresso",
    description: "Concentrated coffee brewed by forcing hot water",
    basePrice: 20000,
    sizePricing: { Small: 15000, Regular: 20000, Large: 25000 },
    image: imgCoffee,
    category: "Coffee"
  },
  {
    id: "7",
    name: "Macchiato",
    description: "Espresso with a dash of foamed milk",
    basePrice: 27000,
    sizePricing: { Small: 22000, Regular: 27000, Large: 32000 },
    image: imgCoffee,
    category: "Coffee"
  },
  {
    id: "8",
    name: "Affogato",
    description: "Vanilla ice cream topped with a shot of espresso",
    basePrice: 40000,
    sizePricing: { Small: 35000, Regular: 40000, Large: 45000 },
    image: imgCoffee,
    category: "Coffee"
  },
  {
    id: "9",
    name: "Irish Coffee",
    description: "Coffee with whiskey, sugar, and cream",
    basePrice: 45000,
    sizePricing: { Small: 40000, Regular: 45000, Large: 50000 },
    image: imgCoffee,
    category: "Coffee"
  },
  {
    id: "10",
    name: "Cold Brew",
    description: "Coffee brewed with cold water over 12 hours",
    basePrice: 30000,
    sizePricing: { Small: 25000, Regular: 30000, Large: 35000 },
    image: imgCoffee,
    category: "Cold Brew"
  },
  {
    id: "11",
    name: "Nitro Coffee",
    description: "Cold brew infused with nitrogen for creaminess",
    basePrice: 38000,
    sizePricing: { Small: 33000, Regular: 38000, Large: 43000 },
    image: imgCoffee,
    category: "Cold Brew"
  },
  {
    id: "12",
    name: "Ristretto",
    description: "A short shot of espresso with a rich flavor",
    basePrice: 22000,
    sizePricing: { Small: 17000, Regular: 22000, Large: 27000 },
    image: imgCoffee,
    category: "Coffee"
  }
];

export const categories = ["Coffee", "Latte", "Cappuccino", "Mocha", "Cold Brew"];