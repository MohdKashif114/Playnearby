import { Search, Dumbbell, MapPin, Gauge, X } from "lucide-react";
import type { SportFilter, TabType } from "../types";
import { locations } from "../data/locations";
import { useLocation } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TopBarProps {
  activeTab: TabType;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedSport: SportFilter;
  setSelectedSport: (val: SportFilter) => void;
  selectedLocation: string;
  setSelectedLocation: (val: string) => void;
  fetchNearbyVenues: (val: number) => void;
  fetchNearbyPlayers: (val: number) => void;
  setRadius: (val: number) => void;
}

/* ───────────────────────────── */
/* Label */
/* ───────────────────────────── */
function FilterLabel({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest text-gray-500 mb-1">
      <span className="text-indigo-400">{icon}</span>
      {children}
    </div>
  );
}

/* ───────────────────────────── */
/* Shared Styles */
/* ───────────────────────────── */

const triggerClass =
  "h-9 rounded-xl text-sm text-gray-300 " +
  "bg-[#0F141B]/60 backdrop-blur-md " +
  "border border-gray-800 " +
  "hover:border-indigo-500/40 " +
  "focus:border-indigo-500/60 " +
  "transition-all duration-200";

const contentClass =
  "bg-[#11161D]/95 backdrop-blur-2xl " +
  "border border-gray-800 rounded-xl " +
  "text-gray-300 text-sm shadow-2xl shadow-black/60";

/* ───────────────────────────── */
/* TopBar */
/* ───────────────────────────── */

export default function TopBar({
  activeTab,
  searchTerm,
  setSearchTerm,
  selectedSport,
  setSelectedSport,
  selectedLocation,
  setSelectedLocation,
  fetchNearbyVenues,
  fetchNearbyPlayers,
  setRadius,
}: TopBarProps) {
  const location = useLocation();

  return (
    <div className="sticky top-4 z-30 mx-6">
      <div
        className="flex flex-wrap gap-4 px-6 py-4 rounded-2xl
                   bg-[#11161D]/70
                   backdrop-blur-xl
                   border border-gray-800/80
                   shadow-[0_8px_32px_-8px_rgba(0,0,0,0.6)]
                   transition-all duration-300"
      >
        {/* ───────── SEARCH ───────── */}
        <div className="flex-1 min-w-[220px]">
          <FilterLabel icon={<Search size={10} />}>Search</FilterLabel>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600 pointer-events-none" />

            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-8 rounded-xl text-sm text-gray-200
                         placeholder-gray-500
                         bg-[#0F141B]/60 backdrop-blur-md
                         border border-gray-800
                         focus:outline-none
                         focus:border-indigo-500/60
                         focus:bg-[#0F141B]/80
                         transition-all"
            />

            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* ───────── SPORT ───────── */}
        <div className="min-w-[150px]">
          <FilterLabel icon={<Dumbbell size={10} />}>Sport</FilterLabel>

          <Select
            value={selectedSport}
            onValueChange={(v) => setSelectedSport(v as SportFilter)}
          >
            <SelectTrigger className={`${triggerClass} w-full`}>
              <SelectValue placeholder="All Sports" />
            </SelectTrigger>

            <SelectContent className={contentClass}>
              <SelectGroup>
                <SelectLabel className="text-[10px] uppercase tracking-widest text-gray-500">
                  Sport
                </SelectLabel>
                <SelectItem value="all">All Sports</SelectItem>
                <SelectItem value="cricket">🏏 Cricket</SelectItem>
                <SelectItem value="football">⚽ Football</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* ───────── RADIUS ───────── */}
        <div className="min-w-[130px]">
          <FilterLabel icon={<Gauge size={10} />}>Radius</FilterLabel>

          <Select
            onValueChange={(value) => {
              const r = Number(value);
              setRadius(r);

              if (location.pathname.includes("venues"))
                fetchNearbyVenues(r);
              else if (location.pathname.includes("players"))
                fetchNearbyPlayers(r);
              else fetchNearbyVenues(r);
            }}
          >
            <SelectTrigger className={`${triggerClass} w-full`}>
              <SelectValue placeholder="Distance" />
            </SelectTrigger>

            <SelectContent className={contentClass}>
              <SelectGroup>
                <SelectLabel className="text-[10px] uppercase tracking-widest text-gray-500">
                  Radius
                </SelectLabel>
                <SelectItem value="2">2 km</SelectItem>
                <SelectItem value="5">5 km</SelectItem>
                <SelectItem value="10">10 km</SelectItem>
                <SelectItem value="20">20 km</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* ───────── LOCATION ───────── */}
        <div className="min-w-[170px]">
          <FilterLabel icon={<MapPin size={10} />}>Location</FilterLabel>

          <Select
            value={selectedLocation}
            onValueChange={setSelectedLocation}
          >
            <SelectTrigger className={`${triggerClass} w-full`}>
              <SelectValue placeholder="All Areas" />
            </SelectTrigger>

            <SelectContent className={contentClass}>
              <SelectGroup>
                <SelectLabel className="text-[10px] uppercase tracking-widest text-gray-500">
                  Area
                </SelectLabel>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}