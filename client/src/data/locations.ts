import type { Venue } from "../types/index";
export const locations = [
  'Sigra',
  'Lanka',
  'Nadesar',
  'Varanasi Cantt',
  'Bhelupur'
];


export const dummyVenues: Venue[] = [
  {
    _id: 'v1',
    name: 'Green Field Sports Ground',
    sport: 'football',
    location:{
      lat: 28.6143,
      lng: 77.2097,
    },
    area:"unknown",
    type: 'Outdoor Turf',
    availability: '9:00 AM - 9:00 PM',
    contact: '9876543210',
  },
  
];

