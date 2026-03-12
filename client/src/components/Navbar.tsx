import { Bell, User, LogOut, LogIn } from "lucide-react";
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
  loggedin,
  logouthandler,
  noofusers,
}: NavbarProps) {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="h-20 bg-[#0F141B] border-b border-gray-800 px-8 flex items-center justify-between">
      
      {/* ───────── Left ───────── */}
      <div className="flex items-center gap-6">
        
        {/* Logo / Title */}
        <h1
          className="text-lg font-semibold text-gray-100 cursor-pointer hover:text-indigo-400 transition-colors"
          onClick={() => navigate("/mainpage")}
        >
          {title}
        </h1>

        {/* Online Badge */}
        <Badge className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 text-xs font-medium tracking-wide">
          Online: {noofusers}
        </Badge>
      </div>

      {/* ───────── Right ───────── */}
      <div className="flex items-center gap-8">
        
        {/* Chat */}
        <button
          onClick={() => navigate("/private-chats")}
          className="text-sm text-gray-400 hover:text-indigo-400 transition-colors"
        >
          Chat
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate("/notifications")}
          className="text-gray-400 hover:text-indigo-400 transition-colors"
        >
          <Bell size={20} />
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate("/profile")}
          className="text-gray-400 hover:text-indigo-400 transition-colors"
        >
          <User size={20} />
        </button>

        {/* Auth Section */}
        {user ? (
          <button
            onClick={logouthandler}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        ) : (
          <div className="flex gap-4">
            
            {/* Login */}
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-all duration-200 shadow-md hover:shadow-indigo-500/20"
            >
              <LogIn size={18} />
              Login
            </button>

            {/* Sign Up */}
            <button
              onClick={() => navigate("/signup")}
              className="px-4 py-2 rounded-lg border border-indigo-500 text-indigo-400 hover:bg-indigo-500/10 transition-all duration-200"
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
}