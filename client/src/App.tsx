

import './App.css'
import SportsFinderApp from './components/SportsFinderApp'
import SetLocation from './components/SetLocation';

import { useState,useEffect } from 'react';
import {socket} from "./socket/socket"
import Navbar from './components/Navbar';
import {Routes,Route, useNavigate} from "react-router-dom"
// import { Sign } from 'crypto';
import Signup from "./components/Signup"
import Login from './components/Login';
import { AuthProvider, useAuth } from './Auth/AuthProvider';
import ProtectedRoute from "./routes/ProtectedRoute"
import 'leaflet/dist/leaflet.css';
import Notifications from './components/Notifications';
import PrivateChat from './components/PrivateChat';
import Profile from './components/Profile';







function App() {
  
    const [loggedin,setloggedin] = useState<boolean>(false);
    const [userid,setuserid]=useState<string>("");
    const navigate=useNavigate();
    const [noofusers,setNoofuser]=useState<number>(0);
    const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());


    const {user,setUser,setCurrentTeam,currentTeam,friends,setFriends}=useAuth();



        useEffect(() => {
            const fetchUser = async () => {
              try {
                const res = await fetch("http://localhost:5000/authenticate", {
                  credentials: "include",
                });

                if (!res.ok) throw new Error("Not logged in");

                const data = await res.json();
                console.log("The data after fetching is :",data);
                setUser({
                  name:data.name,
                  id:data._id,
                  sport:data.sport,
                  location:data.location,
                  area:data.area,
                  role:data.role,
                  profileImage:data.profileImage,
                  contact:data.contact,
                  bio:data.bio

                });
                console.log("current team is ",data.currentTeam);
                setCurrentTeam(data.currentTeam);
                // navigate("/mainpage");
                
              } catch {
                setUser({});
              } 
            };

            fetchUser();
          }, []);


          useEffect(()=>{
              const fetchfriends=async()=>{
                try{
                  const res=await fetch("http://localhost:5000/my-friends",{
                    credentials:"include"
                  });
                  
                  const data=await res.json();
                  console.log("friends are:",data);
                  setFriends(data);
                }catch(err){
                  console.log("cant fetch friends",err)
                }
              }
              fetchfriends();

          },[]);



    useEffect(() => {
      console.log("in socket function...", user);
      if (user?.id=='') return;
      const tempid=user.id;
      console.log(tempid);
      socket.auth = { user: {
        name:user.name,
        id:user.id,
        location:user.location,
        sport:user.sport
      } };
      socket.connect();

      const onConnect = () => {
        console.log("heelooo");
        console.log("Connected from frontend....", socket.id);
        socket.emit("user-online", user.id);
      };

      const onDisconnect = () => {
        console.log("Disconnected");
      };

      const onOnlineUsers = (users: string[]) => {
        const usersSet = new Set<string>(users);
        setNoofuser(users.length);
        setOnlineUsers(usersSet);
        console.log("Number of online user:", users);
      };

      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);
      socket.on("online-users", onOnlineUsers);

      return () => {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        socket.off("online-users", onOnlineUsers);
      };
    }, [user]);



  useEffect(() => {
    const onUserJoined = (userId: string) => {
      console.log("user joined with id", userId);
    };

    socket.on("user-joined-room", onUserJoined);

    return () => {
      socket.off("user-joined-room", onUserJoined);
    };
  }, [currentTeam]);



  


  const logouthandler=async()=>{
    try{
      const res=await fetch("http://localhost:5000/auth/logout",{
         credentials: "include",
            method:"POST",
      });

      if (!res.ok) {
            throw new Error("Logout failed");
          }


      setUser("");
      socket.disconnect();


    }catch(err){
      console.log("Cant logout",err);
    }
  }


    useEffect(() => {
      if (!currentTeam) return;
      socket.emit("rejoin-team", currentTeam);
    }, [currentTeam]);


    


 


  return (
    <>
      {/* <Navbar loggedin={loggedin}/> */}
      <Navbar
              loggedin={loggedin}
              
              logouthandler={logouthandler}
              />
      <Routes>
          <Route path='/mainpage/*'
            element={
              <ProtectedRoute>
                <SportsFinderApp noofuser={noofusers} onlineUsers={onlineUsers}/> 
              </ProtectedRoute>
            }
          />
          <Route path='/set-location'
            element={
              <ProtectedRoute>
                  <SetLocation type="Player"/>
              </ProtectedRoute>
            }
          />
          
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/signup' element={<Signup/>}></Route>
          <Route path='/notifications' element={<Notifications/>}></Route>
          <Route path='/private-chats' element={<PrivateChat onlineUsers={onlineUsers}/>}></Route>
          <Route path='/profile' element={<Profile/>}></Route>
      </Routes>
    </>
  )
}

export default App
