import { useState, useEffect } from 'react';
import { ArrowLeft, Bell, Globe, Moon, Sun, Volume2, VolumeX, Smartphone, Coffee } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import imgLogoWhite from "../assets/LogoWhite.png";

interface SettingsProps {
  onBack: () => void;
}

interface AppSettings {
  notifications: {
    orderUpdates: boolean;
    promotions: boolean;
    newProducts: boolean;
    marketing: boolean;
  };
  preferences: {
    darkMode: boolean;
    language: string;
    soundEffects: boolean;
    autoReorder: boolean;
  };
  privacy: {
    analytics: boolean;
    location: boolean;
    personalizedAds: boolean;
  };
}

const defaultSettings: AppSettings = {
  notifications: {
    orderUpdates: true,
    promotions: true,
    newProducts: false,
    marketing: false,
  },
  preferences: {
    darkMode: false,
    language: 'English',
    soundEffects: true,
    autoReorder: false,
  },
  privacy: {
    analytics: true,
    location: false,
    personalizedAds: false,
  },
};

export default function Settings({ onBack }: SettingsProps) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('coffee-app-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage whenever settings change
  const updateSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('coffee-app-settings', JSON.stringify(newSettings));
  };

  const handleNotificationChange = (key: keyof AppSettings['notifications'], value: boolean) => {
    const newSettings = {
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: value,
      },
    };
    updateSettings(newSettings);
  };

  const handlePreferenceChange = (key: keyof AppSettings['preferences'], value: boolean | string) => {
    const newSettings = {
      ...settings,
      preferences: {
        ...settings.preferences,
        [key]: value,
      },
    };
    updateSettings(newSettings);
  };

  const handlePrivacyChange = (key: keyof AppSettings['privacy'], value: boolean) => {
    const newSettings = {
      ...settings,
      privacy: {
        ...settings.privacy,
        [key]: value,
      },
    };
    updateSettings(newSettings);
  };

  const resetToDefaults = () => {
    const confirmReset = window.confirm('Are you sure you want to reset all settings to default? This action cannot be undone.');
    if (confirmReset) {
      updateSettings(defaultSettings);
      alert('Settings have been reset to default values.');
    }
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
            <h1 className="text-xl font-bold text-white">Settings</h1>
          </div>
          
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-5 space-y-6">
          {/* Notification Settings */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                <p className="text-sm text-gray-500">Manage your notification preferences</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Order Updates</div>
                  <div className="text-sm text-gray-500">Get notified about your order status</div>
                </div>
                <Switch
                  checked={settings.notifications.orderUpdates}
                  onCheckedChange={(checked) => handleNotificationChange('orderUpdates', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Promotions & Offers</div>
                  <div className="text-sm text-gray-500">Special deals and discounts</div>
                </div>
                <Switch
                  checked={settings.notifications.promotions}
                  onCheckedChange={(checked) => handleNotificationChange('promotions', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">New Products</div>
                  <div className="text-sm text-gray-500">Be first to know about new menu items</div>
                </div>
                <Switch
                  checked={settings.notifications.newProducts}
                  onCheckedChange={(checked) => handleNotificationChange('newProducts', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Marketing Messages</div>
                  <div className="text-sm text-gray-500">General marketing communications</div>
                </div>
                <Switch
                  checked={settings.notifications.marketing}
                  onCheckedChange={(checked) => handleNotificationChange('marketing', checked)}
                />
              </div>
            </div>
          </div>

          {/* App Preferences */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">App Preferences</h2>
                <p className="text-sm text-gray-500">Customize your app experience</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    {settings.preferences.darkMode ? (
                      <Moon className="w-5 h-5 text-gray-600" />
                    ) : (
                      <Sun className="w-5 h-5 text-gray-600" />
                    )}
                    <div>
                      <div className="font-medium text-gray-900">Dark Mode</div>
                      <div className="text-sm text-gray-500">Use dark theme for the app</div>
                    </div>
                  </div>
                </div>
                <Switch
                  checked={settings.preferences.darkMode}
                  onCheckedChange={(checked) => handlePreferenceChange('darkMode', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Language</div>
                    <div className="text-sm text-gray-500">Choose your preferred language</div>
                  </div>
                </div>
                <select
                  value={settings.preferences.language}
                  onChange={(e) => handlePreferenceChange('language', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="English">English</option>
                  <option value="Indonesian">Bahasa Indonesia</option>
                  <option value="Mandarin">中文</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {settings.preferences.soundEffects ? (
                    <Volume2 className="w-5 h-5 text-gray-600" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-gray-600" />
                  )}
                  <div>
                    <div className="font-medium text-gray-900">Sound Effects</div>
                    <div className="text-sm text-gray-500">Play sounds for app interactions</div>
                  </div>
                </div>
                <Switch
                  checked={settings.preferences.soundEffects}
                  onCheckedChange={(checked) => handlePreferenceChange('soundEffects', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Coffee className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="font-medium text-gray-900">Auto Reorder</div>
                    <div className="text-sm text-gray-500">Suggest reordering favorite items</div>
                  </div>
                </div>
                <Switch
                  checked={settings.preferences.autoReorder}
                  onCheckedChange={(checked) => handlePreferenceChange('autoReorder', checked)}
                />
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Privacy & Data</h2>
                <p className="text-sm text-gray-500">Control how your data is used</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Analytics</div>
                  <div className="text-sm text-gray-500">Help improve the app with usage data</div>
                </div>
                <Switch
                  checked={settings.privacy.analytics}
                  onCheckedChange={(checked) => handlePrivacyChange('analytics', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Location Services</div>
                  <div className="text-sm text-gray-500">Find nearby stores and delivery options</div>
                </div>
                <Switch
                  checked={settings.privacy.location}
                  onCheckedChange={(checked) => handlePrivacyChange('location', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Personalized Ads</div>
                  <div className="text-sm text-gray-500">Show ads based on your preferences</div>
                </div>
                <Switch
                  checked={settings.privacy.personalizedAds}
                  onCheckedChange={(checked) => handlePrivacyChange('personalizedAds', checked)}
                />
              </div>
            </div>
          </div>

          {/* Reset Settings */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5">
            <div className="text-center space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Reset Settings</h3>
              <p className="text-sm text-gray-500">
                Reset all settings to their default values. This action cannot be undone.
              </p>
              <Button
                variant="outline"
                onClick={resetToDefaults}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                Reset to Defaults
              </Button>
            </div>
          </div>

          {/* App Version */}
          <div className="text-center text-sm text-gray-500 py-4">
            Coffee Order App v1.0.0
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
            style={{ backgroundImage: `url('${imgLogoWhite}')` }}
          />
        </div>
      </div>
    </div>
  );
}