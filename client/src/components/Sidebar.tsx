import { Users, MapPin, Plus, Menu, X } from 'lucide-react';
import type { TabType } from '../types';
import { NavLink } from "react-router-dom";
import { RiTeamFill } from "react-icons/ri";
import { FaRegEye } from "react-icons/fa6";
import { FiMapPin } from "react-icons/fi";
import { LuUserRound } from "react-icons/lu";


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
  const linkBase =
    "flex items-center px-3 py-2 rounded-lg transition-all duration-300 ease-in-out transform";

  const activeStyle =
    "bg-indigo-600 text-white shadow-lg scale-[1.03]";

  const inactiveStyle =
    "text-gray-400 hover:text-white hover:bg-gray-700/60 hover:scale-[1.02]";

  const alignment = sidebarOpen
    ? "gap-3 justify-start"
    : "justify-center";

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-gradient-to-b from-gray-900 to-gray-800 transition-all duration-300 flex flex-col overflow-x-hidden`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex justify-end overflow-x-hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-gray-400 hover:text-white p-2 hover:bg-gray-700 rounded transition"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div
        className={`flex-1 overflow-y-auto space-y-10 overflow-x-hidden ${
          sidebarOpen ? "p-4" : "py-4"
        }`}
      >
        {/* PLAYERS */}
        <Section
          icon={<LuUserRound size={20} />}
          label="Players"
          sidebarOpen={sidebarOpen}
        >
          <NavLink
            to="/mainpage/players"
            end
            title="View Players"
            className={({ isActive }) =>
              `${linkBase} ${alignment} ${
                isActive ? activeStyle : inactiveStyle
              }`
            }
          >
            <FaRegEye />
            {sidebarOpen && <span>View</span>}
          </NavLink>

          <NavLink
            to="/mainpage/players/map"
            title="Players on Map"
            className={({ isActive }) =>
              `${linkBase} ${alignment} ${
                isActive ? activeStyle : inactiveStyle
              }`
            }
          >
            <FiMapPin />
            {sidebarOpen && <span>View on Map</span>}
          </NavLink>
        </Section>

        {/* TEAMS */}
        <Section
          icon={<RiTeamFill size={20} />}
          label="Teams"
          sidebarOpen={sidebarOpen}
        >
          <NavLink
            to="/mainpage/teams"
            end
            title="View Teams"
            className={({ isActive }) =>
              `${linkBase} ${alignment} ${
                isActive ? activeStyle : inactiveStyle
              }`
            }
          >
            <FaRegEye />
            {sidebarOpen && <span>View</span>}
          </NavLink>

          <NavLink
            to="/mainpage/teams/map"
            title="Teams on Map"
            className={({ isActive }) =>
              `${linkBase} ${alignment} ${
                isActive ? activeStyle : inactiveStyle
              }`
            }
          >
            <FiMapPin />
            {sidebarOpen && <span>View on Map</span>}
          </NavLink>
        </Section>

        {/* VENUES */}
        <Section
          icon={<FiMapPin size={20} />}
          label="Venues"
          sidebarOpen={sidebarOpen}
        >
          <NavLink
            to="/mainpage/venues"
            end
            title="View Venues"
            className={({ isActive }) =>
              `${linkBase} ${alignment} ${
                isActive ? activeStyle : inactiveStyle
              }`
            }
          >
            <FaRegEye />
            {sidebarOpen && <span>View</span>}
          </NavLink>

          <NavLink
            to="/mainpage/venues/map"
            title="Venues on Map"
            className={({ isActive }) =>
              `${linkBase} ${alignment} ${
                isActive ? activeStyle : inactiveStyle
              }`
            }
          >
            <FiMapPin />
            {sidebarOpen && <span>View on Map</span>}
          </NavLink>
        </Section>
      </div>
    </div>
  );
}

/* ---------- SECTION COMPONENT ---------- */

function Section({
  icon,
  label,
  sidebarOpen,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  sidebarOpen: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        className={`flex items-center mb-4 text-gray-300 font-semibold ${
          sidebarOpen ? "gap-3 justify-start" : "justify-center"
        }`}
      >
        {icon}
        {sidebarOpen && <span>{label}</span>}
      </div>

      <div
        className={`space-y-3 ${
          sidebarOpen ? "pl-6 border-l border-gray-700" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
}
