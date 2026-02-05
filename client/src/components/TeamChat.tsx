import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider";
import {socket} from "../socket/socket"


type Message = {
  id: string;
  sender: string;
  text: string;
  name:string;
};

export default function TeamChat() {
    const { teamId } = useParams();
    const {user}=useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "Rahul", text: "Hey team 👋",name:"Raul" },
    { id: "2", sender: user.id, text: "Ready to play today?",name:"You"},
  ]);
  const sendMessage = () => {
    if (!message.trim()) return;
    console.log("Sending message:",message);

    socket.emit("send-message",teamId,message,user.name);


    // setMessages((prev) => [
    //   ...prev,
    //   {
    //     id: Date.now().toString(),
    //     sender:user,
    //     text: message,
    //   },
    // ]);

    setMessage("");
  };

  useEffect(()=>{
    socket.on("receive-message",({userId,message,time,name})=>{
        console.log("The message received is : ",message);
        setMessages((prev)=>[
            ...prev,
            {
                id:time.toString(),
                sender:userId,
                text:message,
                name:name
            }
        ])
    })
    setMessage("");
    return ()=>{
        socket.off("receive-message");
    }
  },[]);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white border border-gray-700 rounded-lg">
      
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-lg font-semibold">Team Chat</h1>
        <p className="text-sm text-gray-400">Team ID: {teamId}</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[75%] px-4 py-2 rounded-lg text-sm ${
              msg.sender===user.id
                ? "ml-auto bg-green-600"
                : "mr-auto bg-gray-700"
            }`}
          >
            {msg.sender!=user.id? (
              <p className="text-xs text-gray-300 mb-1">
                {msg.name}
              </p>
            ):(<p className="text-xs text-gray-300 mb-1">You</p>)}
            <p className="">{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700 flex gap-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-1 bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
        />

        <button
          onClick={sendMessage}
          className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium"
        >
          Send
        </button>
      </div>
    </div>
  );
}
