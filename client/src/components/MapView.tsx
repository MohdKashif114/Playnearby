import { MapContainer, TileLayer,useMap } from 'react-leaflet';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import type{ LatLngTuple } from 'leaflet';
import { useAuth } from '@/Auth/AuthProvider';

interface MapViewProps {
  children?: ReactNode;
}


function Recenter({ center }: { center: LatLngTuple }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);

  return null;
}




export default function MapView({ children }: MapViewProps) {
  const {user}=useAuth();
  const center: LatLngTuple = [user.location?.lat??0, user.location?.lng??0]; // Delhi

  return (
    <MapContainer
      center={center}
      zoom={13}
      className="h-screen w-full z-0"
      
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Recenter center={center} />
      {children}
    </MapContainer>
  );
}
