import { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";
import type { User } from "../interfaces/UserData"; // ✅ reuse unified User interface

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  tempSessionToken: string | null;
  setTempSessionToken: (token: string | null) => void;
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (enabled: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [tempSessionToken, setTempSessionToken] = useState<string | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

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
    setTempSessionToken(null);
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated,
        isAdmin,
        tempSessionToken,
        setTempSessionToken,
        twoFactorEnabled,
        setTwoFactorEnabled,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
