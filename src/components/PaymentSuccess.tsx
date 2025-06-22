import { CheckCircle, Coffee, MapPin, Clock, Receipt, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import LogoWhite from "../assets/LogoWhite.png";

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

interface Order {
  id: string;
  items: CartItem[];
  total: number;
  orderDate: Date;
  status: 'completed' | 'preparing' | 'ready';
  paymentMethod?: string;
  transactionId?: string;
}

interface PaymentSuccessProps {
  order: Order;
  onContinue: () => void;
  onViewOrder: () => void;
}

export default function PaymentSuccess({ order, onContinue, onViewOrder }: PaymentSuccessProps) {
  const formatDateTime = (date: Date) => {
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const { date, time } = formatDateTime(order.orderDate);
  const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const estimatedTime = 15; // minutes

  return (
    <div className="relative size-full bg-white">
      {/* Success Header */}
      <div className="bg-gradient-to-b from-green-500 to-green-600 pt-16 pb-8">
        <div className="text-center text-white px-5">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-green-100">Your order has been confirmed</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto -mt-4">
        <div className="bg-white rounded-t-3xl min-h-full p-6 space-y-6">
          {/* Order Information */}
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Order #{order.id.slice(-6)}</h2>
            <p className="text-gray-600">{date}</p>
            <p className="text-gray-600">{time}</p>
          </div>

          {/* Status Card */}
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                <Coffee className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-orange-900">Order is being prepared</h3>
                <p className="text-sm text-orange-700">Estimated time: {estimatedTime} minutes</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Pickup Location</p>
                    <p className="text-sm text-gray-600">Downtown Coffee Shop</p>
                    <p className="text-xs text-gray-500">123 Main Street, City Center</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-orange-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">{estimatedTime} min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Receipt className="w-5 h-5 mr-2" />
              Payment Details
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID</span>
                <span className="font-mono text-sm text-gray-900">{order.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method</span>
                <span className="text-gray-900">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid</span>
                <span className="font-semibold text-green-600">Rp {order.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-gray-600">Status</span>
                <span className="text-green-600 font-medium">✓ Paid</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items ({totalItems})</h3>
            
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url('${item.image}')` }}
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900">{item.name}</h4>
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
                    <div className="mt-2 flex justify-between items-center">
                      <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                      <span className="font-semibold text-gray-900">
                        Rp {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">What's Next?</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</div>
                <div>
                  <p className="font-medium text-blue-900">We're preparing your order</p>
                  <p className="text-sm text-blue-700">Our baristas are crafting your perfect drink</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</div>
                <div>
                  <p className="font-medium text-blue-900">You'll get notified</p>
                  <p className="text-sm text-blue-700">We'll send you a notification when it's ready</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</div>
                <div>
                  <p className="font-medium text-blue-900">Come and collect</p>
                  <p className="text-sm text-blue-700">Show this order confirmation at pickup</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              onClick={onViewOrder}
              className="w-full bg-[#84482b] hover:bg-[#6d3a23] text-white py-4 text-lg font-semibold rounded-xl"
            >
              View Order Details
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button
              variant="outline"
              onClick={onContinue}
              className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 py-4 text-lg font-semibold rounded-xl"
            >
              Continue Shopping
            </Button>
          </div>

          {/* Support */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-600 mb-2">Need help with your order?</p>
            <Button
              variant="ghost"
              onClick={() => alert('Support feature coming soon!')}
              className="text-[#84482b] hover:bg-[#84482b]/10"
            >
              Contact Support
            </Button>
          </div>
        </div>
      </div>

      {/* Powered By Footer */}
      <div className="bg-[#000000] p-4">
        <div className="flex flex-row items-center justify-center gap-[5px]">
          <div className="font-['Poppins:Medium',_sans-serif] font-medium leading-[0] not-italic text-[#ffffff] text-[12px] text-right tracking-[-0.06px]">
            <p className="block leading-[1.35]">Powered By </p>
          </div>
          <div
            className="aspect-[960/320] bg-center bg-cover bg-no-repeat h-4 shrink-0"
            style={{ backgroundImage: `url('${LogoWhite}')` }}
          />
        </div>
      </div>
    </div>
  );
}