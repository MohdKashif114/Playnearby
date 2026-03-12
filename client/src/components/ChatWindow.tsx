import { useEffect, useState, useRef } from "react";
import { useAuth } from "../Auth/AuthProvider";
import { socket } from "../socket/socket";

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

function getInitials(name: string) {
  return name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ?? "??";
}

function getColor(name: string) {
  const colors = ["from-violet-500 to-fuchsia-500", "from-blue-500 to-cyan-500", "from-emerald-500 to-teal-500", "from-orange-500 to-amber-500"];
  return colors[(name?.charCodeAt(0) ?? 0) % colors.length];
}

function formatTime(date: Date) {
  return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function ChatWindow({ friend }: ChatWindowProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:5000/private-message/${friend._id}`, { credentials: "include" });
        if (!res.ok) throw new Error("cant fetch");
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, [friend]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("send-private-message", { senderId: user.id, receiverId: friend._id, text: input });
    setMessages((prev) => [...prev, { id: Date.now().toString(), text: input, sender: user.id, createdAt: new Date() }]);
    setInput("");
  };

  useEffect(() => {
    socket.on("receive-private-message", ({ sender, text, _id }) => {
      setMessages((prev) => [...prev, { id: _id, text, sender, createdAt: new Date() }]);
    });
    return () => { socket.off("receive-private-message"); };
  }, []);

  return (
    <div className="h-full flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/5 bg-gray-950/60 backdrop-blur-sm flex-shrink-0">
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${getColor(friend.name)} flex items-center justify-center text-white text-xs font-bold shadow`}>
          {getInitials(friend.name)}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-100">{friend.name}</p>
          <p className="text-xs text-emerald-400">Online</p>
        </div>
        {/* more options */}
        <button className="ml-auto p-2 rounded-lg text-gray-600 hover:text-gray-300 hover:bg-white/5 transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-700">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getColor(friend.name)} flex items-center justify-center text-white text-lg font-bold mb-3 shadow-lg`}>
              {getInitials(friend.name)}
            </div>
            <p className="text-sm font-semibold text-gray-500">Say hi to {friend.name}!</p>
          </div>
        )}
        {messages.map((msg, i) => {
          const isMe = msg.sender === user.id;
          const prevMsg = messages[i - 1];
          const grouped = prevMsg?.sender === msg.sender;
          return (
            <div key={msg.id} className={`flex items-end gap-2 ${isMe ? "flex-row-reverse" : "flex-row"} ${grouped ? "mt-0.5" : "mt-3"}`}>
              {/* Avatar — only for first in group */}
              {!isMe && (
                <div className={`flex-shrink-0 w-6 h-6 rounded-lg bg-gradient-to-br ${getColor(friend.name)} flex items-center justify-center text-white text-[9px] font-bold ${grouped ? "opacity-0" : ""}`}>
                  {getInitials(friend.name)}
                </div>
              )}
              <div className={`group flex flex-col gap-0.5 max-w-[65%] ${isMe ? "items-end" : "items-start"}`}>
                <div
                  className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    isMe
                      ? "bg-gradient-to-br from-violet-600 to-fuchsia-600 text-white rounded-br-md"
                      : "bg-gray-800 text-gray-100 border border-white/5 rounded-bl-md"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[10px] text-gray-700 px-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {formatTime(msg.createdAt)}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-white/5 bg-gray-950/60 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-2 bg-gray-800/80 border border-white/8 rounded-2xl px-4 py-2.5">
          <input
            type="text"
            className="flex-1 bg-transparent text-sm text-gray-100 placeholder-gray-600 outline-none"
            placeholder={`Message ${friend.name}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all shadow-md hover:shadow-violet-900/40"
          >
            <svg className="w-3.5 h-3.5 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}