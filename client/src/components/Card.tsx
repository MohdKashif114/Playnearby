import { MapPin } from 'lucide-react';
import type { Player, Team, Venue } from '../types';
import { useAuth } from '../Auth/AuthProvider';
import {Link} from "react-router-dom"


type CardItem = Player | Team | Venue;

interface CardProps {
  item: CardItem;
  online:boolean;
  jointeamhandler:(teamid:string)=>void;
  usersteam:boolean;
  exitteamhandler:(teamid:string)=>void;
}








export default function Card({ item ,online,jointeamhandler,usersteam,exitteamhandler}: CardProps) {


  const {currentTeam,setCurrentTeam,user,friends}=useAuth();


  const isPlayer = (i: CardItem): i is Player =>
    'role' in i && 'available' in i;

  const isTeam = (i: CardItem): i is Team =>
    'members' in i && 'maxPlayers' in i;

  const isVenue = (i: CardItem): i is Venue =>
    'type' in i;


  const sendrequesthandler=async()=>{
    const playerid=item._id;
    const userid=user.id;
    console.log("player id is ",playerid);
    try{
      const res=await fetch(`http://localhost:5000/send-request/${playerid}`,{
            credentials: "include",
            method:"POST",
            headers: {
              "Content-Type": "application/json",
            },
         })
         if(!res.ok) throw new Error("Error while sending request");
         const data=await res.json();
         console.log(data.message);

    }catch(err){
      console.log("Cant send request",err);
    }


  }
  
    console.log("friends are from array:",friends)
     const friendIds = new Set(friends?.map(f => f._id)||[]);
    console.log("friends are from set",friendIds);
 


  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 hover:bg-gray-750 transition-colors border border-gray-700 flex gap-10 align-middle items-center">
      {/* Header */}
      <div>

      <div className="flex justify-between items-start mb-4">
        <div>
          <div className='flex gap-3 items-center justify-center'>

            <h3 className={`text-xl font-bold ${isTeam(item) && usersteam?("text-green-500"):("text-gray-100")}`}>{item.name}</h3><span
              className={`inline-block w-3 h-3 rounded-full ${
                online ? "bg-green-500" : "bg-gray-500"
              }`}
              ></span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="space-y-2 text-gray-300">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{item.area}</span>
        </div>
        {!isPlayer(item) && <div className="flex items-center gap-2">
          
          <strong className='text-gray-400'>Sport:</strong><span>{item.sport}</span>
        </div>}

        {isPlayer(item) && (
          <>
            <div>
              <strong className="text-gray-400">Role:</strong> {item.role}
            </div>
            {!friendIds.has(item._id)? 
            (<div>
              <button onClick={sendrequesthandler}>Send Friend Request</button>
            </div>):(
              <div>
                <button onClick={sendrequesthandler}>Remove Friend</button>
              </div>
            )}
            
          </>
        )}

        {isTeam(item) && (
          <>
            <div>
              <strong className="text-gray-400">Current Players:</strong>{' '}
              {item.members.length}/{item.maxPlayers}
            </div>
            {currentTeam===null?
            (
              <div>
              <button onClick={()=>jointeamhandler(item._id)}>Join Team</button>
            </div>):
            (usersteam && <div className='flex justify-center align-middle gap-2'>
              <button onClick={()=>exitteamhandler(item._id)}>Exit Team</button>
              <Link to={item._id}>View Team</Link>
            </div>
            )
          }
          </>
        )}

        {isVenue(item) && (
          <>
            <div>
              <strong className="text-gray-400">Type:</strong> {item.type}
            </div>
            
          </>
        )}
      </div>
        </div>
      <div>

        <img
          src="https://hancockogundiyapartners.com/wp-content/uploads/2019/07/dummy-profile-pic-300x300.jpg"
          alt="profile"
          className="h-14 w-14 rounded-full object-cover"
          />
        </div>

    </div>
  );
}
