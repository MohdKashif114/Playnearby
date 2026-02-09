
import { MapContainer,TileLayer,Marker, useMap } from "react-leaflet";
import { useAuth } from "../Auth/AuthProvider";
import type { LeafletMouseEvent } from 'leaflet';
import LocationPicker from "./LocationPicker";
import { useEffect } from "react";
import type {Team} from "../types/index"
import { useNavigate } from "react-router-dom";

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
  type:string;
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




export default function SetLocation({type}:setlocationProp){
  
  const navigate=useNavigate();
    const {setUser,user}=useAuth();
    

const useCurrentLocation = () => {
  navigator.geolocation.getCurrentPosition(

    (pos) => {
        console.log("current location is:",pos.coords.latitude,"and",pos.coords.latitude);
        
      setUser((prev:userT)=>
        prev
          ? {
              ...prev,
              location: {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
              },
            }
          : prev
      );
    },
    () => {
      alert("Location permission denied");
    }
  );
};


async function reverseGeocode(lat: number, lng: number): Promise<string> {


  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
    {
      headers: {
        Referer: "http://localhost:5173/", // change in prod
      },
    }
  );

  if (!res.ok) throw new Error("Reverse geocode failed");

  const data = await res.json();

  return (
    data.address?.suburb ||
    data.address?.neighbourhood ||
    data.address?.city ||
    data.address?.town ||
    data.address?.state ||
    "Unknown area"
  );
}




const setlocationhandler=async()=>{
    try{
        if(!user.location?.lat || !user.location?.lat){
            alert("Please select a valid location");
            return;
        }

        const { lat, lng } = user.location;

        
        let areaName = "";
        try {
            areaName = await reverseGeocode(lat, lng);
        } catch {
            areaName = "Unknown area";
        }

        console.log("the area of user is ",areaName);
        const res=await fetch("http://localhost:5000/setlocation",{
            credentials: "include",
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                    location:user?.location,
                    area:areaName
            }),
        })

        if (!res.ok) throw new Error("Location not set");

        const data = await res.json();
        console.log("The respose is",data.message)
        navigate("/mainpage")

    }catch(err){
        console.log("Error setting location",err);
    }
}





    
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
                        
                                setUser((prev:userT) =>
                                prev
                                ? {
                                    ...prev,
                                    location: { lat, lng },
                                    }
                                : prev
                            );
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

                <button onClick={useCurrentLocation}>Use Current Location</button>
                {
                    user?.location && (
                        <button onClick={setlocationhandler}>
                            Confirm location
                        </button>
                    ) 
                }
        </div>
    );
}