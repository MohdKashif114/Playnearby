interface User {
  _id: string;
  name: string;
  email:string;
}

interface Friend{
  name:string;
  _id:string;
}

interface ChatListProps {
  users: Friend[];
  selectedUser: Friend | null;
  onSelectUser: (user: Friend) => void;
  onlineUsers:Set<string>;
}

export default function ChatList({
  users,
  selectedUser,
  onSelectUser,
}: ChatListProps) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="p-4 text-xl font-semibold border-b">
        Chats
      </div>

      {users.map((user) => (
        <div
          key={user._id}
          onClick={() => onSelectUser(user)}
          className={`p-4 cursor-pointer hover:bg-gray-100 transition ${
            selectedUser?._id === user._id ? "bg-gray-200" : ""
          }`}
        >
          <div className="font-medium">{user.name}</div>
          <div className="text-sm text-gray-400">
            Last message preview...
          </div>
        </div>
      ))}
    </div>
  );
}
