import {  useState , useEffect} from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import CardGrid from './CardGrid';
import AddModal from './AddModal';
import Navbar from './Navbar';
import {socket} from "../socket/socket"
import { Routes, Route, Navigate } from "react-router-dom";
import TeamDetails from './TeamDetails';
import TeamChat from './TeamChat';






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
  
  const [players, setPlayers] = useState<Player[]>([
    
    {
      _id: "1",
      name: 'Rahul Sharma',
      sport: 'cricket',
      location: 'Sigra',
      role: 'Batsman',
      available: 'Weekends',
      contact: '9876543210',
    },
    {
      _id: "2",
      name: 'Amit Kumar',
      sport: 'football',
      location: 'Lanka',
      role: 'Striker',
      available: 'Evenings',
      contact: '9876543211',
    },
    
  ]);
  
  const [teams, setTeams] = useState<Team[]>([]);


  const [venues, setVenues] = useState<Venue[]>([
    {
      _id: "1",
      name: 'Sigra Ground',
      sport: 'both',
      location: 'Sigra',
      type: 'Open Ground',
      availability: 'Daily 6am-8pm',
      contact: 'Free to play',
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
    location: '',
    members:[],
    createdBy:"",
    status:"",
    maxPlayers:0,
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
        selectedSport === 'all' ||
        item.sport === selectedSport ||
        item.sport === 'both';

      const matchesLocation =
        selectedLocation === 'all' || item.location === selectedLocation;

      

      return matchesSport && matchesLocation;
    });
  };

  const handleAddEntry = () => {
    if (!newEntry.name || !newEntry.location) {
      alert('Please fill required fields');
      return;
    }
    console.log("the new team is ",newEntry);
    
      const entry: Team = {
        _id: "2",
        name: newEntry.name,
        sport: newEntry.sport,
        location: newEntry.location,
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
        location: '',
        members: [],
        createdBy:'',
        status:'',
        maxPlayers:0,
    });

    setShowAddModal(false);
  };


  useEffect(()=>{

    const fetchplayers=async()=>{
      try{
        const res=await fetch("http://localhost:5000/fetchallusers",{
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


  },[]);


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
        <TopBar
          activeTab={activeTab}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedSport={selectedSport}
          setSelectedSport={setSelectedSport}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          />

        <div className="flex-1 overflow-y-auto p-6">
              <Routes>
                <Route path="/" element={<Navigate to="players" replace />} />

                <Route
                  path="players"
                  element={
                    <CardGrid
                      items={players}
                      noofuser={noofuser}
                      onlineUsers={onlineUsers}
                      onAddClick={() => setShowAddModal(true)}
                      type="player"
                      jointeamhandler={jointeamhandler}
                      exitteamhandler={exitteamhandler}
                      
                    />
                  }
                />
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
                <Route path=":teamId">
                  <Route index element={<TeamDetails teams={teams} />} />
                  <Route path="chat" element={<TeamChat />} />
                </Route>

                  </Route>

                <Route
                  path="venues"
                  element={
                    <CardGrid
                      items={venues}
                      noofuser={noofuser}
                      onlineUsers={onlineUsers}
                      onAddClick={() => setShowAddModal(true)}
                      type="venue"
                      jointeamhandler={jointeamhandler}
                      exitteamhandler={exitteamhandler}
                      
                    />
                  }
                />
              </Routes>
            </div>

      </div>

      {showAddModal && (
          <AddModal
          activeTab={activeTab}
          newEntry={newEntry}
          setNewEntry={setNewEntry}
          onAdd={handleAddEntry}
          onClose={() => setShowAddModal(false)}
          />
        )}
    </div>
        </>
  );
}
