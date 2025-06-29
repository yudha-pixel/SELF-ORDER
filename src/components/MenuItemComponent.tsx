// src/components/MenuItemComponent.tsx
import { MenuItem } from '../types';
import svgPaths from "../imports/svg-zotrlrl93e";

interface MenuItemComponentProps {
  item: MenuItem;
  onShowDetail: (item: MenuItem) => void;
  onAddToCart: (item: MenuItem, quantity?: number, customizations?: any) => void;
}

export default function MenuItemComponent({ item, onShowDetail, onAddToCart}: MenuItemComponentProps) {
    // 2. Create a new handler specifically for the button click
  const handleAddToCartClick = (e: React.MouseEvent) => {
    // This stops the click from triggering the card's onClick event
    e.stopPropagation();

    // Call the addToCart function with the item and default values
    onAddToCart(item, 1, { size: 'Regular', milk: 'Regular Milk', notes: '' });
  };
  
  return (
    <div
      onClick={() => onShowDetail(item)}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex space-x-4">
          <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0">
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url('${item.image}')` }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 text-base">{item.name}</h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>
              </div>
            </div>
            <div className="flex justify-between items-center mt-3">
              <div className="space-y-1">
                <div className="font-bold text-lg text-gray-900">
                  Rp {item.sizePricing.Small.toLocaleString()}
                </div>
              </div>
              <button
                onClick={handleAddToCartClick}
                className="bg-[#84482b] text-white px-4 py-2 rounded-xl hover:bg-[#6d3a23] transition-colors duration-200 flex items-center space-x-2"
              >
                <span className="text-sm font-medium">Add</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                  <path d={svgPaths.p299f6d80} />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}