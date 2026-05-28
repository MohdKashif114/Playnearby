
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import { useAuth } from "../Auth/AuthProvider";
import LocationPicker from "./LocationPicker";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Navigation, Check } from "lucide-react";

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




export default function SetLocation(){
  
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


async function reverseGeocode(lat: number, lng: number): Promise<{area:string;city:string}> {

  try{
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
    console.log("the location is ",data);
  
    return (
      {
        area:data?.address.suburb || "Unknown",
        city:data?.address.city || "Unknown"
      }
      
    );

  }catch(err){
    console.log("geocode not working",err);
    return({area:"Unknown",city:"Unknown"})
  }
}




const setlocationhandler=async()=>{
    try{
        if(!user.location?.lat || !user.location?.lat){
            alert("Please select a valid location");
            return;
        }

        const { lat, lng } = user.location;

        
        let areacityName = {area:"",city:""};
        try {
            areacityName = await reverseGeocode(lat, lng);
        } catch {
            areacityName = {area:"Unknown area",city:"Unknown"};
        }

        console.log("the area of user is ",areacityName);
        const res=await fetch(`${import.meta.env.VITE_API_URL}/setlocation`,{
            credentials: "include",
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                    location:user?.location,
                    area:areacityName.area,
                    city:areacityName.city
            }),
        })

        if (!res.ok) throw new Error("Location not set");

        const data = await res.json();
        setUser((prev:userT)=>
        prev
          ? {
              ...prev,
              area:areacityName.area,
              city:areacityName.city,
            }
          : prev
      );
        console.log("The respose is",data.message)
        navigate("/mainpage")

    }catch(err){
        console.log("Error setting location",err);
    }
}





    
    return (
      <div className="min-h-[calc(100vh-5rem)] bg-[#0B0F14] flex items-center justify-center p-4 sm:p-8 relative">
        {/* Subtle decorative background glow blobs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-2xl rounded-3xl border border-gray-800 bg-[#11161D]/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative">
          <div className="flex flex-col items-center mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3 text-indigo-400">
              <MapPin size={24} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white text-center tracking-tight">
              Set Your Location
            </h1>
            <p className="text-gray-500 text-xs sm:text-sm text-center mt-2 max-w-md">
              Pin your location on the map to find active sports partners, team matches, and venues near you.
            </p>
          </div>

          <div className="h-80 w-full rounded-2xl overflow-hidden border border-gray-800 shadow-inner relative z-0">
            <MapContainer
              center={[28.6139, 77.2090]}
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              
              <MapCenterer lat={user.location?.lat??null} lng={user.location?.lng??null}/>

              <LocationPicker
                onSelect={(lat, lng) => {
                  console.log("Setting location to ", lat, "and", lng);
                  setUser((prev: any) =>
                    prev
                      ? {
                          ...prev,
                          location: { lat, lng },
                        }
                      : prev
                  );
                }}
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

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6">
            <button
              onClick={useCurrentLocation}
              className="flex-1 py-3 px-4 rounded-xl border border-indigo-500/20 text-indigo-400 font-semibold text-sm hover:bg-indigo-500/10 hover:border-indigo-500/45 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Navigation size={16} />
              Use Current Location
            </button>

            {user?.location && (
              <button
                onClick={setlocationhandler}
                className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check size={16} />
                Confirm Location
              </button>
            )}
          </div>
        </div>
      </div>
    );
}