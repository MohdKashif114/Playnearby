import { Bell, User, LogOut, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Auth/AuthProvider';
import MapView from './MapView';

interface NavbarProps {
  title?: string;
  loggedin: boolean;   
  logouthandler?: () => void;
}

export default function Navbar({
  title = 'Sports Connect',
  loggedin,
  logouthandler,
}: NavbarProps) {

  const navigate=useNavigate();
  const {user,setUser}=useAuth();


  



  return (
    <div className="h-20 bg-gray-800 border-b border-gray-700 px-6 flex items-center justify-between">
      {/* Left */}
      <h1 className="text-xl font-bold text-white">{title}</h1>

      {/* Right */}
      <div className="flex items-center gap-6">
        <button className="text-gray-400 hover:text-white transition" onClick={()=> navigate("/mainpage/friends-chat")}>
          Chat
        </button>
        <button className="text-gray-400 hover:text-white transition">
          <Bell size={20} onClick={()=> navigate("/notifications")} />
        </button>

        <button className="text-gray-400 hover:text-white transition">
          <User size={20} />
        </button>

        {user ? (
          <button
            onClick={logouthandler}
            className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        ) : (
          <div className="flex gap-4">
            <button
              onClick={()=>navigate("/login")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
            >
              <LogIn size={18} />
              Login
            </button>

            <button
              onClick={()=>navigate("/signup")}
              className="px-4 py-2 rounded-lg border border-green-600 text-green-400 hover:bg-green-600 hover:text-white transition"
            >
              Sign Up
            </button>
          </div>
        )}
    
      </div>
    </div>
  );
}
