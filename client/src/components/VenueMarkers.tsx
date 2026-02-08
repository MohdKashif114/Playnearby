import { Marker, Popup } from 'react-leaflet';
import type { Venue ,Player,Team} from '../types/index';
import type { LatLngTuple } from 'leaflet';

type CardItem = Player | Team | Venue;


interface Props {
  venues: CardItem[];
}

export default function VenueMarkers({ venues }: Props) {
  return (
    <>
      {venues.map(v => (
        <Marker
          key={v._id}
          position={[v.location?.lat, v.location?.lng] as LatLngTuple}
        >
          <Popup>
            <strong>{v.name}</strong><br />
            Sport: {v.sport}
          </Popup>
        </Marker>
      ))}
    </>
  );
}
