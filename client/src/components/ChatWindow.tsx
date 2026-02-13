import { useEffect, useState } from "react";
import { useAuth } from "../Auth/AuthProvider";
import {socket} from "../socket/socket"


interface User {
  _id: string;
  name: string;
  avatar?: string;
}

 interface Message {
  id: string;
  text: string;
  sender: string;
  createdAt: Date;
}




interface ChatWindowProps {
  friend: User;
  
}

export default function ChatWindow({ friend }: ChatWindowProps) {
  const {user}=useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello 👋",
      sender: "them",
      createdAt: new Date(),
    },
    {
      id: "2",
      text: "Hi!",
      sender: "me",
      createdAt: new Date(),
    },
  ]);

  const [input, setInput] = useState<string>("");


  useEffect(()=>{
    const fetchmessage=async()=>{

      try{
        const res=await fetch(`http://localhost:5000/private-message/${friend._id}`,{
          credentials:"include",
        })
  
        if(!res.ok) throw new Error("cant fetch messages:(");
        const data=await res.json();
        console.log("messages are:",data);

        setMessages(data);

      }catch(err){
        console.log("cant fetch messages",err);
      }
    }

    fetchmessage();
    
  },[friend]);




  const sendMessage = () => {
    if (!input.trim()) return;
    console.log("message is :",input);
    socket.emit("send-private-message", {
      senderId: user.id,
      receiverId: friend._id,
      text:input,
    });


    const newMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: user.id,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
  };

  useEffect(()=>{
    socket.on("receive-private-message",({sender,text,_id})=>{
      const newMessage:Message={
        id:_id,
        text:text,
        sender:sender,
        createdAt:new Date()
      }

      setMessages((prev)=>[...prev,newMessage])
    })

    return () => {
      socket.off("receive-private-message");
    };
  },[]);







  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-white font-semibold">
        {friend.name}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-xs px-4 py-2 rounded-lg ${
              msg.sender === user.id
                ? "bg-green-500 text-white ml-auto"
                : "bg-white border"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded-lg px-4 py-2 outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button
          onClick={sendMessage}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
