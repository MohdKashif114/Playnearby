import { useState } from "react";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import { useAuth } from "../Auth/AuthProvider";

interface Friend {
  name: string;
  _id: string;
}

interface PrivateChatProps {
  onlineUsers: Set<string>;
}

export default function PrivateChat({ onlineUsers }: PrivateChatProps) {
  const [selectedUser, setSelectedUser] = useState<Friend | null>(null);
  const { friends } = useAuth();

  return (
    <div
      className="h-screen flex overflow-hidden"
      style={{
        background: "linear-gradient(160deg, #0f1117 0%, #131720 60%, #0e1420 100%)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* subtle grid texture */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Left panel */}
      <div className="relative w-80 flex-shrink-0 border-r border-white/5 flex flex-col">
        <ChatList
          users={friends}
          selectedUser={selectedUser}
          onSelectUser={setSelectedUser}
          onlineUsers={onlineUsers}
        />
      </div>

      {/* Right panel */}
      <div className="relative flex-1 flex flex-col">
        {selectedUser ? (
          <ChatWindow friend={selectedUser} />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-8">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-violet-600/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-fuchsia-600/8 rounded-full blur-3xl pointer-events-none" />

            <div className="relative w-16 h-16 rounded-3xl bg-gray-800 border border-white/8 flex items-center justify-center shadow-xl">
              <svg className="w-7 h-7 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-400 font-semibold text-sm">No chat selected</p>
              <p className="text-gray-600 text-xs mt-1">Pick a friend from the list to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}