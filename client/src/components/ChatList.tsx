interface Friend {
  name: string;
  _id: string;
}

interface ChatListProps {
  users: Friend[];
  selectedUser: Friend | null;
  onSelectUser: (user: Friend) => void;
  onlineUsers: Set<string>;
}

function getInitials(name: string) {
  return name?.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() ?? "??";
}

function getColor(name: string) {
  const colors = [
    "from-violet-500 to-fuchsia-500",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-orange-500 to-amber-500",
    "from-pink-500 to-rose-500",
    "from-indigo-500 to-blue-500",
  ];
  return colors[(name?.charCodeAt(0) ?? 0) % colors.length];
}

export default function ChatList({ users, selectedUser, onSelectUser, onlineUsers }: ChatListProps) {
  return (
    <div className="h-full flex flex-col" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/5">
        <h2 className="text-base font-black tracking-wide text-white">Messages</h2>
        <p className="text-xs text-gray-500 mt-0.5">{users.length} conversations</p>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-white/5">
        <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent text-sm text-gray-300 placeholder-gray-600 outline-none flex-1"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto py-2">
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-gray-600">
            <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm">No friends yet</p>
          </div>
        ) : (
          users.map((user) => {
            const isSelected = selectedUser?._id === user._id;
            const isOnline = onlineUsers?.has(user._id);
            return (
              <button
                key={user._id}
                onClick={() => onSelectUser(user)}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-all text-left relative ${
                  isSelected
                    ? "bg-violet-600/15 border-r-2 border-violet-500"
                    : "hover:bg-white/4 border-r-2 border-transparent"
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${getColor(user.name)} flex items-center justify-center text-white text-xs font-bold shadow-lg`}>
                    {getInitials(user.name)}
                  </div>
                  {isOnline && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-gray-950 shadow-[0_0_6px_rgba(52,211,153,0.6)]" />
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm font-semibold truncate ${isSelected ? "text-violet-300" : "text-gray-200"}`}>
                      {user.name}
                    </span>
                    <span className="text-[10px] text-gray-600 ml-2 flex-shrink-0">now</span>
                  </div>
                  <p className="text-xs text-gray-600 truncate mt-0.5">Tap to open chat</p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}