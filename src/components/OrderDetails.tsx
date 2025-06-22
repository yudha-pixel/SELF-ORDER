import { ArrowLeft, Clock, CheckCircle, Coffee, MapPin, Phone, RotateCcw, Star } from 'lucide-react';
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
}

interface OrderDetailProps {
  order: Order;
  onBack: () => void;
  onReorder: (orderItems: CartItem[]) => void;
}

export default function OrderDetail({ order, onBack, onReorder }: OrderDetailProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'preparing':
        return <Clock className="w-6 h-6 text-orange-500" />;
      case 'ready':
        return <Coffee className="w-6 h-6 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      default:
        return <Clock className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'preparing':
        return 'Order is being prepared';
      case 'ready':
        return 'Ready for pickup';
      case 'completed':
        return 'Order completed';
      default:
        return 'Unknown status';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'ready':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDateTime = (date: Date) => {
    const orderDate = new Date(date);
    return {
      date: orderDate.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric',
        month: 'long', 
        day: 'numeric'
      }),
      time: orderDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const { date, time } = formatDateTime(order.orderDate);
  const totalItems = order.items.reduce((total, item) => total + item.quantity, 0);

  const handleReorder = () => {
    onReorder(order.items);
    onBack(); // Go back to main menu after reordering
  };

  const handleRateOrder = () => {
    alert('Rating feature coming soon!');
  };

  const handleGetSupport = () => {
    alert('Support feature coming soon! You can contact us at support@coffeeshop.com');
  };

  return (
    <div className="relative size-full bg-white">
      {/* Header */}
      <div className="bg-[#167dda] h-16 overflow-clip relative shrink-0 w-full">
        <div className="flex flex-row items-center relative size-full px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="text-white hover:bg-white/20 p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 flex justify-center">
            <h1 className="text-xl font-bold text-white">Order Details</h1>
          </div>
          
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-5 space-y-6">
          {/* Order Status Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Order #{order.id.slice(-6)}</h2>
                <p className="text-sm text-gray-500">{date}</p>
                <p className="text-sm text-gray-500">{time}</p>
              </div>
              <div className="text-center">
                {getStatusIcon(order.status)}
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border mt-2 ${getStatusColor(order.status)}`}>
                  {getStatusText(order.status)}
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    ['preparing', 'ready', 'completed'].includes(order.status) 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-gray-600 mt-1">Confirmed</span>
                </div>
                
                <div className={`flex-1 h-1 mx-2 ${
                  ['ready', 'completed'].includes(order.status) ? 'bg-green-500' : 'bg-gray-200'
                }`} />
                
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    ['ready', 'completed'].includes(order.status) 
                      ? 'bg-green-500 text-white' 
                      : order.status === 'preparing'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    <Coffee className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-gray-600 mt-1">Preparing</span>
                </div>
                
                <div className={`flex-1 h-1 mx-2 ${
                  order.status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                }`} />
                
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    order.status === 'completed' 
                      ? 'bg-green-500 text-white' 
                      : order.status === 'ready'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}>
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <span className="text-xs text-gray-600 mt-1">Ready</span>
                </div>
              </div>
            </div>

            {/* Pickup Information */}
            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center space-x-3 mb-3">
                <MapPin className="w-5 h-5 text-gray-600" />
                <div>
                  <h4 className="font-medium text-gray-900">Pickup Location</h4>
                  <p className="text-sm text-gray-600">Downtown Coffee Shop</p>
                  <p className="text-sm text-gray-500">123 Main Street, City Center</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-600" />
                <div>
                  <h4 className="font-medium text-gray-900">Contact</h4>
                  <p className="text-sm text-gray-600">(555) 123-4567</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#84482b]">{totalItems}</div>
                <div className="text-sm text-gray-500">Items</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#84482b]">Rp {order.total.toLocaleString()}</div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#84482b]">
                  {order.status === 'preparing' ? '15-20' : order.status === 'ready' ? '0' : '✓'}
                </div>
                <div className="text-sm text-gray-500">
                  {order.status === 'preparing' ? 'Minutes' : order.status === 'ready' ? 'Ready Now' : 'Completed'}
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Items Ordered</h3>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={`${item.id}-${index}`} className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                  {/* Image */}
                  <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url('${item.image}')` }}
                    />
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <div className="text-right">
                        <div className="font-bold text-gray-900">×{item.quantity}</div>
                        <div className="text-sm text-gray-500">Rp {(item.price * item.quantity).toLocaleString()}</div>
                      </div>
                    </div>
                    
                    {item.customizations && (
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-700">Size:</span>
                          <span className="text-sm text-gray-600">{item.customizations.size}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-700">Milk:</span>
                          <span className="text-sm text-gray-600">{item.customizations.milk}</span>
                        </div>
                        {item.customizations.notes && (
                          <div className="flex items-start space-x-2">
                            <span className="text-sm font-medium text-gray-700">Notes:</span>
                            <span className="text-sm text-gray-600">{item.customizations.notes}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">Rp {(order.total - 2000).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service Fee</span>
                <span className="font-medium text-gray-900">Rp 2,000</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium text-gray-900">Rp 0</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900">Total Paid</span>
                  <span className="text-xl font-bold text-[#84482b]">Rp {order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleReorder}
              className="w-full bg-[#84482b] hover:bg-[#6d3a23] text-white py-4 text-lg font-semibold rounded-xl"
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reorder This Order
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              {order.status === 'completed' && (
                <Button
                  variant="outline"
                  onClick={handleRateOrder}
                  className="border-amber-200 text-amber-700 hover:bg-amber-50 rounded-xl"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Rate Order
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={handleGetSupport}
                className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl"
              >
                Get Support
              </Button>
            </div>
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