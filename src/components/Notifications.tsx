import { useState, useEffect } from 'react';
import { ArrowLeft, Bell, Gift, Coffee, Star, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import imgLogo from "./../assets/LogoVector.svg";

interface NotificationsProps {
  onBack: () => void;
}

interface NotificationItem {
  id: string;
  type: 'promo' | 'order' | 'new_product' | 'general';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  image?: string;
  actionText?: string;
  actionUrl?: string;
}

const sampleNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'promo',
    title: '🎉 Weekend Special - 30% Off!',
    message: 'Get 30% off on all coffee drinks this weekend. Limited time offer!',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    actionText: 'Order Now',
  },
  {
    id: '2',
    type: 'order',
    title: 'Order Ready for Pickup',
    message: 'Your order #12345 is ready for pickup at Downtown Cafe.',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    read: true,
    actionText: 'View Order',
  },
  {
    id: '3',
    type: 'new_product',
    title: '☕ New Seasonal Flavor!',
    message: 'Try our new Pumpkin Spice Latte - available for a limited time only.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    read: false,
    actionText: 'Try Now',
  },
  {
    id: '4',
    type: 'promo',
    title: '🎁 Buy 2 Get 1 Free',
    message: 'Purchase any 2 drinks and get the 3rd one free! Valid until end of month.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    read: true,
    actionText: 'Order Now',
  },
  {
    id: '5',
    type: 'general',
    title: 'New Store Opening',
    message: 'We\'re excited to announce our new location at Central Mall. Grand opening next week!',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    read: false,
  },
  {
    id: '6',
    type: 'promo',
    title: '💳 Student Discount Available',
    message: 'Show your student ID and get 20% off on all beverages. Every day!',
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    read: true,
    actionText: 'Learn More',
  },
];

export default function Notifications({ onBack }: NotificationsProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'promo'>('all');

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('coffee-notifications');
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications);
      // Convert timestamp strings back to Date objects
      const withDates = parsed.map((notif: any) => ({
        ...notif,
        timestamp: new Date(notif.timestamp)
      }));
      setNotifications(withDates);
    } else {
      // First time - use sample notifications
      setNotifications(sampleNotifications);
      localStorage.setItem('coffee-notifications', JSON.stringify(sampleNotifications));
    }
  }, []);

  // Save notifications to localStorage whenever notifications change
  const saveNotifications = (newNotifications: NotificationItem[]) => {
    setNotifications(newNotifications);
    localStorage.setItem('coffee-notifications', JSON.stringify(newNotifications));
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    );
    saveNotifications(updated);
  };

  const markAsUnread = (id: string) => {
    const updated = notifications.map(notif =>
      notif.id === id ? { ...notif, read: false } : notif
    );
    saveNotifications(updated);
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter(notif => notif.id !== id);
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(notif => ({ ...notif, read: true }));
    saveNotifications(updated);
  };

  const clearAllNotifications = () => {
    const confirmClear = window.confirm('Are you sure you want to clear all notifications? This action cannot be undone.');
    if (confirmClear) {
      saveNotifications([]);
    }
  };

  const getFilteredNotifications = () => {
    switch (filter) {
      case 'unread':
        return notifications.filter(n => !n.read);
      case 'promo':
        return notifications.filter(n => n.type === 'promo');
      default:
        return notifications;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'promo':
        return <Gift className="w-5 h-5 text-green-600" />;
      case 'order':
        return <Coffee className="w-5 h-5 text-blue-600" />;
      case 'new_product':
        return <Star className="w-5 h-5 text-purple-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationBgColor = (type: string, read: boolean) => {
    const baseColor = read ? 'bg-gray-50' : 'bg-white';
    switch (type) {
      case 'promo':
        return read ? 'bg-green-50' : 'bg-green-100';
      case 'order':
        return read ? 'bg-blue-50' : 'bg-blue-100';
      case 'new_product':
        return read ? 'bg-purple-50' : 'bg-purple-100';
      default:
        return baseColor;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

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
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white">Notifications</h1>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
          
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Filter Tabs */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-3">
          <div className="flex space-x-1">
            {[
              { key: 'all', label: 'All', count: notifications.length },
              { key: 'unread', label: 'Unread', count: unreadCount },
              { key: 'promo', label: 'Promos', count: notifications.filter(n => n.type === 'promo').length },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === tab.key
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        {notifications.length > 0 && (
          <div className="px-5 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="text-blue-600 border-blue-200 hover:bg-blue-50"
              >
                Mark All Read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllNotifications}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="p-5">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'all' ? 'No notifications yet' : 
                 filter === 'unread' ? 'No unread notifications' : 
                 'No promotional notifications'}
              </h3>
              <p className="text-gray-500">
                {filter === 'all' ? 'You\'ll see notifications here when they arrive.' : 
                 filter === 'unread' ? 'All your notifications have been read.' : 
                 'No promotional offers at the moment.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`${getNotificationBgColor(notification.type, notification.read)} rounded-2xl border ${
                    notification.read ? 'border-gray-200' : 'border-gray-300'
                  } p-4 transition-all hover:shadow-md`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Icon */}
                    <div className="shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className={`font-semibold ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>

                      <p className={`text-sm mb-3 ${notification.read ? 'text-gray-600' : 'text-gray-700'}`}>
                        {notification.message}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {notification.actionText && (
                            <Button
                              size="sm"
                              className="bg-[#84482b] hover:bg-[#6d3a23] text-white text-xs px-3 py-1"
                              onClick={() => {
                                markAsRead(notification.id);
                                alert(`${notification.actionText} clicked!`);
                              }}
                            >
                              {notification.actionText}
                            </Button>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => notification.read ? markAsUnread(notification.id) : markAsRead(notification.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                            title={notification.read ? 'Mark as unread' : 'Mark as read'}
                          >
                            {notification.read ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete notification"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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