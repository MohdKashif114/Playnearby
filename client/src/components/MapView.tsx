import { MapContainer, TileLayer } from 'react-leaflet';
import type { ReactNode } from 'react';
import type{ LatLngTuple } from 'leaflet';

interface MapViewProps {
  children?: ReactNode;
}

export default function MapView({ children }: MapViewProps) {
  const center: LatLngTuple = [28.6139, 77.2090]; // Delhi

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {children}
    </MapContainer>
  );
}
