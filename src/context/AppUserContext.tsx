// src/context/AppUserContext.jsx
import React, { createContext, useContext, useState } from "react";

type User = {
  id: string;
  name: string;
  username: string;
  role: string;
};

type AppUserContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => void;
};

const AppUserContext = createContext<AppUserContextType | undefined>(undefined);
// Provider

type Props = {
  children: React.ReactNode;
};

export const AppUserProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);

  const logout = () => setUser(null);

  return (
    <AppUserContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AppUserContext.Provider>
  );
};

// Hook to use context easily
export const useAppUser = () => {
  const context = useContext(AppUserContext);
  if (!context) {
    throw new Error("useAppUser must be used within an AppUserProvider");
  }
  return context;
};
