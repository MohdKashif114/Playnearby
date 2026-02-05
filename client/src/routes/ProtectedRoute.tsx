import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider"


interface AuthProviderProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }:AuthProviderProps) {
  const { user } = useAuth();
    console.log("user is ...",user);
  return user ? children : <Navigate to="/login" />;
}
