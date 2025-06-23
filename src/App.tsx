import { useState, useEffect, useCallback } from "react";
import svgPaths from "./imports/svg-zotrlrl93e";
import LogoWhite from "./assets/LogoWhite.png";
import LogoVector from "./assets/LogoVector.svg";

import {
  Check,
  User,
  Settings,
  Heart,
  Bell,
  History,
  LogOut,
  MessageCircle,
  FileText,
  Shield,
  HelpCircle,
  Minus,
  Plus,
  Star,
  Clock,
  TrendingUp,
  RefreshCw,
  Wifi,
  WifiOff,
  AlertTriangle,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Skeleton } from "./components/ui/skeleton";
import { Alert, AlertDescription } from "./components/ui/alert";
import Cart from "./components/Cart";
import PaymentSuccess from "./components/PaymentSuccess";
import MenuDetailOverlay from "./components/MenuDetailOverlay";
import OrderHistory from "./components/OrderHistory";
import OrderDetail from "./components/OrderDetail";
import SettingsPage from "./components/Settings";
import NotificationsPage from "./components/Notifications";
import Login from "./components/Login.tsx";
import Register from "./components/Register";
import Favorites from "./components/Favorites";
import FloatingCartCard from "./components/FloatingCartCard";
import ContactSupport from "./components/ContactSupport";
import DeveloperFeedback from "./components/DeveloperFeedback";
import TermsConditions from "./components/TermsConditions";
import PrivacyPolicy from "./components/PrivacyPolicy";
import LazyImage from "./components/LazyImage";

// Data Imports
import { menuItems } from "./data/menuItems";
import { availableVouchers } from "./data/vouchers";
import { categories } from "./data/categories";

// Type Imports
import {
  ProductProduct,
  CartItem,
  FavoriteItem,
  OrderItem,
  OrderHistoryItem,
  UserUser,
  Voucher,
  Notification,
} from "./types";

type LoadingState = "loading" | "success" | "error" | "timeout" | "offline";

// Timeout duration for data loading
const LOADING_TIMEOUT = 10000; // 10 seconds

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<OrderHistoryItem | null>(null);
  const [showNavDrawer, setShowNavDrawer] = useState(false);
  const [showAddedNotification, setShowAddedNotification] = useState(false);
  const [addedItem, setAddedItem] = useState<CartItem | null>(null);
  const [showComboNotification, setShowComboNotification] = useState(false);
  const [comboAddedItem, setComboAddedItem] = useState<ProductProduct | null>(null);
  const [showMenuDetail, setShowMenuDetail] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<ProductProduct | null>(
    null
  );
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [showOrderDetail, setShowOrderDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showContactSupport, setShowContactSupport] = useState(false);
  const [showDeveloperFeedback, setShowDeveloperFeedback] = useState(false);
  const [showTermsConditions, setShowTermsConditions] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [user, setUser] = useState<UserUser | null>(null);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackOrder, setFeedbackOrder] = useState<OrderHistoryItem | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loadingState, setLoadingState] = useState<LoadingState>("loading");
  const [retryCount, setRetryCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [criticalDataLoaded, setCriticalDataLoaded] = useState(false);

  // Check online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (loadingState === 'offline') {
        handleRetry();
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
      setLoadingState('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [loadingState]);

  // Register Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    }
  }, []);

  // Enhanced data loading with error handling and timeout
  const loadData = useCallback(async (attempt: number = 1): Promise<void> => {
    try {
      setLoadingState('loading');
      
      // Check if we're offline
      if (!navigator.onLine) {
        setLoadingState('offline');
        return;
      }

      // Create a timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('timeout')), LOADING_TIMEOUT);
      });

      // Simulate critical data loading first (header, navigation)
      const criticalDataPromise = new Promise<void>((resolve) => {
        setTimeout(() => {
          setCriticalDataLoaded(true);
          resolve();
        }, 500);
      });

      // Load critical data first
      await Promise.race([criticalDataPromise, timeoutPromise]);

      // Then load the rest of the data
      const dataLoadingPromise = new Promise<void>((resolve) => {
        setTimeout(() => {
          const savedFavorites = localStorage.getItem('coffee-favorites');
          const savedOrders = localStorage.getItem('coffee-orders');
          const savedUser = localStorage.getItem('coffee-user');
          const savedNotifications = localStorage.getItem('coffee-notifications');
          const savedDarkMode = localStorage.getItem('coffee-dark-mode');
          
          if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
          }
          
          if (savedOrders) {
            setOrders(JSON.parse(savedOrders));
          }
          
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }

          if (savedNotifications) {
            setNotifications(JSON.parse(savedNotifications));
          }

          if (savedDarkMode) {
            const darkMode = JSON.parse(savedDarkMode);
            setIsDarkMode(darkMode);
            document.documentElement.classList.toggle('dark', darkMode);
          }
          
          resolve();
        }, attempt === 1 ? 1000 : 2000); // Faster retry for subsequent attempts
      });

      await Promise.race([dataLoadingPromise, timeoutPromise]);
      setLoadingState('success');
      setRetryCount(0);
      
    } catch (error) {
      console.error('Loading error:', error);
      
      if (error instanceof Error && error.message === 'timeout') {
        setLoadingState('timeout');
      } else if (!navigator.onLine) {
        setLoadingState('offline');
      } else {
        setLoadingState('error');
      }
    }
  }, []);

  // Handle retry
  const handleRetry = useCallback(() => {
    const newRetryCount = retryCount + 1;
    setRetryCount(newRetryCount);
    loadData(newRetryCount);
  }, [retryCount, loadData]);

  // Initial data load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Add notification function
  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      isRead: false
    };

    const updatedNotifications = [newNotification, ...notifications];
    setNotifications(updatedNotifications);
    localStorage.setItem('coffee-notifications', JSON.stringify(updatedNotifications));
  };

  // Add offline notification when connection is restored
  useEffect(() => {
    if (isOnline && loadingState === 'success') {
      // Add notification when connection is restored
      const offlineNotifications = notifications.filter(n => n.type === 'warning' && n.message.includes('offline'));
      if (offlineNotifications.length === 0) {
        addNotification({
          title: 'Connection Restored',
          message: 'You\'re back online! All features are now available.',
          type: 'success'
        });
      }
    }
  }, [isOnline, loadingState]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    localStorage.setItem('coffee-dark-mode', JSON.stringify(newDarkMode));
  };

  // Check for completed orders that need feedback
  // useEffect(() => {
  //   const completedOrders = orders.filter(order => 
  //     order.status === 'completed' && !order.feedbackGiven
  //   );
    
  //   if (completedOrders.length > 0 && !showFeedbackModal) {
  //     // Show feedback for the most recent completed order
  //     setFeedbackOrder(completedOrders[0]);
  //     setShowFeedbackModal(true);
  //   }
  // }, [orders, showFeedbackModal]);

  // Save favorites to localStorage
  const saveFavorite = (item: ProductProduct, customizations: any, totalPrice: number) => {
    const favorite: FavoriteItem = {
      id: Date.now().toString(),
      menuItemId: item.id,
      name: `${item.name} (${customizations.size || 'Regular'})`,
      customizations,
      totalPrice,
      savedAt: new Date()
    };

    const updatedFavorites = [...favorites, favorite];
    setFavorites(updatedFavorites);
    localStorage.setItem('coffee-favorites', JSON.stringify(updatedFavorites));
  };

  // Remove favorite
  const removeFavorite = (favoriteId: string) => {
    const updatedFavorites = favorites.filter(fav => fav.id !== favoriteId);
    setFavorites(updatedFavorites);
    localStorage.setItem('coffee-favorites', JSON.stringify(updatedFavorites));
  };

  // Check if item is favorited
  const isItemFavorited = (itemId: string, customizations?: any) => {
    return favorites.some(fav => 
      fav.menuItemId === itemId && 
      JSON.stringify(fav.customizations) === JSON.stringify(customizations)
    );
  };

  // Handle login with notification
  // const handleLogin = (email: string, password: string) => {
  const handleLogin = (email: string) => {
    const userData: UserUser = {
      id: Date.now().toString(),
      name: email.split('@')[0],
      email,
      phone: '+1234567890'
    };
    
    setUser(userData);
    localStorage.setItem('coffee-user', JSON.stringify(userData));
    setShowLogin(false);

    // Add welcome notification
    addNotification({
      title: 'Welcome Back!',
      message: `Hi ${userData.name}, you've successfully signed in to your account.`,
      type: 'success'
    });
  };

  // Handle register with notification
  const handleRegister = (userData: {name: string; email: string; phone: string; password: string}) => {
    const newUser: UserUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      phone: userData.phone
    };
    
    setUser(newUser);
    localStorage.setItem('coffee-user', JSON.stringify(newUser));
    setShowRegister(false);

    // Add welcome notification
    addNotification({
      title: 'Account Created!',
      message: `Welcome ${newUser.name}! Your account has been successfully created.`,
      type: 'success'
    });
  };

  // Handle logout with notification
  const handleLogout = () => {
    const userName = user?.name || 'User';
    setUser(null);
    localStorage.removeItem('coffee-user');
    setShowNavDrawer(false);

    // Add goodbye notification
    addNotification({
      title: 'Signed Out',
      message: `Goodbye ${userName}! You've been successfully signed out.`,
      type: 'info'
    });
  };

  // Generate cash payment code
  const generateCashPaymentCode = () => {
    return `CASH${Date.now().toString().slice(-6)}`;
  };

  const addToCart = (item: ProductProduct, quantity: number = 1, customizations?: any) => {
    let actualPrice = item.basePrice;
    
    // Calculate price with variants
    if (customizations) {
      if (customizations.size && item.variants?.sizes) {
        actualPrice += item.variants.sizes[customizations.size as keyof typeof item.variants.sizes] || 0;
      }
      if (customizations.milk && item.variants?.milk) {
        actualPrice += item.variants.milk[customizations.milk as keyof typeof item.variants.milk] || 0;
      }
    }

    const cartItem: CartItem = {
      id: item.id,
      name: item.name,
      description: item.description,
      price: actualPrice,
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

    // Show add notification
    setAddedItem(cartItem);
    setShowAddedNotification(true);
    setTimeout(() => {
      setShowAddedNotification(false);
      setAddedItem(null);
    }, 2000);
  };

  // Handle combo item add with notification
  const handleComboItemAdd = (comboItem: ProductProduct) => {
    addToCart(comboItem, 1, { size: 'Regular', milk: 'Regular', toppings: [], notes: '' });
    
    // Show combo notification
    setComboAddedItem(comboItem);
    setShowComboNotification(true);
    setTimeout(() => {
      setShowComboNotification(false);
      setComboAddedItem(null);
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

  // Get item quantity in cart (for default configuration)
  const getItemQuantityInCart = (itemId: string) => {
    const cartItem = cart.find(item => 
      item.id === itemId && 
      (JSON.stringify(item.customizations) === JSON.stringify({ size: 'Regular', milk: 'Regular', toppings: [], notes: '' }) ||
       !item.customizations)
    );
    return cartItem ? cartItem.quantity : 0;
  };

  // Handle quick add to cart (default configuration)
  const handleQuickAddToCart = (item: ProductProduct) => {
    addToCart(item, 1, { size: 'Regular', milk: 'Regular', toppings: [], notes: '' });
  };

  // Handle quantity change for menu items
  const handleMenuItemQuantityChange = (item: ProductProduct, quantity: number) => {
    const defaultCustomizations = { size: 'Regular', milk: 'Regular', toppings: [], notes: '' };
    
    if (quantity === 0) {
      removeFromCart(item.id, defaultCustomizations);
    } else {
      const currentQuantity = getItemQuantityInCart(item.id);
      const diff = quantity - currentQuantity;
      if (diff > 0) {
        addToCart(item, diff, defaultCustomizations);
      } else if (diff < 0) {
        updateCartItemQuantity(item.id, quantity, defaultCustomizations);
      }
    }
  };

  const handleShowMenuDetail = (item: ProductProduct) => {
    setSelectedMenuItem(item);
    setShowMenuDetail(true);
  };

  // Apply voucher
  const applyVoucher = (voucherCode: string, cartTotal: number) => {
    const voucher = availableVouchers.find(v => 
      v.code.toLowerCase() === voucherCode.toLowerCase() && 
      v.isActive && 
      cartTotal >= v.minOrder
    );
    
    if (voucher) {
      setAppliedVoucher(voucher);
      return true;
    }
    return false;
  };

  // Calculate discount
  const calculateDiscount = (total: number, voucher: Voucher | null) => {
    if (!voucher) return 0;
    
    if (voucher.type === 'percentage') {
      return Math.floor(total * (voucher.discount / 100));
    } else {
      return voucher.discount;
    }
  };

  // const handlePaymentComplete = (paymentMethod: string, transactionId: string, voucherCode?: string) => {
  const handlePaymentComplete = (paymentMethod: string, transactionId: string) => {
    if (cart.length === 0) return;

    const tableNumber = `T${Math.floor(Math.random() * 50) + 1}`;
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discount = calculateDiscount(subtotal, appliedVoucher);
    const total = subtotal - discount;

    const order: OrderHistoryItem = {
      id: Date.now().toString(),
      items: [...cart],
      total,
      discount,
      orderDate: new Date(),
      status: 'preparing',
      paymentMethod,
      transactionId,
      tableNumber,
      voucherCode: appliedVoucher?.code,
      paymentStatus: paymentMethod === 'cash' ? 'waiting_cash_confirmation' : 'completed',
      cashPaymentCode: paymentMethod === 'cash' ? generateCashPaymentCode() : undefined
    };

    const updatedOrders = [order, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('coffee-orders', JSON.stringify(updatedOrders));
    
    setCompletedOrder(order);
    setCart([]);
    setAppliedVoucher(null);
    setShowCart(false);
    setShowPaymentSuccess(true);
  };

  // Update order status
  // const updateOrderStatus = (orderId: string, status: Order['status']) => {
  //   const updatedOrders = orders.map(order => 
  //     order.id === orderId ? { ...order, status } : order
  //   );
  //   setOrders(updatedOrders);
  //   localStorage.setItem('coffee-orders', JSON.stringify(updatedOrders));
  // };

  // Handle feedback submission
  const handleFeedbackSubmission = (orderId: string, rating: number, feedback: string) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, feedbackGiven: true } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('coffee-orders', JSON.stringify(updatedOrders));
    
    // In a real app, you'd send this to your backend
    console.log('Feedback submitted:', { orderId, rating, feedback });
    
    setShowFeedbackModal(false);
    setFeedbackOrder(null);
  };

  // Get user's last ordered items
  const getLastOrderItems = () => {
    if (orders.length === 0) return [];
    const lastOrder = orders[0];
    return lastOrder.items.map(item => item.id);
  };

  // Mark notification as read
  const markNotificationAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId ? { ...notification, isRead: true } : notification
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('coffee-notifications', JSON.stringify(updatedNotifications));
  };

  // Get unread notifications count
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    switch (selectedCategory) {
      case "All":
        return true;
      case "New":
        return item.isNew;
      case "Recommended":
        return item.isRecommended;
      case "Most Ordered":
        return (item.orderCount || 0) >= 150;
      case "Last Order":
        const lastOrderItemIds = getLastOrderItems();
        return lastOrderItemIds.includes(item.id);
      default:
        return item.category === selectedCategory;
    }
  });

  // const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const cartDiscount = calculateDiscount(cartSubtotal, appliedVoucher);
  const cartTotal = cartSubtotal - cartDiscount;

  // Close drawer when clicking outside
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowNavDrawer(false);
        setShowMenuDetail(false);
        setShowFeedbackModal(false);
      }
    };

    if (showNavDrawer || showMenuDetail || showFeedbackModal) {
      document.addEventListener('keydown', handleEscape);
      return () => {
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [showNavDrawer, showMenuDetail, showFeedbackModal]);

  // Navigation handlers
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
  };

  const handleShowFavorites = () => {
    setShowFavorites(true);
    setShowNavDrawer(false);
  };

  const handleShowLogin = () => {
    setShowLogin(true);
    setShowNavDrawer(false);
  };

  const handleShowRegister = () => {
    setShowRegister(true);
    setShowNavDrawer(false);
  };

  const handleShowContactSupport = () => {
    setShowContactSupport(true);
    setShowNavDrawer(false);
  };

  const handleShowDeveloperFeedback = () => {
    setShowDeveloperFeedback(true);
    setShowNavDrawer(false);
  };

  const handleShowTermsConditions = () => {
    setShowTermsConditions(true);
    setShowNavDrawer(false);
  };

  const handleShowPrivacyPolicy = () => {
    setShowPrivacyPolicy(true);
    setShowNavDrawer(false);
  };

  const handleShowOrderDetail = (order: OrderItem) => {
    setSelectedOrder(order);
    setShowOrderDetail(true);
  };

  const resetToMainMenu = () => {
    setShowOrderHistory(false);
    setShowOrderDetail(false);
    setShowSettings(false);
    setShowNotifications(false);
    setShowCart(false);
    setShowPaymentSuccess(false);
    setShowLogin(false);
    setShowRegister(false);
    setShowFavorites(false);
    setShowContactSupport(false);
    setShowDeveloperFeedback(false);
    setShowTermsConditions(false);
    setShowPrivacyPolicy(false);
    setSelectedOrder(null);
    setCompletedOrder(null);
  };

  const backToOrderHistory = () => {
    setShowOrderDetail(false);
    setSelectedOrder(null);
  };

  const handlePaymentSuccessContinue = () => {
    resetToMainMenu();
  };

  const handlePaymentSuccessViewOrder = () => {
    if (completedOrder) {
      setShowPaymentSuccess(false);
      setSelectedOrder(completedOrder);
      setShowOrderDetail(true);
    }
  };

  // Render different screens
  if (showContactSupport) {
    return <ContactSupport onBack={resetToMainMenu} />;
  }

  if (showDeveloperFeedback) {
    return <DeveloperFeedback onBack={resetToMainMenu} />;
  }

  if (showTermsConditions) {
    return <TermsConditions onBack={resetToMainMenu} />;
  }

  if (showPrivacyPolicy) {
    return <PrivacyPolicy onBack={resetToMainMenu} />;
  }

  if (showLogin) {
    return (
      <Login
        onBack={resetToMainMenu}
        onLogin={handleLogin}
        onSwitchToRegister={() => {
          setShowLogin(false);
          setShowRegister(true);
        }}
        onShowTermsConditions={handleShowTermsConditions}
        onShowPrivacyPolicy={handleShowPrivacyPolicy}
      />
    );
  }

  if (showRegister) {
    return (
      <Register
        onBack={resetToMainMenu}
        onRegister={handleRegister}
        onSwitchToLogin={() => {
          setShowRegister(false);
          setShowLogin(true);
        }}
        onShowTermsConditions={handleShowTermsConditions}
        onShowPrivacyPolicy={handleShowPrivacyPolicy}
      />
    );
  }

  if (showFavorites) {
    return (
      <Favorites
        onBack={resetToMainMenu}
        favorites={favorites}
        menuItems={menuItems}
        onRemoveFavorite={removeFavorite}
        onReorder={(favorite) => {
          const menuItem = menuItems.find(item => item.id === favorite.menuItemId);
          if (menuItem) {
            addToCart(menuItem, 1, favorite.customizations);
          }
        }}
        onAddToCart={addToCart}
      />
    );
  }

  if (showSettings) {
    return (
      <SettingsPage 
        onBack={resetToMainMenu} 
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />
    );
  }

  if (showNotifications) {
    return (
      <NotificationsPage 
        onBack={resetToMainMenu} 
        notifications={notifications}
        onMarkAsRead={markNotificationAsRead}
        onShowOrderDetail={handleShowOrderDetail}
        orders={orders}
      />
    );
  }

  if (showPaymentSuccess && completedOrder) {
    return (
      <PaymentSuccess
        order={completedOrder}
        onContinue={handlePaymentSuccessContinue}
        onViewOrder={handlePaymentSuccessViewOrder}
        onContactSupport={handleShowContactSupport}
      />
    );
  }

  if (showOrderDetail && selectedOrder) {
    return (
      <OrderDetail
        order={selectedOrder}
        onBack={backToOrderHistory}
        onContactSupport={handleShowContactSupport}
        onAddToCart={(orderItems) => {
          orderItems.forEach(item => {
            const menuItem = menuItems.find(mi => mi.id === item.id);
            if (menuItem) {
              addToCart(menuItem, item.quantity, item.customizations);
            }
          });
          resetToMainMenu();
        }}
      />
    );
  }

  if (showOrderHistory) {
    return (
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
    );
  }

  if (showCart) {
    return (
      <Cart
        items={cart}
        subtotal={cartSubtotal}
        discount={cartDiscount}
        total={cartTotal}
        appliedVoucher={appliedVoucher}
        availableVouchers={availableVouchers}
        onUpdateQuantity={updateCartItemQuantity}
        onRemoveItem={removeFromCart}
        onBack={() => setShowCart(false)}
        onApplyVoucher={applyVoucher}
        onRemoveVoucher={() => setAppliedVoucher(null)}
        onProceedToPayment={() => {}} // Not used anymore
        onPaymentComplete={handlePaymentComplete}
      />
    );
  }

  return (
    <div className={`relative size-full bg-white overflow-hidden ${isDarkMode ? 'dark' : ''}`}>
      {/* Navigation Drawer with Blur Background */}
      <div className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${
        showNavDrawer ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Blurred Background from Menu UI */}
        <div 
          className={`absolute inset-0 bg-black/20 backdrop-blur-md transition-opacity duration-300 ease-in-out ${
            showNavDrawer ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          onClick={() => setShowNavDrawer(false)}
        />
        
        {/* Drawer */}
        <div className={`absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-gradient-to-b from-[#167dda] to-[#104779] shadow-2xl transform transition-transform duration-300 ease-in-out ${
          showNavDrawer ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <NavigationDrawer 
            user={user}
            onClose={() => setShowNavDrawer(false)}
            onShowOrderHistory={handleShowOrderHistory}
            onShowSettings={handleShowSettings}
            onShowFavorites={handleShowFavorites}
            onShowLogin={handleShowLogin}
            onShowRegister={handleShowRegister}
            onShowContactSupport={handleShowContactSupport}
            onShowDeveloperFeedback={handleShowDeveloperFeedback}
            onShowTermsConditions={handleShowTermsConditions}
            onShowPrivacyPolicy={handleShowPrivacyPolicy}
            onLogout={handleLogout}
          />
        </div>
      </div>

      {/* Menu Detail Overlay with Clickable Blur Background */}
      {showMenuDetail && selectedMenuItem && (
        <div className="fixed inset-0 z-50">
          {/* Clickable Blurred Background */}
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-md cursor-pointer" 
            onClick={() => setShowMenuDetail(false)}
          />
          
          <MenuDetailOverlay
            item={selectedMenuItem}
            menuItems={menuItems}
            favorites={favorites}
            onClose={() => setShowMenuDetail(false)}
            onAddToCart={addToCart}
            onSaveFavorite={saveFavorite}
            onRemoveFavorite={removeFavorite}
            isItemFavorited={isItemFavorited}
            onComboItemAdd={handleComboItemAdd}
          />
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && feedbackOrder && (
        <FeedbackModal
          order={feedbackOrder}
          onSubmit={handleFeedbackSubmission}
          onClose={() => {
            setShowFeedbackModal(false);
            setFeedbackOrder(null);
          }}
        />
      )}

      {/* Status Bar */}
      <div className="h-12 bg-white dark:bg-gray-900" />

      {/* Header with Notification Button - Show even during loading */}
      {(criticalDataLoaded || loadingState === 'success') && (
        <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm relative">
          <div className="flex items-center px-5 py-4">
            <div className="w-8 flex justify-start">
              <button 
                onClick={() => setShowNavDrawer(true)}
                className="relative w-8 h-8 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"
              >
                <AnimatedHamburgerIcon isOpen={showNavDrawer} />
              </button>
            </div>
            
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Logo />
            </div>
            
            {/* Notification Button in Header */}
            <div className="w-8 flex justify-end">
              <button
                onClick={handleShowNotifications}
                className="relative w-8 h-8 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"
              >
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                  </span>
                )}
              </button>
            </div>
            
            {/* Connection Status Indicator */}
            <div className="absolute top-2 right-2">
              {!isOnline && (
                <div className="flex items-center space-x-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded-full text-xs">
                  <WifiOff className="w-3 h-3" />
                  <span>Offline</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="px-5 py-6 space-y-6">
            {/* Error States */}
            {(loadingState === 'error' || loadingState === 'timeout' || loadingState === 'offline') && (
              <div className="space-y-4">
                <ErrorState 
                  state={loadingState}
                  onRetry={handleRetry}
                  retryCount={retryCount}
                  isOnline={isOnline}
                />
              </div>
            )}

            {/* Loading State */}
            {loadingState === 'loading' && (
              <LoadingSkeleton />
            )}

            {/* Success State */}
            {loadingState === 'success' && (
              <>
                {/* Search Section */}
                <SearchSection 
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  lastOrderItems={getLastOrderItems()}
                />
                
                {/* Favorites Section */}
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
                
                {/* Menu Items */}
                <div className="space-y-4">
                  {filteredItems.map((item) => (
                    <MenuItemComponent
                      key={item.id}
                      item={item}
                      quantity={getItemQuantityInCart(item.id)}
                      isFavorited={isItemFavorited(item.id, { size: 'Regular', milk: 'Regular', toppings: [], notes: '' })}
                      onShowDetail={handleShowMenuDetail}
                      onQuickAdd={handleQuickAddToCart}
                      onQuantityChange={handleMenuItemQuantityChange}
                      onToggleFavorite={(item) => {
                        const defaultCustomizations = { size: 'Regular', milk: 'Regular', toppings: [], notes: '' };
                        if (isItemFavorited(item.id, defaultCustomizations)) {
                          const favorite = favorites.find(fav => 
                            fav.menuItemId === item.id && 
                            JSON.stringify(fav.customizations) === JSON.stringify(defaultCustomizations)
                          );
                          if (favorite) {
                            removeFavorite(favorite.id);
                          }
                        } else {
                          saveFavorite(item, defaultCustomizations, item.basePrice);
                        }
                      }}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Floating Cart Card */}
      <FloatingCartCard
        items={cart}
        total={cartTotal}
        onContinue={() => setShowCart(true)}
        isVisible={cart.length > 0}
      />

      {/* Add to Cart Notification */}
      {showAddedNotification && addedItem && (
        <div className={`fixed top-20 left-4 right-4 z-40 transform transition-all duration-300 ease-in-out ${
          showAddedNotification ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}>
          <div className="bg-white dark:bg-gray-800 mx-auto rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 max-w-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900 dark:text-gray-100">{addedItem.name} added to cart</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Rp {addedItem.price.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Combo Item Added Notification */}
      {showComboNotification && comboAddedItem && (
        <div className={`fixed top-32 left-4 right-4 z-40 transform transition-all duration-300 ease-in-out ${
          showComboNotification ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
        }`}>
          <div className="bg-blue-50 dark:bg-blue-900 mx-auto rounded-2xl shadow-xl border border-blue-200 dark:border-blue-700 p-4 max-w-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                <Plus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-blue-900 dark:text-blue-100">Combo: {comboAddedItem.name} added!</p>
                <p className="text-sm text-blue-600 dark:text-blue-400">Perfect pairing added to cart</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Home Indicator */}
      <HomeIndicator />
    </div>
  );
}

// Error State Component
function ErrorState({ 
  state, 
  onRetry, 
  retryCount, 
  isOnline 
}: { 
  state: LoadingState; 
  onRetry: () => void;
  retryCount: number;
  isOnline: boolean;
}) {
  const getErrorContent = () => {
    switch (state) {
      case 'timeout':
        return {
          icon: <Clock className="w-12 h-12 text-yellow-500" />,
          title: 'Loading Taking Too Long',
          message: 'The app is taking longer than expected to load. This might be due to a slow connection.',
          variant: 'warning' as const
        };
      case 'offline':
        return {
          icon: <WifiOff className="w-12 h-12 text-red-500" />,
          title: 'You\'re Offline',
          message: isOnline ? 'Connection restored! You can retry now.' : 'Please check your internet connection and try again.',
          variant: isOnline ? 'success' as const : 'destructive' as const
        };
      case 'error':
      default:
        return {
          icon: <AlertTriangle className="w-12 h-12 text-red-500" />,
          title: 'Something Went Wrong',
          message: 'We encountered an error while loading the app. Please try again.',
          variant: 'destructive' as const
        };
    }
  };

  // const { icon, title, message, variant } = getErrorContent();
  const { icon, title, message } = getErrorContent();

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] text-center px-6">
      <div className="mb-6">
        {icon}
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {title}
      </h3>
      
      <Alert className="mb-6 max-w-md">
        <AlertDescription>
          {message}
          {retryCount > 0 && (
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Retry attempts: {retryCount}
            </div>
          )}
        </AlertDescription>
      </Alert>

      <div className="space-y-3">
        <Button
          onClick={onRetry}
          disabled={state === 'offline' && !isOnline}
          className="bg-[#84482b] hover:bg-[#6d3a23] text-white px-6 py-2 rounded-xl flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{state === 'offline' && !isOnline ? 'Waiting for Connection' : 'Try Again'}</span>
        </Button>
        
        {state === 'offline' && (
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-green-500" />
                <span>Connection restored!</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4" />
                <span>No internet connection</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Loading Skeleton Component
function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Search Section Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-12 w-full rounded-2xl" />
        <div className="flex space-x-3 overflow-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full flex-shrink-0" />
          ))}
        </div>
      </div>

      {/* Favorites Section Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-6 w-32" />
        <div className="flex space-x-3 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-48 rounded-xl flex-shrink-0" />
          ))}
        </div>
      </div>

      {/* Menu Items Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <MenuItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

// Menu Item Skeleton Component
function MenuItemSkeleton() {
  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-4">
        <div className="flex space-x-4">
          {/* Image Skeleton */}
          <Skeleton className="w-20 h-20 rounded-xl flex-shrink-0" />
          
          {/* Content Skeleton */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="w-6 h-6 rounded-full ml-2" />
            </div>
            
            <div className="flex justify-between items-center mt-3">
              <div className="space-y-2">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-3 w-16" />
              </div>
              <Skeleton className="h-10 w-20 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Feedback Modal Component
function FeedbackModal({ 
  order, 
  onSubmit, 
  onClose 
}: { 
  order: OrderItem; 
  onSubmit: (orderId: string, rating: number, feedback: string) => void;
  onClose: () => void;
}) {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Order Complete!</h3>
          <p className="text-gray-600 dark:text-gray-400">How was your experience?</p>
        </div>

        {/* Rating */}
        <div className="mb-6">
          <div className="flex justify-center space-x-2 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star 
                  className={`w-10 h-10 transition-colors ${
                    star <= rating 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                />
              </button>
            ))}
          </div>
          <p className="text-center text-gray-600 dark:text-gray-400">
            {rating === 0 && 'Rate your experience'}
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Fair'}
            {rating === 3 && 'Good'}
            {rating === 4 && 'Very Good'}
            {rating === 5 && 'Excellent'}
          </p>
        </div>

        {/* Feedback */}
        <div className="mb-6">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us about your experience (optional)"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#84482b] focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            rows={3}
          />
        </div>

        {/* Buttons */}
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Skip
          </Button>
          <Button
            onClick={() => onSubmit(order.id, rating, feedback)}
            disabled={rating === 0}
            className="flex-1 bg-[#84482b] hover:bg-[#6d3a23] disabled:bg-gray-300"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}

// Favorites Section Component with Better Colors
function FavoritesSection({ 
  favorites, 
  menuItems, 
  onReorder 
}: { 
  favorites: FavoriteItem[]; 
  menuItems: ProductProduct[];
  onReorder: (favorite: FavoriteItem) => void;
}) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Quick Reorder</h3>
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {favorites.slice(0, 5).map((favorite) => {
          const menuItem = menuItems.find(item => item.id === favorite.menuItemId);
          return (
            <button
              key={favorite.id}
              onClick={() => onReorder(favorite)}
              className="flex-shrink-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 min-w-[200px] hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                  {menuItem && (
                    <LazyImage
                      src={menuItem.image}
                      alt={favorite.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{favorite.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Rp {favorite.totalPrice.toLocaleString()}</p>
                </div>
                <Heart className="w-4 h-4 text-red-500 fill-current" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Animated Hamburger to X Icon
function AnimatedHamburgerIcon({ isOpen }: { isOpen: boolean }) {
  return (
    <div className="w-6 h-6 flex flex-col justify-center items-center">
      <div className="w-full relative">
        <div className={`w-5 h-0.5 bg-[#84482b] dark:bg-gray-300 transform transition-all duration-300 ease-in-out ${
          isOpen ? 'rotate-45 translate-y-1.5' : 'rotate-0 translate-y-0'
        }`} />
        <div className={`w-5 h-0.5 bg-[#84482b] dark:bg-gray-300 transform transition-all duration-300 ease-in-out mt-1 ${
          isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
        }`} />
        <div className={`w-5 h-0.5 bg-[#84482b] dark:bg-gray-300 transform transition-all duration-300 ease-in-out mt-1 ${
          isOpen ? '-rotate-45 -translate-y-1.5' : 'rotate-0 translate-y-0'
        }`} />
      </div>
    </div>
  );
}

// Enhanced Navigation Drawer with User Profile
function NavigationDrawer({ 
  user,
  onClose, 
  onShowOrderHistory, 
  onShowSettings, 
  onShowFavorites,
  onShowLogin,
  onShowRegister,
  onShowContactSupport,
  onShowDeveloperFeedback,
  onShowTermsConditions,
  onShowPrivacyPolicy,
  onLogout
}: { 
  user: UserUser | null;
  onClose: () => void; 
  onShowOrderHistory: () => void;
  onShowSettings: () => void;
  onShowFavorites: () => void;
  onShowLogin: () => void;
  onShowRegister: () => void;
  onShowContactSupport: () => void;
  onShowDeveloperFeedback: () => void;
  onShowTermsConditions: () => void;
  onShowPrivacyPolicy: () => void;
  onLogout: () => void;
}) {
  return (
    <div className="h-full flex flex-col">
      <div className="bg-[#167dda] px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Menu</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
          >
            <div className="w-4 h-4 relative">
              <div className="absolute w-4 h-0.5 bg-white transform rotate-45 top-1.5" />
              <div className="absolute w-4 h-0.5 bg-white transform -rotate-45 top-1.5" />
            </div>
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-b from-[#167dda] to-[#1a7fe0] px-6 py-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            {user ? (
              <>
                <h3 className="text-lg font-semibold text-white">Welcome, {user.name}!</h3>
                <p className="text-sm text-white/80">{user.email}</p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold text-white">Welcome, Guest!</h3>
                <p className="text-sm text-white/80">Sign in to access your account</p>
              </>
            )}
          </div>
        </div>
        
        {!user && (
          <div className="mt-4 flex space-x-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-xl"
              onClick={onShowLogin}
            >
              Sign In
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-xl"
              onClick={onShowRegister}
            >
              Register
            </Button>
          </div>
        )}

        {user && (
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-xl"
              onClick={onLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="py-2">
          <MenuItem
            icon={<div className="w-5 h-5 bg-[#84482b] rounded flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 4a.5.5 0 01.5.5v3h3a.5.5 0 010 1h-3v3a.5.5 0 01-1 0v-3h-3a.5.5 0 010-1h3v-3A.5.5 0 018 4z"/>
              </svg>
            </div>}
            title="New Order"
            onClick={onClose}
          />

          <MenuItem
            icon={<History className="w-5 h-5" />}
            title="My Orders"
            onClick={onShowOrderHistory}
          />

          <MenuItem
            icon={<Heart className="w-5 h-5" />}
            title="Favorites"
            onClick={onShowFavorites}
          />

          <MenuItem
            icon={<HelpCircle className="w-5 h-5" />}
            title="Contact Support"
            onClick={onShowContactSupport}
          />

          <MenuItem
            icon={<MessageCircle className="w-5 h-5" />}
            title="Send Feedback"
            onClick={onShowDeveloperFeedback}
          />

          <MenuItem
            icon={<Settings className="w-5 h-5" />}
            title="Settings"
            onClick={onShowSettings}
          />

          <div className="mx-6 my-2 border-t border-white/20" />

          <MenuItem
            icon={<FileText className="w-5 h-5" />}
            title="Terms & Conditions"
            onClick={onShowTermsConditions}
          />

          <MenuItem
            icon={<Shield className="w-5 h-5" />}
            title="Privacy Policy"
            onClick={onShowPrivacyPolicy}
          />
        </div>
      </div>

      <div className="bg-[#000000] p-4">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-white text-sm">Powered By</span>
          <div
            className="h-4 w-12 bg-center bg-contain bg-no-repeat"
            style={{ backgroundImage: `url('${LogoWhite}')` }}
          />
        </div>
      </div>
    </div>
  );
}

// Menu Item Component for Navigation
function MenuItem({ icon, title, onClick }: { icon: React.ReactNode; title: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full px-6 py-4 flex items-center space-x-4 text-white hover:bg-white/10 transition-colors duration-200"
    >
      <div className="flex-shrink-0">{icon}</div>
      <span className="text-left font-medium">{title}</span>
    </button>
  );
}

function Logo() {
  return (
    <div className="h-14 w-16">
      <div
        className="w-full h-full bg-center bg-contain bg-no-repeat"
        style={{ backgroundImage: `url('${LogoVector}')` }}
      />
    </div>
  );
}

function SearchSection({ 
  searchTerm, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange,
  lastOrderItems
}: {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  lastOrderItems: string[];
}) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "New":
        return <Star className="w-4 h-4 text-yellow-500" />;
      case "Recommended":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "Most Ordered":
        return <TrendingUp className="w-4 h-4 text-blue-500" />;
      case "Last Order":
        return <Clock className="w-4 h-4 text-purple-500" />;
      default:
        return null;
    }
  };

  const getCategoryCount = (category: string) => {
    switch (category) {
      case "New":
        return menuItems.filter(item => item.isNew).length;
      case "Recommended":
        return menuItems.filter(item => item.isRecommended).length;
      case "Most Ordered":
        return menuItems.filter(item => (item.orderCount || 0) >= 150).length;
      case "Last Order":
        return lastOrderItems.length;
      default:
        return menuItems.filter(item => item.category === category).length;
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search for items..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#84482b] focus:border-transparent transition-all duration-200 text-gray-900 dark:text-gray-100"
        />
      </div>

      <div className="flex space-x-3 overflow-x-auto pb-2">
        {categories.map((category) => {
          const count = getCategoryCount(category);
          const isSelected = selectedCategory === category;
          
          if (category === "Last Order" && lastOrderItems.length === 0) {
            return null;
          }
          
          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                isSelected 
                  ? 'bg-[#84482b] text-white shadow-lg' 
                  : 'bg-white dark:bg-gray-800 text-[#84482b] dark:text-orange-400 border-2 border-[#84482b] dark:border-orange-400 hover:bg-[#84482b] hover:text-white'
              }`}
            >
              {getCategoryIcon(category)}
              <span>{category}</span>
              {count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  isSelected ? 'bg-white/20' : 'bg-[#84482b]/10 dark:bg-orange-400/10'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Updated MenuItemComponent with lazy loading
function MenuItemComponent({ 
  item, 
  quantity,
  isFavorited,
  onShowDetail, 
  onQuickAdd,
  onQuantityChange,
  onToggleFavorite
}: { 
  item: ProductProduct; 
  quantity: number;
  isFavorited: boolean;
  onShowDetail: (item: ProductProduct) => void;
  onQuickAdd: (item: ProductProduct) => void;
  onQuantityChange: (item: ProductProduct, quantity: number) => void;
  onToggleFavorite: (item: ProductProduct) => void;
}) {
  return (
    <div 
      className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={() => onShowDetail(item)}
    >
      <div className="p-4">
        <div className="flex space-x-4">
          {/* Image */}
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden flex-shrink-0 relative">
            <LazyImage
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-1 left-1 space-y-1">
              {item.isNew && (
                <span className="inline-block bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                  NEW
                </span>
              )}
              {item.isRecommended && (
                <span className="inline-block bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                  ⭐
                </span>
              )}
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base">{item.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{item.description}</p>
              </div>
              
              {/* Heart Icon */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(item);
                }}
                className="ml-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <Heart 
                  className={`w-5 h-5 transition-colors ${
                    isFavorited 
                      ? 'text-red-500 fill-current' 
                      : 'text-gray-400 dark:text-gray-500 hover:text-red-500'
                  }`}
                />
              </button>
            </div>
            
            <div className="flex justify-between items-center mt-3">
              <div className="space-y-1">
                <div className="font-bold text-lg text-gray-900 dark:text-gray-100">
                  Rp {item.basePrice.toLocaleString()}
                </div>
                {item.orderCount && item.orderCount > 0 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {item.orderCount} orders
                  </div>
                )}
              </div>
              
              {/* Quantity Controls or Add Button */}
              <div onClick={(e) => e.stopPropagation()}>
                {quantity > 0 ? (
                  <div className="flex items-center space-x-2 bg-[#84482b] rounded-xl px-2 py-1">
                    <button
                      onClick={() => onQuantityChange(item, quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-white font-medium px-2 min-w-[24px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => onQuantityChange(item, quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onQuickAdd(item)}
                    className="bg-[#84482b] text-white px-4 py-2 rounded-xl hover:bg-[#6d3a23] transition-colors duration-200 flex items-center space-x-2"
                  >
                    <span className="text-sm font-medium">Add</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                      <path d={svgPaths.p299f6d80} />
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HomeIndicator() {
  return (
    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
      <div className="w-32 h-1 bg-black bg-opacity-30 dark:bg-white dark:bg-opacity-30 rounded-full" />
    </div>
  );
}