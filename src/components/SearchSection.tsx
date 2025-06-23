// src/components/SearchSection.tsx
import { categories } from "../data/categories";
import { Search } from "lucide-react";

export default function SearchSection({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
}: {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="px-5 relative">
        <div className="absolute inset-y-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <input
          id="searchMenu"
          type="text"
          placeholder="Search for items..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#84482b] focus:border-transparent transition-all duration-200"
        />
      </div>
      <div className="flex space-x-3 overflow-x-auto pb-2 px-5">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`shrink-0 px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedCategory === category
                ? "bg-[#84482b] text-white shadow-lg"
                : "bg-white text-[#84482b] border-2 border-[#84482b] hover:bg-[#84482b] hover:text-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}