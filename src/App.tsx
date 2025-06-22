import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { Button } from './components/ui/button';

import { MenuItem, CartItem, FavoriteItem, Order } from './types';
import { menuItems } from './data/menuItems';

import Cart from './components/Cart';
import MenuDetailOverlay from './components/MenuDetailOverlay';
import OrderHistory from './components/OrderHistory';
import NotificationsPage from './components/Notifications';
import NavigationDrawer from './components/NavigationDrawer';
import AnimatedHamburgerIcon from './components/AnimatedHamburgerIcon';
import Logo from './components/Logo';
import SearchSection from './components/SearchSection';
import FavoritesSection from './components/FavoritesSection';
import MenuItemComponent from './components/MenuItemComponent';
import CartSummaryOverlay from './components/CartSummaryOverlay';
import PaymentMethodOverlay from './components/PaymentMethodOverlay';
import SettingsPage from './components/Settings';
import PaymentSuccess from './components/PaymentSuccess';
import OrderDetail from './components/OrderDetails';


export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showAddedNotification, setShowAddedNotification] = useState(false);
  const [addedItem, setAddedItem] = useState<CartItem | null>(null);
  const [showMenuDetail, setShowMenuDetail] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [initialCustomizations, setInitialCustomizations] = useState<FavoriteItem['customizations'] | null>(null);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Coffee");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showNavDrawer, setShowNavDrawer] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [showPaymentOverlay, setShowPaymentOverlay] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('coffee-favorites');
    const savedOrders = localStorage.getItem('coffee-orders');
    
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

const toggleFavorite = (item: MenuItem, customizations: any, totalPrice: number) => {
    const existingIndex = favorites.findIndex(fav => fav.menuItemId === item.id);

    let updatedFavorites;

    if (existingIndex >= 0) {
      // Item is already a favorite, so REMOVE it
      updatedFavorites = favorites.filter((_, index) => index !== existingIndex);
    } else {
      // Item is not a favorite, so ADD it
      const favorite: FavoriteItem = {
        id: Date.now().toString(),
        menuItemId: item.id,
        name: `${item.name} (${customizations.size})`,
        customizations,
        totalPrice,
        savedAt: new Date()
      };
      updatedFavorites = [...favorites, favorite];
    }
    
    setFavorites(updatedFavorites);
    localStorage.setItem('coffee-favorites', JSON.stringify(updatedFavorites));
  };

  const addToCart = (item: MenuItem, quantity: number = 1, customizations?: any) => {
    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.basePrice,
      image: item.image,
      category: item.category,
      quantity,
      customizations
    };

    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => 
        cartItem.id === item.id && 
        JSON.stringify(cartItem.customizations) === JSON.stringify(customizations)
      );
      
      if (existingItemIndex >= 0) {
        return prevCart.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      } else {
        return [...prevCart, cartItem];
      }
    });

    setAddedItem(cartItem);
    setShowAddedNotification(true);
    setTimeout(() => {
      setShowAddedNotification(false);
      setAddedItem(null);
    }, 2000);
  };

  const removeFromCart = (itemId: string, customizations?: any) => {
    setCart(prevCart => prevCart.filter(item => 
      !(item.id === itemId && JSON.stringify(item.customizations) === JSON.stringify(customizations))
    ));
  };

  const updateCartItemQuantity = (itemId: string, quantity: number, customizations?: any) => {
    if (quantity === 0) {
      removeFromCart(itemId, customizations);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId && JSON.stringify(item.customizations) === JSON.stringify(customizations)
          ? { ...item, quantity } 
          : item
      )
    );
  };

  const handleShowMenuDetail = (item: MenuItem, customizations: FavoriteItem['customizations'] | null = null) => {
    setSelectedMenuItem(item);
    setInitialCustomizations(customizations); // Set the customizations to be passed to the overlay
    setShowMenuDetail(true);
  };

  const handleOrderComplete = () => {
    if (cart.length === 0) return;

    const order: Order = {
      id: Date.now().toString(),
      items: [...cart],
      total: cartTotal,
      orderDate: new Date(),
      status: 'preparing'
    };

    const updatedOrders = [order, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('coffee-orders', JSON.stringify(updatedOrders));
    
    setCompletedOrder(order);
    setCart([]);
    setShowCart(false);
    setShowPaymentSuccess(true);
  };

  const filteredItems = menuItems.filter(item => {
    const matchesCategory = item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowNavDrawer(false);
        setShowMenuDetail(false);
      }
    };

    if (showNavDrawer || showMenuDetail) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [showNavDrawer, showMenuDetail]);

  const handleShowOrderHistory = () => {
    setShowOrderHistory(true);
    setShowNavDrawer(false);
  };

  const handleShowSettings = () => {
    setShowSettings(true);
    setShowNavDrawer(false);
  };

  const handleShowNotifications = () => {
    setShowNotifications(true);
    setShowNavDrawer(false);
  };

  const handleShowOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const handlePaymentSuccessViewOrder = () => {
    if (completedOrder) {
      setShowPaymentSuccess(false);
      setSelectedOrder(completedOrder);
      setShowOrderDetail(true);
    }
  };

  const resetToMainMenu = () => {
    setShowOrderHistory(false);
    setShowSettings(false);
    setShowNotifications(false);
    setShowCart(false);
    setShowPaymentSuccess(false);
    setShowOrderDetail(false);
  };

  return (
    <div className="relative size-full bg-white overflow-hidden">
      
      {/* =================================== */}
      {/* 1. MAIN APP UI (Always in the background) */}
      {/* =================================== */}
      <div className="h-12 bg-white" />

      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm relative">
        <div className="flex items-center px-5 py-4 justify-between">
          <div className="w-8 flex justify-start">
            <button 
              onClick={() => setShowNavDrawer(true)}
              className="relative w-8 h-8 rounded-lg transition-colors duration-200 hover:bg-gray-100 flex items-center justify-center"
            >
              <AnimatedHamburgerIcon isOpen={showNavDrawer} />
            </button>
          </div>
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <Logo />
          </div>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="py-6 space-y-6">
            <SearchSection 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            {favorites.length > 0 && (<FavoritesSection 
                favorites={favorites}
                menuItems={menuItems}
                onReorder={(favorite) => {
                  const menuItem = menuItems.find(item => item.id === favorite.menuItemId);
                  if (menuItem) {
                    handleShowMenuDetail(menuItem, favorite.customizations);
                  }
                }}
              />)
            }
            <div className="px-5 space-y-4 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <MenuItemComponent
                  key={item.id}
                  item={item}
                  onShowDetail={handleShowMenuDetail}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================================================= */}
      {/* 2. OVERLAYS AND FULL-SCREEN VIEWS (Render on top) */}
      {/* ================================================= */}

      {/* Navigation Drawer */}
      <div className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${
        showNavDrawer ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div 
          // The `transition-opacity` class tells the browser to animate any changes to opacity
          className={`absolute inset-0 ${
            // When `showNavDrawer` is true, we set the opacity. When false, we make it invisible.
            showNavDrawer ? ' bg-black/50 transition-opacity delay-300 duration-700 ease-out' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setShowNavDrawer(false)}
        />
        
        <div className={`absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-linear-to-b from-[#167dda] to-[#104779] shadow-2xl transform transition-transform duration-300 ease-in-out ${
          showNavDrawer ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <NavigationDrawer 
            onClose={() => setShowNavDrawer(false)}
            onShowOrderHistory={handleShowOrderHistory}
            onShowSettings={handleShowSettings}
            onShowNotifications={handleShowNotifications}
          />
        </div>
      </div>

      {/* Menu Detail Overlay */}
      {showMenuDetail && selectedMenuItem && (
        <MenuDetailOverlay 
          item={selectedMenuItem}
          onClose={() => {
            setShowMenuDetail(false);
            setInitialCustomizations(null);
          }}
          onAddToCart={addToCart}
          onToggleFavorite={toggleFavorite}
          favorites={favorites}
          initialCustomizations={initialCustomizations}
        />
      )}
      
      {/* Cart Screen (Now treated as a full-screen overlay) */}
      {showCart && (
        <div className="fixed inset-0 z-40 bg-white">
          <Cart
            items={cart}
            onUpdateQuantity={updateCartItemQuantity}
            onRemoveItem={removeFromCart}
            onBack={() => setShowCart(false)}
            onOrderComplete={handleOrderComplete}
            total={cartTotal}
            paymentMethod={paymentMethod}
            onShowPaymentOverlay={() => setShowPaymentOverlay(true)}
          />
        </div>
      )}

      {/* Order History Screen */}
      {showOrderHistory && (
        <div className="fixed inset-0 z-40 bg-white">
          <OrderHistory
            orders={orders}
            onBack={resetToMainMenu}
            // onOrderClick={handleShowOrderDetail}
            onReorder={(orderItems) => {
              orderItems.forEach(item => {
                const menuItem = menuItems.find(mi => mi.id === item.id);
                if (menuItem) {
                  addToCart(menuItem, item.quantity, item.customizations);
                }
              });
              setShowOrderHistory(false);
            }}
          />
        </div>
      )}
      
      {/* Notifications Screen */}
      {showNotifications && (
        <div className="fixed inset-0 z-40 bg-white">
          <NotificationsPage onBack={resetToMainMenu} />
        </div>
      )}

      {/* Setting Screen */}
      {showSettings && (
        <div className="fixed inset-0 z-40 bg-white">
          <SettingsPage
            onBack={resetToMainMenu}
          />
        </div>
      )}

      {/* Success Payment */}
      {showPaymentSuccess && completedOrder && (
        <div className="fixed inset-0 z-40 bg-white">
          <PaymentSuccess
            order={completedOrder}
            onContinue={resetToMainMenu}
            onViewOrder={handlePaymentSuccessViewOrder}
          />
        </div>
      )}


      {/* Payment Method Overlay (Highest z-index) */}
      {showPaymentOverlay && (
        <PaymentMethodOverlay
          currentMethod={paymentMethod}
          onClose={() => setShowPaymentOverlay(false)}
          onSelect={(method) => {
            setPaymentMethod(method);
            setShowPaymentOverlay(false);
          }}
        />
      )}

      {/* Cart Summary & Added Item Notifications */}
      {showAddedNotification && addedItem && (
        <div className={`fixed bottom-0 left-0 right-0 z-40 transform transition-all duration-300 ease-in-out ${
          showAddedNotification ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}>
          <div className="bg-white mx-4 mb-4 rounded-2xl shadow-xl border border-gray-100 p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{addedItem.name} added to cart</p>
                <p className="text-sm text-gray-500">Rp {addedItem.price.toLocaleString()}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCart(true)}
                className="rounded-full border-[#84482b] text-[#84482b] hover:bg-[#84482b] hover:text-white"
              >
                View Cart
              </Button>
            </div>
          </div>
        </div>
      )}

      {cart.length > 0 && !showCart && (
        <CartSummaryOverlay
          itemCount={cartItemsCount}
          totalPrice={cartTotal}
          onContinue={() => setShowCart(true)}
        />
      )}
    </div>
  );
}