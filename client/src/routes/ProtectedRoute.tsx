import { Navigate } from "react-router-dom";
import { useAuth } from "../Auth/AuthProvider"


interface AuthProviderProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }:AuthProviderProps) {
  const { user, loading } = useAuth();
  console.log("user is ...",user);
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
}
