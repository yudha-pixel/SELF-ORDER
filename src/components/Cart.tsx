import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import imgLogo from '@/assets/LogoVector.svg';

interface CartItem {
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
    toppings?: string[];
    notes: string;
  };
}

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number, customizations?: any) => void;
  onRemoveItem: (itemId: string, customizations?: any) => void;
  onBack: () => void;
  onOrderComplete: () => void;
  total: number;
}

export default function Cart({ items, onUpdateQuantity, onRemoveItem, onBack, onOrderComplete, total }: CartProps) {
  const handlePlaceOrder = () => {
    const orderConfirmation = window.confirm(
      `Place order for Rp ${total.toLocaleString()}?\n\nThis will add the order to your history and clear your cart.`
    );
    
    if (orderConfirmation) {
      onOrderComplete();
      alert('Order placed successfully! You can track it in "My Orders".');
    }
  };

  return (
    <div className="relative size-full bg-white">
      <div className="h-12 bg-white" />
      
      {/* Header */}
      <div className="bg-white h-16 overflow-clip relative shrink-0 w-full">
        <div className="flex flex-row items-center relative size-full px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-black hover:bg-white/20 p-2"
          >
            <X className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 flex justify-center">
            <h1 className="text-xl font-bold text-black">Order Confirmation</h1>
          </div>
          
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13h10M9 19v.01M20 19v.01" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Add some delicious coffee to get started!</p>
            <Button onClick={onBack} className="bg-[#84482b] hover:bg-[#6d3a23] text-white">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={`${item.id}-${index}-${JSON.stringify(item.customizations)}`} className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm">
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url('${item.image}')` }}
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-base">{item.name}</h3>
                        {item.customizations && (
                          <div className="mt-1 space-y-1">
                            <p className="text-sm text-gray-600">
                              Size: {item.customizations.size} • {item.customizations.milk}
                            </p>
                            {item.customizations.notes && (
                              <p className="text-xs text-gray-500">
                                Note: {item.customizations.notes}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveItem(item.id, item.customizations)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 h-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="font-bold text-lg text-gray-900">
                        Rp {item.price.toLocaleString()}
                      </div>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1, item.customizations)}
                          className="h-8 w-8 p-0 border-[#84482b] text-[#84482b] hover:bg-[#84482b] hover:text-white rounded-full"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <span className="w-8 text-center font-semibold text-gray-900">
                          {item.quantity}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1, item.customizations)}
                          className="h-8 w-8 p-0 border-[#84482b] text-[#84482b] hover:bg-[#84482b] hover:text-white rounded-full"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Subtotal */}
                    <div className="text-right mt-2">
                      <span className="text-sm font-medium text-gray-600">
                        Subtotal: Rp {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer with Total and Checkout */}
      {items.length > 0 && (
        <div className="border-t border-gray-200 p-5 bg-white">
          <div className="space-y-4">
            {/* Order Summary */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">Rp {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Service Fee</span>
                <span className="font-medium text-gray-900">Rp 2,000</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-[#84482b]">
                    Rp {(total + 2000).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <Button 
              className="w-full bg-[#84482b] hover:bg-[#6d3a23] text-white py-4 text-lg font-semibold rounded-xl"
              onClick={handlePlaceOrder}
            >
              Place Order - Rp {(total + 2000).toLocaleString()}
            </Button>
            
            <div className="text-center">
              <Button
                variant="ghost"
                onClick={onBack}
                className="text-[#84482b] hover:bg-[#84482b]/10 font-medium"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Powered By Footer */}
      <div className="bg-[#000000] p-4">
        <div className="flex flex-row items-center justify-center gap-[5px]">
          <div className="font-['Poppins:Medium',sans-serif] font-medium leading-[0] not-italic text-[#ffffff] text-[12px] text-right tracking-[-0.06px]">
            <p className="block leading-[1.35]">Powered By </p>
          </div>
          <div
            className="aspect-960/320 bg-center bg-cover bg-no-repeat h-4 shrink-0"
            style={{ backgroundImage: `url('${imgLogo}')` }}
          />
        </div>
      </div>
    </div>
  );
}