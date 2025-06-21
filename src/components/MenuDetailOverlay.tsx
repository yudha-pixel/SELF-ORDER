import { useState } from 'react';
import { X, Minus, Plus, Heart } from 'lucide-react';

interface MenuItem {
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

interface MenuDetailOverlayProps {
  item: MenuItem;
  onClose: () => void;
  onAddToCart: (item: MenuItem, quantity: number, customizations: any) => void;
  onSaveFavorite: (item: MenuItem, customizations: any, totalPrice: number) => void;
  favorites: any[];
}

export default function MenuDetailOverlay({ item, onClose, onAddToCart, onSaveFavorite, favorites }: MenuDetailOverlayProps) {
  const [selectedSize, setSelectedSize] = useState('Regular');
  const [selectedMilk, setSelectedMilk] = useState('Regular Milk');
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  const sizeOptions = [
    { name: 'Small', price: item.sizePricing.Small },
    { name: 'Regular', price: item.sizePricing.Regular },
    { name: 'Large', price: item.sizePricing.Large }
  ];

  const milkOptions = [
    { name: 'Regular Milk', price: 0 },
    { name: 'Less Milk', price: 0 },
    { name: 'Oat Milk', price: 5000 }
  ];

  const calculateTotalPrice = () => {
    let total = item.sizePricing[selectedSize as keyof typeof item.sizePricing];
    
    // Add milk price
    const milkPrice = milkOptions.find(m => m.name === selectedMilk)?.price || 0;
    total += milkPrice;
    
    return total * quantity;
  };

  const handleAddToCart = () => {
    const customizations = {
      size: selectedSize,
      milk: selectedMilk,
      notes
    };

    const customizedItem = {
      ...item,
      basePrice: item.sizePricing[selectedSize as keyof typeof item.sizePricing] + (milkOptions.find(m => m.name === selectedMilk)?.price || 0)
    };
    
    onAddToCart(customizedItem, quantity, customizations);
    onClose();
  };

  const handleSaveFavorite = () => {
    const customizations = {
      size: selectedSize,
      milk: selectedMilk,
      notes
    };

    onSaveFavorite(item, customizations, calculateTotalPrice() / quantity);
    favorites = favorites
    alert('Added to favorites!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md h-[90vh] rounded-2xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom duration-300 ease-out flex flex-col">
        {/* Header Image */}
        <div className="relative h-64 bg-gray-200 overflow-hidden shrink-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url('${item.image}')` }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>

          {/* Favorite button */}
          <button
            onClick={handleSaveFavorite}
            className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
          >
            <Heart className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Header Info */}
              <div>
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-2xl font-bold text-gray-900">{item.name}</h2>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      Rp {item.sizePricing.Regular.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Base price (Regular)</div>
                  </div>
                </div>

                {/* Recommended Badge */}
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-linear-to-r from-orange-100 to-amber-100 border border-amber-200 mb-3">
                  <svg className="w-4 h-4 mr-2 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium text-amber-700">Recommended</span>
                </div>

                {/* Description */}
                <p className="text-gray-600 leading-relaxed">
                  {item.description} - A carefully crafted beverage made with premium ingredients and expertly balanced flavors.
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-200" />

              {/* Size Selection */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Size</h3>
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 text-sm font-medium rounded-full">Pick 1</span>
                </div>
                <div className="space-y-3">
                  {sizeOptions.map((size) => (
                    <label 
                      key={size.name} 
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedSize === size.name 
                          ? 'border-amber-500 bg-amber-50' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <input
                          type="radio"
                          name="size"
                          value={size.name}
                          checked={selectedSize === size.name}
                          onChange={(e) => setSelectedSize(e.target.value)}
                          className="w-5 h-5 text-amber-600 border-gray-300 focus:ring-amber-500"
                        />
                        <div>
                          <span className="font-medium text-gray-900">{size.name}</span>
                          <div className="text-sm text-gray-500">Perfect for {size.name.toLowerCase()} appetite</div>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-900">
                        Rp {size.price.toLocaleString()}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-200" />

              {/* Milk Selection */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Milk</h3>
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 text-sm font-medium rounded-full">Pick 1</span>
                </div>
                <div className="space-y-3">
                  {milkOptions.map((milk) => (
                    <label 
                      key={milk.name} 
                      className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedMilk === milk.name 
                          ? 'border-amber-500 bg-amber-50' 
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <input
                          type="radio"
                          name="milk"
                          value={milk.name}
                          checked={selectedMilk === milk.name}
                          onChange={(e) => setSelectedMilk(e.target.value)}
                          className="w-5 h-5 text-amber-600 border-gray-300 focus:ring-amber-500"
                        />
                        <div>
                          <span className="font-medium text-gray-900">{milk.name}</span>
                          <div className="text-sm text-gray-500">
                            {milk.name === 'Regular Milk' && 'Classic dairy milk'}
                            {milk.name === 'Less Milk' && 'Lighter dairy content'}
                            {milk.name === 'Oat Milk' && 'Plant-based alternative'}
                          </div>
                        </div>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {milk.price > 0 ? `+Rp ${milk.price.toLocaleString()}` : 'Free'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-200" />

              {/* Notes */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">Special Instructions</h3>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">Optional</span>
                </div>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Extra hot, less sweet, no foam..."
                  className="w-full p-4 border-2 border-gray-200 rounded-xl resize-none h-28 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-center space-x-8 pb-6">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center hover:bg-gray-200 transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-5 h-5 text-gray-600" />
                </button>
                <span className="text-2xl font-bold text-gray-900 w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center hover:bg-amber-700 transition-colors"
                >
                  <Plus className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="border-t border-gray-200 p-6 bg-gray-50 shrink-0">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-amber-600">
                Rp {calculateTotalPrice().toLocaleString()}
              </span>
            </div>
            <button
              onClick={handleAddToCart}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-xl font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
            >
              Add {quantity} to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}