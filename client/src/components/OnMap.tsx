import MapView from "./MapView"
import VenueMarkers from "./VenueMarkers"
import type { Player,Team,Venue } from "../types";
import { Circle,Marker } from "react-leaflet";
import { useAuth } from "../Auth/AuthProvider";
import type { LatLngTuple } from 'leaflet';
import L from "leaflet";

type CardItem = Player | Team | Venue;

interface CardGridProps {
  items: CardItem[];
  onlineUsers:Set<string>;
  type:"player"|"team"|"venue";
  radius:number;
}

const greenIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function OnMap({items,onlineUsers,type,radius}:CardGridProps){
    const {user}=useAuth();
    return(
        <div className="h-full w-full relative z-0">
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
                                    <Marker
                                              icon={greenIcon}
                                              position={[user.location?.lat??0, user.location?.lng??0] as LatLngTuple}
                                            >
                                              
                                            </Marker>
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