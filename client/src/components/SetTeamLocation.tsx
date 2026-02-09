
import { MapContainer,TileLayer,Marker, useMap } from "react-leaflet";
import { useAuth } from "../Auth/AuthProvider";
import type { LeafletMouseEvent } from 'leaflet';
import LocationPicker from "./LocationPicker";
import { useEffect } from "react";
import type {Team} from "../types/index"

interface userT{
  name:string;
  id:string;
  sport:string;
  location?:{
    lat:number;
    lng:number;
  };
}



interface MapCentererProps {
  lat: number | null;
  lng: number | null;
  
}
interface setlocationProp{
  onchange:(lat:number,lng:number)=>void;

}

function MapCenterer({ lat, lng }: MapCentererProps) {
  const map = useMap();

  useEffect(() => {
    if (lat !== null && lng !== null) {
      map.setView([lat, lng], 15, {
        animate: true,
      });
    }
  }, [lat, lng, map]);

  return null;
}




export default function SetTeamLocation({onchange}:setlocationProp){

    const {setUser,user}=useAuth();
    

const useCurrentLocation = () => {
  navigator.geolocation.getCurrentPosition(

    (pos) => {
        console.log("current location is:",pos.coords.latitude,"and",pos.coords.longitude);
        
      onchange(pos.coords.latitude,pos.coords.longitude);
    },
    () => {
      alert("Location permission denied");
    }
  );
};













    
    return(
        <div>
            <h1>Set Location</h1>
            <MapContainer
                center={[28.6139, 77.2090]}
                zoom={13}
                style={{ height: "300px" }}
                >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                
                <MapCenterer lat={user.location?.lat??null} lng={user.location?.lng??null}/>


                <LocationPicker
                    onSelect={(lat, lng) => {
                        console.log("Setting locaiont to ",lat,"and",lng);
                            onchange(lat,lng);
                        }
                        
                      }
                />
              {user?.location &&
                typeof user.location.lat === "number" &&
                typeof user.location.lng === "number" && (
                  <Marker
                    position={[
                      user.location.lat,
                      user.location.lng,
                    ]}
                  />
                )}

                </MapContainer>

                
        </div>
    );
}