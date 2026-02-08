import { Marker, useMapEvents } from "react-leaflet";
import type { LeafletMouseEvent } from "leaflet";

interface LocationPickerProps {
  onSelect: (lat: number, lng: number) => void;
}

export default function LocationPicker({ onSelect }: LocationPickerProps) {
  useMapEvents({
    click(e: LeafletMouseEvent) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}
