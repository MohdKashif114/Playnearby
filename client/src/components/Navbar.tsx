import { Bell, User, LogOut, LogIn, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider";
import { Badge } from "@/components/ui/badge";

interface NavbarProps {
  title?: string;
  loggedin: boolean;
  logouthandler?: () => void;
  noofusers: number;
}

export default function Navbar({
  title = "Sports Connect",
  logouthandler,
  noofusers,
}: NavbarProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="h-20 bg-[#0F141B] border-b border-gray-800 px-4 sm:px-8 flex items-center justify-between">
      
      {/* ───────── Left ───────── */}
      <div className="flex items-center gap-4 sm:gap-6">
        
        {/* Logo / Title */}
        <h1
          className="text-sm sm:text-lg font-bold text-gray-100 cursor-pointer hover:text-indigo-400 transition-colors truncate max-w-[120px] xs:max-w-none"
          onClick={() => navigate("/mainpage")}
        >
          {title}
        </h1>

        {/* Online Badge */}
        <Badge className="hidden xs:inline-flex bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-medium tracking-wide">
          Online: {noofusers}
        </Badge>
      </div>

      {/* ───────── Right ───────── */}
      <div className="flex items-center gap-4 sm:gap-8">
        
        {/* Chat */}
        <button
          onClick={() => navigate("/private-chats")}
          className="text-gray-400 hover:text-indigo-400 transition-colors flex items-center gap-1.5"
          title="Chat"
        >
          <MessageSquare size={20} />
          <span className="hidden sm:inline text-sm">Chat</span>
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate("/notifications")}
          className="text-gray-400 hover:text-indigo-400 transition-colors"
          title="Notifications"
        >
          <Bell size={20} />
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate("/profile")}
          className="text-gray-400 hover:text-indigo-400 transition-colors"
          title="Profile"
        >
          <User size={20} />
        </button>

        {/* Auth Section */}
        {user ? (
          <button
            onClick={logouthandler}
            className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        ) : (
          <div className="flex gap-2 sm:gap-4">
            
            {/* Login */}
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-all duration-200 shadow-md hover:shadow-indigo-500/20 text-xs sm:text-sm font-semibold"
            >
              <LogIn size={16} />
              <span className="hidden xs:inline">Login</span>
            </button>

            {/* Sign Up */}
            <button
              onClick={() => navigate("/signup")}
              className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg border border-indigo-500 text-indigo-400 hover:bg-indigo-500/10 transition-all duration-200 text-xs sm:text-sm font-semibold"
            >
              <span className="hidden xs:inline">Sign Up</span>
              <span className="xs:hidden">Join</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}