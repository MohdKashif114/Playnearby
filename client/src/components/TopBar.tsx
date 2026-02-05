import { Search } from 'lucide-react';
import type { SportFilter, TabType } from '../types';
import { locations } from '../data/locations';

interface TopBarProps {
  activeTab: TabType;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedSport: SportFilter;
  setSelectedSport: (val: SportFilter) => void;
  selectedLocation: string;
  setSelectedLocation: (val: string) => void;
}

export default function TopBar({
  activeTab,
  searchTerm,
  setSearchTerm,
  selectedSport,
  setSelectedSport,
  selectedLocation,
  setSelectedLocation,
}: TopBarProps) {
  return (
    <div className="bg-gray-800 border-b border-gray-700 p-4">
      <div className="flex items-center gap-4 flex-wrap">
        {/* Search */}
        <div className="flex-1 min-w-64">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-400"
            />
          </div>
        </div>

        {/* Sport Filter */}
        <select
          value={selectedSport}
          onChange={(e) => setSelectedSport(e.target.value as SportFilter)}
          className="px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="all">All Sports</option>
          <option value="cricket">Cricket</option>
          <option value="football">Football</option>
        </select>

        {/* Location Filter */}
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="all">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
