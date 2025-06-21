// src/components/NavigationDrawer.tsx
import { ShoppingCart, User, Settings, Heart, Bell, History } from 'lucide-react';
import { Button } from './ui/button';
import MenuItem from './MenuItem';
import imgLogoWhite from "../assets/LogoWhite.png";

export default function NavigationDrawer({ 
  onClose, 
  onShowOrderHistory, 
  onShowSettings, 
  onShowNotifications 
}: { 
  onClose: () => void; 
  onShowOrderHistory: () => void;
  onShowSettings: () => void;
  onShowNotifications: () => void;
}) {
  return (
    <div className="h-full flex flex-col">
      <div className="bg-[#167dda] px-6 py-4">
      </div>
      <div className="bg-linear-to-b from-[#167dda] to-[#1a7fe0] px-6 py-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">Welcome, Guest!</h3>
            <p className="text-sm text-white/80">Sign in to access your account</p>
          </div>
        </div>
        <div className="mt-4 flex space-x-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-xl"
            onClick={() => {
              alert('Login feature coming soon!');
              onClose();
            }}
          >
            Sign In
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-xl"
            onClick={() => {
              alert('Register feature coming soon!');
              onClose();
            }}
          >
            Register
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="py-2">
          <MenuItem
            icon={<ShoppingCart className="w-5 h-5" />}
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
            onClick={() => {
              alert('Favorites management coming soon!');
              onClose();
            }}
          />
          <MenuItem
            icon={<Bell className="w-5 h-5" />}
            title="Notifications"
            onClick={onShowNotifications}
          />
          <MenuItem
            icon={<Settings className="w-5 h-5" />}
            title="Settings"
            onClick={onShowSettings}
          />
        </div>
      </div>
      <div className="bg-[#000000] p-4">
        <div className="flex items-center justify-center space-x-2">
          <span className="text-white text-sm">Powered By</span>
          <div
            className="h-4 w-12 bg-center bg-contain bg-no-repeat"
            style={{ backgroundImage: `url('${imgLogoWhite}')` }}
          />
        </div>
      </div>
    </div>
  );
}