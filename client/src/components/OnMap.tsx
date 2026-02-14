import MapView from "./MapView"
import VenueMarkers from "./VenueMarkers"
import type { Player,Team,Venue } from "../types";
import { Circle } from "react-leaflet";
import { useAuth } from "../Auth/AuthProvider";

type CardItem = Player | Team | Venue;

interface CardGridProps {
  items: CardItem[];
  onlineUsers:Set<string>;
  type:"player"|"team"|"venue";
  radius:number;
}



export default function OnMap({items,onlineUsers,type,radius}:CardGridProps){
    const {user}=useAuth();
    return(
        <div>
            <MapView>
                {
                   type==="player" && (
                        <div>
                            <VenueMarkers venues={items.filter(item=> onlineUsers.has(item._id))}/>
                            {user.location && <Circle
                                            center={[user.location.lat, user.location.lng]}
                                            radius={radius * 1000}
                                        />}
                        </div>
                   )
                     
                    
                }
                {
                    type==="team" && <VenueMarkers venues={items}/>
                }
                {
                type==="venue" && <div>
                                    <VenueMarkers venues={items}/>
                                    {user.location && <Circle
                                        center={[user.location.lat, user.location.lng]}
                                        radius={radius * 1000}
                                    />}

                                  </div>
                }
                
            </MapView>
        </div>
    )
}