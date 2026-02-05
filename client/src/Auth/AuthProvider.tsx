import { useState,createContext,useContext } from "react";


interface AuthProviderProps {
  children: React.ReactNode;
}


interface userT{
  name:string;
  id:string;
  sport:string;
  location:string;
}

interface Authprops{
  user:userT;
  setUser: React.Dispatch<React.SetStateAction<any>>;
  currentTeam:string;
  setCurrentTeam:React.Dispatch<React.SetStateAction<any>>;
}

const AuthContext=createContext<Authprops|undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<userT>({
    name:"",
    id:"",
    sport:"",
    location:""
  });
  const [currentTeam,setCurrentTeam] = useState<string>("");

  return (
    <AuthContext.Provider value={{ user, setUser,currentTeam,setCurrentTeam }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = (): Authprops => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
};

