// src/App.tsx
import { useState, useEffect } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { Button } from './components/ui/button';
// import FadeContent from './components/ui/FadeContent'

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

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showAddedNotification, setShowAddedNotification] = useState(false);
  const [addedItem, setAddedItem] = useState<CartItem | null>(null);
  const [showMenuDetail, setShowMenuDetail] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Coffee");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showNavDrawer, setShowNavDrawer] = useState(false);

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

  const saveFavorite = (item: MenuItem, customizations: any, totalPrice: number) => {
    const favorite: FavoriteItem = {
      id: Date.now().toString(),
      menuItemId: item.id,
      name: `${item.name} (${customizations.size})`,
      customizations,
      totalPrice,
      savedAt: new Date()
    };

    const updatedFavorites = [...favorites, favorite];
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

  const handleShowMenuDetail = (item: MenuItem) => {
    setSelectedMenuItem(item);
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
    
    setCart([]);
    setShowCart(false);
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

  // const handleShowNotifications = ().
  const handleShowNotifications = () => {
    setShowNotifications(true);
    setShowNavDrawer(false);
  };

  const resetToMainMenu = () => {
    setShowOrderHistory(false);
    setShowSettings(false);
    setShowNotifications(false);
    setShowCart(false);
  };

  if (showSettings) {
    // return <SettingsPage onBack={resetToMainMenu} />;
  }

  if (showNotifications) {
    return <NotificationsPage onBack={resetToMainMenu} />;
  }

  if (showOrderHistory) {
    return (
      <OrderHistory
        orders={orders}
        onBack={resetToMainMenu}
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
    );
  }

  if (showCart) {
    return (
      <Cart
        items={cart}
        onUpdateQuantity={updateCartItemQuantity}
        onRemoveItem={removeFromCart}
        onBack={() => setShowCart(false)}
        onOrderComplete={handleOrderComplete}
        total={cartTotal}
      />
    );
  }

  return (
    <div className="relative size-full bg-white overflow-hidden">
      <div className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${
        showNavDrawer ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div 
          // The `transition-opacity` class tells the browser to animate any changes to opacity
          className={`absolute inset-0 ${
            // When `showNavDrawer` is true, we set the opacity. When false, we make it invisible.
            showNavDrawer ? ' bg-black opacity-50 transition-opacity delay-300 duration-700 ease-out' : 'opacity-0 pointer-events-none'
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

      {showMenuDetail && selectedMenuItem && (
        <MenuDetailOverlay
          item={selectedMenuItem}
          onClose={() => setShowMenuDetail(false)}
          onAddToCart={addToCart}
          onSaveFavorite={saveFavorite}
          favorites={favorites}
        />
      )}

      <div className="h-12 bg-white" />

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
          <div className="w-8 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCart(true)}
              className="relative rounded-full border-2 border-[#84482b] hover:bg-[#84482b] hover:text-white transition-all duration-200"
            >
              <ShoppingCart className="h-4 w-4" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="py-6 space-y-6">
            <SearchSection 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
            
            {favorites.length > 0 && (
              <FavoritesSection 
                favorites={favorites}
                menuItems={menuItems}
                onReorder={(favorite) => {
                  const menuItem = menuItems.find(item => item.id === favorite.menuItemId);
                  if (menuItem) {
                    addToCart(menuItem, 1, favorite.customizations);
                  }
                }}
              />
            )}
            
            <div className="px-5 space-y-4 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <MenuItemComponent
                  key={item.id}
                  item={item}
                  onShowDetail={handleShowMenuDetail}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

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
    </div>
  );
}