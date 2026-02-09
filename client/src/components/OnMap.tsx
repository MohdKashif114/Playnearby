import MapView from "./MapView"
import VenueMarkers from "./VenueMarkers"
import type { Player,Team,Venue } from "../types";

type CardItem = Player | Team | Venue;

interface CardGridProps {
  items: CardItem[];
  onlineUsers:Set<string>;
  type:"player"|"team"|"venue";
}



export default function OnMap({items,onlineUsers,type}:CardGridProps){
    return(
        <div>
            <MapView>
                {
                   type==="player" && <VenueMarkers venues={items.filter(item=> onlineUsers.has(item._id))}/>
                }
                {
                    type==="team" && <VenueMarkers venues={items}/>
                }
                {
                    type==="venue" && <VenueMarkers venues={items}/>
                }
                
            </MapView>
        </div>
    )
}