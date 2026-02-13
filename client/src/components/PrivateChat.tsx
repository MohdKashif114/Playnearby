import { useEffect, useState } from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import { useAuth } from "../Auth/AuthProvider";


interface User {
  _id: string;
  name: string;
  email:string;
}

 interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  createdAt: Date;
}

interface Friend{
  name:string;
  _id:string;
}

interface PrivateChatProps{
  onlineUsers:Set<string>;
}



const dummyUsers: User[] = [

];

export default function PrivateChat({onlineUsers}:PrivateChatProps) {
  const [selectedUser, setSelectedUser] = useState<Friend | null>(null);
    const {friends}=useAuth();

    // useEffect(()=>{
    //     const fetchfriends=async()=>{
    //         console.log("in fetch friends");
    //         try{
    //             const res=await fetch("http://localhost:5000/my-friends",{
    //                 credentials:"include"
    //             })
    //             const data=await res.json();
    //             console.log(data);
    //             setSelectedUser(data);

    //         }catch(err){
    //             console.log("cant fetch friends",err);
    //         }
    //     }
    //     fetchfriends();
    // },[]);

    // useEffect(()=>{
    //     setSelectedUser(friends);
    // },[])


  return (
    <div className="h-screen flex bg-gray-100">
      {/* Left Panel */}
      <div className="w-1/3 border-r bg-white">
        <ChatList
          users={friends}
          selectedUser={selectedUser}
          onSelectUser={setSelectedUser}
          onlineUsers={onlineUsers}
        />
      </div>

      {/* Right Panel */}
      <div className="w-2/3 bg-gray-50">
        {selectedUser ? (
          <ChatWindow friend={selectedUser} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}

