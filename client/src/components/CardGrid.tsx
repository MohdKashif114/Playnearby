import Card from './Card';
import type { Player, Team, Venue } from '../types';
import { Users, MapPin, Plus, Menu, X } from 'lucide-react';
import { useEffect } from 'react';
import {socket} from "../socket/socket"
import { useAuth } from '../Auth/AuthProvider';
import MapView from './MapView';
import VenueMarkers from './VenueMarkers';
import { dummyVenues } from '../data/locations';
import { NavLink ,Link} from 'react-router-dom';
import { Button } from "@/components/ui/button"
import { RetroGrid } from "@/components/ui/retro-grid"

type CardItem = Player | Team | Venue;

interface CardGridProps {
  items: CardItem[];
  noofuser:number;
  type:"player"|"team"|"venue";
  onlineUsers:Set<string>;
  onAddClick:()=>void;
  jointeamhandler:(teamid:string)=>void
  exitteamhandler:(teamid:string)=>void
    updateVenueImages:(venueId:string,newImages:string[])=>void;

}

const isTeam = (i: CardItem): i is Team => {
  return "members" in i && "maxPlayers" in i;
};





export default function CardGrid({ items,noofuser,onlineUsers,onAddClick,type,jointeamhandler,exitteamhandler,updateVenueImages}: CardGridProps) {



  const {currentTeam}=useAuth();
  
  if (type!="team" && items.length === 0 ) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg p-12 text-center border border-gray-700">
        <p className="text-gray-400 text-lg">
          No results found. Try adjusting your filters.
        </p>
      </div>
    );
  }
  
  return (
    <div className='relative h-screen mt-4'>
      {/* <div className='flex align-middle justify-center text-6xl p-4'>
      
      
      
        {
          (type==="team" || type==="venue") && 
            <div className="p-3 border-t border-gray-700">
                <Button
                  onClick={onAddClick}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2.5 rounded font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add New</span>
                </Button>
            </div>
        }
      
      </div> */}
      {/* <RetroGrid /> */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 -z-20">
      {items.map((item) => {
        if(type==="team") return <Card key={item._id} item={item} online={onlineUsers.has(item._id)} jointeamhandler={jointeamhandler} 
                                        usersteam={currentTeam===item._id} exitteamhandler={exitteamhandler} updateVenueImages={updateVenueImages}/>
        return <Card key={item._id} item={item} online={onlineUsers.has(item._id)} jointeamhandler={jointeamhandler} usersteam={false}
                exitteamhandler={exitteamhandler} updateVenueImages={updateVenueImages}/>
      })}
    </div>
    {((type === "team" && !currentTeam) || type === "venue") && (
      <button
        onClick={onAddClick}
        className="fixed bottom-8 right-8 bg-green-600 hover:bg-green-700 
                  text-white w-14 h-14 rounded-full shadow-lg 
                  flex items-center justify-center 
                  transition-all duration-300 hover:scale-110"
      >
        <Plus className="w-6 h-6" />
      </button>
)}

    
</div>
  );
}
