import { useState,createContext,useContext } from "react";


interface AuthProviderProps {
  children: React.ReactNode;
}

 interface User {
  _id: string;
  name: string;
  email?: string;
}


 interface FriendRequest {
  _id: string;
  sender: User;
}


interface userT{
  name:string;
  id:string;
  sport:string;
  location?:{
    lat:number;
    lng:number;
  };
  area:string;
  role:string;
  bio:string;
  profileImage:string;
  contact:string;
  city:string;
  currentTeam:string|null;
}

interface Friend{
  name:string;
  _id:string;
}


interface Team {
  _id: string;
  name: string;
}

 interface TeamInvitation {
  _id: string;
  team: Team;
  invitedBy: User;
}

interface Authprops{
  user:userT;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  currentTeam:string;
  setCurrentTeam:React.Dispatch<React.SetStateAction<any>>;
  friends:Friend[];
  setFriends:React.Dispatch<React.SetStateAction<any>>;
  friendRequests:FriendRequest[];
  setFriendRequests:React.Dispatch<React.SetStateAction<FriendRequest[]>>;
  teamInvites:TeamInvitation[];
  setTeamInvites:React.Dispatch<React.SetStateAction<TeamInvitation[]>>;
}

const AuthContext=createContext<Authprops|undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<userT>({
    name:"",
    id:"",
    sport:"",
    location:undefined,
    area:"",
    role:"",
    bio:"",
    profileImage:"",
    contact:"",
    city:"",
    currentTeam:null
  });
  const [currentTeam,setCurrentTeam] = useState<string>("");
  const [friends,setFriends]=useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [teamInvites, setTeamInvites] = useState<TeamInvitation[]>([]);

  return (
    <AuthContext.Provider value={{ user, setUser,currentTeam,setCurrentTeam,friends,setFriends,friendRequests,setFriendRequests,
                                    teamInvites,setTeamInvites
     }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = (): Authprops => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
};

