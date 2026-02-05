import Card from './Card';
import type { Player, Team, Venue } from '../types';
import { Users, MapPin, Plus, Menu, X } from 'lucide-react';
import { useEffect } from 'react';
import {socket} from "../socket/socket"
import { useAuth } from '../Auth/AuthProvider';

type CardItem = Player | Team | Venue;

interface CardGridProps {
  items: CardItem[];
  noofuser:number;
  type:"player"|"team"|"venue";
  onlineUsers:Set<string>;
  onAddClick:()=>void;
  jointeamhandler:(teamid:string)=>void
  exitteamhandler:(teamid:string)=>void
  
}

const isTeam = (i: CardItem): i is Team => {
  return "members" in i && "maxPlayers" in i;
};





export default function CardGrid({ items,noofuser,onlineUsers,onAddClick,type,jointeamhandler,exitteamhandler}: CardGridProps) {



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
    <div>
      <div className='flex align-middle justify-center text-6xl p-4'>
      <h1>Users Online: {noofuser}</h1>
      <div>
        {
          type==="team" && 
            <div className="p-3 border-t border-gray-700">
                <button
                  onClick={onAddClick}
                  className="w-full bg-green-600 hover:bg-green-700 text-white px-3 py-2.5 rounded font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>Add New</span>
                </button>
            </div>
        }
      </div>
      </div>
      
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => {
        if(type==="team") return <Card key={item._id} item={item} online={onlineUsers.has(item._id)} jointeamhandler={jointeamhandler} 
                                        usersteam={currentTeam===item._id} exitteamhandler={exitteamhandler}/>
        return <Card key={item._id} item={item} online={onlineUsers.has(item._id)} jointeamhandler={jointeamhandler} usersteam={false}
                exitteamhandler={exitteamhandler} />
      })}
    </div>
</div>
  );
}
