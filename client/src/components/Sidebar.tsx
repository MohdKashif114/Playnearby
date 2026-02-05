import { Users, MapPin, Plus, Menu, X } from 'lucide-react';
import type { TabType } from '../types';
import { NavLink } from "react-router-dom";


interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  onAddClick: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  onAddClick,
}: SidebarProps) {
  return (
    <div
      className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-gray-800 transition-all duration-300 flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {sidebarOpen && <h1 className="text-white font-bold text-xl">Sports Connect</h1>}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <NavLink to="/mainpage/players">Players</NavLink>

        <NavLink to="/mainpage/teams">Teams</NavLink>

        <NavLink to="/mainpage/venues">Venues</NavLink>
      </div>

      {/* Add Button */}
      
    </div>
  );
}
