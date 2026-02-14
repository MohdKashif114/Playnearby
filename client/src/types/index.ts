export interface Player {
  _id: string;
  name: string;
  sport: 'cricket' | 'football';
  location: {
    lat:number;
    lng:number;
  };
  area:string;
  role: string;
  available: string;
  contact: string;
  profileImage:string;
  distanceKm:string;
}

export type Member = {
  _id: string;
  name: string;
};

export interface Team {
        _id: string,
        name:string
        sport: string,
        location: {
          lat:number;
          lng:number;
        };
        area:string;
        members: Member[],
        createdBy:string,
        status:string,
        maxPlayers:number,
        
}

export interface Venue {
  _id: string;
  name: string;
  sport: 'cricket' | 'football' | 'both';
  location: {
    lat:number;
    lng:number;
  };
  area:string;
  type: string;
  availability: string;
  contact: string;
  profileImage:string;
  distanceKm:string;
}

export type TabType = 'players' | 'teams' | 'venues';
export type SportFilter = 'all' | 'cricket' | 'football';

export interface NewEntry {
        name:string
        sport: string,
        area: string,
        location: {
          lat:number;
          lng:number;
        };
        members: Member[],
        createdBy:string,
        status:string,
        maxPlayers:number,
        type:string
}

