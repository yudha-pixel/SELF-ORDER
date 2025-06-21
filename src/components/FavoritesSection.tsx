// src/components/FavoritesSection.tsx
import { FavoriteItem, MenuItem } from '../types';
import { Heart } from 'lucide-react';

export default function FavoritesSection({ 
  favorites, 
  menuItems, 
  onReorder 
}: { 
  favorites: FavoriteItem[]; 
  menuItems: MenuItem[];
  onReorder: (favorite: FavoriteItem) => void;
}) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-gray-900">Quick Reorder</h3>
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {favorites.slice(0, 5).map((favorite) => {
          const menuItem = menuItems.find(item => item.id === favorite.menuItemId);
          return (
            <button
              key={favorite.id}
              onClick={() => onReorder(favorite)}
              className="shrink-0 bg-white border border-gray-200 rounded-xl p-3 min-w-[200px] hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                  {menuItem && (
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{ backgroundImage: `url('${menuItem.image}')` }}
                    />
                  )}
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm text-gray-900">{favorite.name}</p>
                  <p className="text-xs text-gray-500">Rp {favorite.totalPrice.toLocaleString()}</p>
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