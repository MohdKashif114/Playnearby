export interface Player {
  _id: string;
  name: string;
  sport: 'cricket' | 'football';
  location: string;
  role: string;
  available: string;
  contact: string;
}

export type Member = {
  _id: string;
  name: string;
};

export interface Team {
        _id: string,
        name:string
        sport: string,
        location: string,
        members: Member[],
        createdBy:string,
        status:string,
        maxPlayers:number,
}

export interface Venue {
  _id: string;
  name: string;
  sport: 'cricket' | 'football' | 'both';
  location: string;
  type: string;
  availability: string;
  contact: string;
}

export type TabType = 'players' | 'teams' | 'venues';
export type SportFilter = 'all' | 'cricket' | 'football';

export interface NewEntry {
        name:string
        sport: string,
        location: string,
        members: Member[],
        createdBy:string,
        status:string,
        maxPlayers:number,
}

