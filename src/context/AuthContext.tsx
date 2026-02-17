// src/context/AuthContext.tsx
import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "../interfaces/UserData";

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateUserStatus: (status: string) => void;
  updateUserOrganisation: (organisation: string) => void; // NEW
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean; // NEW
  token: string | null;
  tempSessionToken: string | null;
  setTempSessionToken: (token: string | null) => void;
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (enabled: boolean) => void;
  userOrganisation: string | null; // NEW
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("authToken");
  });

  const [userOrganisation, setUserOrganisation] = useState<string | null>(() => {
    return localStorage.getItem("userOrganisation");
  });

  // Used for OTP / temporary sessions
  const [tempSessionToken, setTempSessionToken] = useState<string | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const login = (userData: User) => {
    localStorage.setItem("user", JSON.stringify(userData));
    if (userData.organisation) {
      localStorage.setItem("userOrganisation", userData.organisation);
      setUserOrganisation(userData.organisation);
    }
    setUser(userData);
  };

  const logout = () => {
    // Clear all auth-related localStorage items
    const itemsToKeep = ['language', 'theme']; // Items to preserve
    const allItems = Object.keys(localStorage);
    
    allItems.forEach(key => {
      if (!itemsToKeep.includes(key)) {
        localStorage.removeItem(key);
      }
    });
    
    setUser(null);
    setToken(null);
    setTempSessionToken(null);
    setTwoFactorEnabled(false);
    setUserOrganisation(null);
    
    // Redirect to login
    window.location.href = "/login";
  };

  const updateUserStatus = (status: string) => {
    if (user) {
      const updatedUser = { ...user, status };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('userStatus', status);
      
      // Update requiresPackageSelection flag
      if (status === 'PENDING_PACKAGE') {
        localStorage.setItem('requiresPackageSelection', 'true');
      } else {
        localStorage.removeItem('requiresPackageSelection');
      }
      
      setUser(updatedUser);
    }
  };

  const updateUserOrganisation = (organisation: string) => {
    if (user) {
      const updatedUser = { ...user, organisation };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('userOrganisation', organisation);
      setUserOrganisation(organisation);
      setUser(updatedUser);
    } else {
      localStorage.setItem('userOrganisation', organisation);
      setUserOrganisation(organisation);
    }
  };

  // Update token when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("authToken");
      setToken(newToken);
      
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
      
      const storedOrg = localStorage.getItem("userOrganisation");
      setUserOrganisation(storedOrg);
    };

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Also check on mount
    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        updateUserStatus,
        updateUserOrganisation,
        isAuthenticated,
        isAdmin,
        isSuperAdmin,
        token,
        tempSessionToken,
        setTempSessionToken,
        twoFactorEnabled,
        setTwoFactorEnabled,
        userOrganisation,
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