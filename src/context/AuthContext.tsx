// src/context/AuthContext.tsx
import { createContext, useState, useContext } from "react";
import type {ReactNode} from "react";

interface User {
  userId: string;
  fullName: string;
  email: string;
  role: string;
  status: string;
  businessReference?: string;
  companyName?: string;
  industry?: string;
  location?: string;
  founded?: string;
  employees?: string;
  profileImageUrl?: string;
  userPackage?: string;
  createdAt?: string;
  mobileNumber?: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const login = (userData: User) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userType");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("businessReference");
    localStorage.removeItem("userId");
    localStorage.removeItem("userPackage");
    setUser(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};