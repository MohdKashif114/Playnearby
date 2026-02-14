import {  useState , useEffect} from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import CardGrid from './CardGrid';
import AddModal from './AddModal';
import Navbar from './Navbar';
import {socket} from "../socket/socket"
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import TeamDetails from './TeamDetails';
import TeamChat from './TeamChat';
import OnMap from './OnMap';
import { useLocation } from 'react-router-dom';




import type {
  Player,
  Team,
  Venue,
  TabType,
  SportFilter,
  NewEntry,
} from '../types';
import { useAuth } from '../Auth/AuthProvider';

type Props={
  noofuser:number;
  onlineUsers:Set<string>;
};

// export const socket = io("http://localhost:5000");




export default function SportsFinderApp({noofuser,onlineUsers}:Props) {
  const [activeTab, setActiveTab] = useState<TabType>('players');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState<SportFilter>('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const {currentTeam,setCurrentTeam}=useAuth();
  const navigate=useNavigate();
  const {user}=useAuth();
  const location=useLocation();
  const [radius,setRadius]=useState<number>(5);


  if(location.pathname.includes("players")){
    ()=> setActiveTab("players")
  }else if(location.pathname.includes("teams")){
    ()=>setActiveTab("teams")
  }else{
    ()=>setActiveTab("venues")
  }
  const [players, setPlayers] = useState<Player[]>([
    
    {
      _id: "1",
      name: 'Rahul Sharma',
      sport: 'cricket',
      area: 'Sigra',
      location:{
        lat:0,
        lng:0
      },
      role: 'Batsman',
      available: 'Weekends',
      contact: '9876543210',
      profileImage:"",
      distanceKm:""
    },
    {
      _id: "2",
      name: 'Amit Kumar',
      sport: 'football',
      area: 'Sigra',
      location:{
        lat:0,
        lng:0
      },
      role: 'Striker',
      available: 'Evenings',
      contact: '9876543211',
      profileImage:"",
      distanceKm:""
    },
    
  ]);
  
  const [teams, setTeams] = useState<Team[] >([]);


  const [venues, setVenues] = useState<Venue[]>([ 
    {
      _id: "1",
      name: 'Sigra Ground',
      sport: 'both',
      location:{
        lat:1,
        lng:1,
      },
      area:"unknown",
      type: 'Open Ground',
      availability: 'Daily 6am-8pm',
      contact: 'Free to play',
      profileImage:"",
      distanceKm:""
    },
  ]);
  
  useEffect(() => {
    socket.on("teams-updated", (teams) => {
      setTeams(teams);
    });
  
    socket.on("team-error", (err) => {
      alert(err.message);
    });
  
    return () => {
      socket.off("teams-updated");
      socket.off("team-error");
    };
  }, []);


  const [newEntry, setNewEntry] = useState<NewEntry>({
    name: '',
    sport: 'cricket',
    location:{
      lat:0,
      lng:0
    },
    area:"",
    members:[],
    createdBy:"",
    status:"",
    maxPlayers:0,
    type:""
  });
        

  

  const filteredData = () => {
  const data =
    activeTab === 'players'
      ? players
      : activeTab === 'teams'
      ? teams
      : venues;

  return data.filter((item) => {
    const matchesSport =
      selectedSport === "all" ||
      item.sport.toLowerCase() === selectedSport;

    const matchesLocation =
      selectedLocation === "all";

    return matchesSport && matchesLocation;
  });
};


  const fetchNearbyVenues = async (radius: number) => {
    if (!user?.location) return;
    try{
      const { lat, lng } = user.location;
  
      const res = await fetch(
        `http://localhost:5000/venues/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
        {
          credentials: "include",
        },
      );
  
      const data = await res.json();
      console.log("venues are:",data);
      setVenues(data.Venues);

    }catch(err){
      console.log("error fetching",err);
    }
  };

  const fetchNearbyPlayers = async (radius: number) => {
    if (!user?.location) return;
    try{
      const { lat, lng } = user.location;
  
      const res = await fetch(
        `http://localhost:5000/players/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
        {
          credentials: "include",
        },
      );
  
      const data = await res.json();
      console.log("players are:",data);
      setPlayers(data.Players);

    }catch(err){
      console.log("error fetching",err);
    }
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



  const handleAddEntry = async() => {
    if (!newEntry.name || !newEntry.location) {
      alert('Please fill required fields');
      return;
    }

    let areaName = "";
        try {
            areaName = await reverseGeocode(newEntry.location.lat, newEntry.location.lng);
        } catch {
            areaName = "Unknown area";
        }

        newEntry.area=areaName;

    console.log("the new team is ",newEntry);
    
      const entry: Team = {
        _id: "2",
        name: newEntry.name,
        sport: newEntry.sport,
        area: newEntry.area,
        location:{
          lat:newEntry.location?.lat,
          lng:newEntry.location?.lng
        },
        members: newEntry.members,
        createdBy:newEntry.createdBy,
        status:newEntry.status,
        maxPlayers:newEntry.maxPlayers,
      };
      console.log(entry);
      socket.emit("ping-test","this is data");
      socket.emit("create-team",entry);

      
      
    

    setNewEntry({
        name: '',
        sport: '',
        location:{
          lat:0,
          lng:0
        },
        area:"",
        members: [],
        createdBy:'',
        status:'',
        maxPlayers:0,
        type:""
    });

    setShowAddModal(false);
  };


  const  handleVenueAddEntry=async()=>{
        console.log("The new venue entry is ",newEntry);
        let areaName=""
        try{
          areaName=await reverseGeocode(newEntry.location?.lat,newEntry.location?.lng)
        }catch{
          areaName="Unknown"
        }
        newEntry.area=areaName;
        try{
          const res=await fetch("http://localhost:5000/addvenue",{
            credentials: "include",
            method:"POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newEntry),
            })
            
            if(!res.ok) throw new Error("Cant add Venue")



        }catch(err){
          console.log("some error occurred while adding venue",err);
        }
        setShowAddModal(false);
  }


  useEffect(()=>{

    const fetchplayers=async()=>{
      try{
        const res=await fetch(`http://localhost:5000/fetchallusers/${user?.city}`,{
          credentials:"include",
        });
        const data=await res.json();
        console.log("fetched players are:",data);
        if(data){
          setPlayers(data.Users);
        }


        
      }catch(err){
        console.log("Cant fetch Players",err);
      }
    }
    fetchplayers();

  },[user]);

  useEffect(() => {

    const fetchVenues = async () => {
      try {
        const res = await fetch("http://localhost:5000/fetchallvenues", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch venues");
        }

        const data = await res.json();
        console.log("fetched venues are:", data);

        if (data?.Venues) {
          setVenues(data.Venues);
        }

      } catch (err) {
        console.log("Cant fetch Venues", err);
      }
    };

    fetchVenues();

  }, []);





  const jointeamhandler=(teamid:string)=>{
    socket.emit("join-team",teamid);
    setCurrentTeam(teamid);
  }
  
  const exitteamhandler=(teamid:string)=>{
    socket.emit("exit-team",teamid);
    setCurrentTeam(null);
  }

  useEffect(() => {
  const onTeamId = (teamId: string) => {
    console.log("in sportfinder component team is ",teamId);
    setCurrentTeam(teamId);
  };

  const onTeamsUpdated = (teams: Team[]) => {
    setTeams(teams);
  };

  const onTeamError = (err: { message: string }) => {
    alert(err.message);
    setCurrentTeam(null);
  };

  socket.on("get-team-id", onTeamId);
  socket.on("teams-updated", onTeamsUpdated);
  socket.on("team-error", onTeamError);

  return () => {
    socket.off("get-team-id", onTeamId);
    socket.off("teams-updated", onTeamsUpdated);
    socket.off("team-error", onTeamError);
  };
}, []);

  

  


  return (
    <>
        
    <div className="min-h-screen bg-gray-900 flex">

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onAddClick={() => setShowAddModal(true)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        {!location.pathname.includes("friends-chat") && <TopBar
            activeTab={activeTab}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedSport={selectedSport}
            setSelectedSport={setSelectedSport}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            filterdata={filteredData}
            fetchNearbyVenues={fetchNearbyVenues}
            fetchNearbyPlayers={fetchNearbyPlayers}
            setRadius={setRadius}

          />}

        <div className="flex-1 overflow-y-auto p-6">
              <Routes>
                <Route path="/" element={<Navigate to="players" replace />} />
                  
                  <Route path="players" >
                    <Route index element={
                        <CardGrid
                          items={filteredData()}
                          noofuser={noofuser}
                          onlineUsers={onlineUsers}
                          onAddClick={() => setShowAddModal(true)}
                          type="player"
                          jointeamhandler={jointeamhandler}
                          exitteamhandler={exitteamhandler}
                        />
                      } />
                    <Route path="map" element={<OnMap items={filteredData()} onlineUsers={onlineUsers} type={"player"} radius={radius}/>}/>
                  </Route>
                <Route path="teams">

                <Route
                  index
                  element={
                    <CardGrid
                    items={teams}
                    noofuser={noofuser}
                    onlineUsers={onlineUsers}
                    onAddClick={() => setShowAddModal(true)}
                    type='team'
                    jointeamhandler={jointeamhandler}
                    exitteamhandler={exitteamhandler}
                    />
                  }
                />
                
                <Route path="map" element={<OnMap items={filteredData()} onlineUsers={onlineUsers} type={"team"} radius={radius}/>}/>
                <Route path=":teamId">
                  <Route index element={<TeamDetails teams={teams} />} />
                  <Route path="chat" element={<TeamChat />} />
                </Route>

                  </Route>

                <Route
                  path="venues"
                  
                >
                  <Route index 
                        element={
                            <CardGrid
                            items={filteredData()}
                            noofuser={noofuser}
                            onlineUsers={onlineUsers}
                            onAddClick={() => setShowAddModal(true)}
                            type="venue"
                            jointeamhandler={jointeamhandler}
                            exitteamhandler={exitteamhandler}
                          />
                        }
                    />
                    <Route path="map"  element={<OnMap items={filteredData()} onlineUsers={onlineUsers} type={"venue"} radius={radius}/>} />
                </Route>
              </Routes>
            </div>

      </div>

      {showAddModal && (
          <AddModal
          newEntry={newEntry}
          setNewEntry={setNewEntry}
          onAdd={handleAddEntry}
          onVenueAdd={handleVenueAddEntry}
          onClose={() => setShowAddModal(false)}
          />
        )}
    </div>
        </>
  );
}
