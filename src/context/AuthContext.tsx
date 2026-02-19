// src/context/AuthContext.tsx
import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "../interfaces/UserData";
import userSubscriptionService from "../services/UserSubscriptionService";

interface AuthContextType {
  user: User | null;
  login: (userData: User, authToken?: string) => void; // Modified to accept token
  logout: () => void;
  updateUserStatus: (status: string) => void;
  updateUserOrganisation: (organisation: string) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  token: string | null;
  tempSessionToken: string | null;
  setTempSessionToken: (token: string | null) => void;
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (enabled: boolean) => void;
  userOrganisation: string | null;
  userPackage: 'startup' | 'essential' | 'premium';
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

  const [userPackage, setUserPackage] = useState<'startup' | 'essential' | 'premium'>(() => {
    const stored = localStorage.getItem('userPackage');
    if (stored === 'essential' || stored === 'premium' || stored === 'startup') return stored;
    return 'startup';
  });

  // Used for OTP / temporary sessions
  const [tempSessionToken, setTempSessionToken] = useState<string | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const login = (userData: User, authToken?: string) => {
    // Save user data
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    
    // Save token if provided
    if (authToken) {
      localStorage.setItem("authToken", authToken);
      setToken(authToken);
    }
    
    // Save organisation if present in user data
    if (userData.organisation) {
      localStorage.setItem("userOrganisation", userData.organisation);
      setUserOrganisation(userData.organisation);
      console.log(" Organisation saved to AuthContext:", userData.organisation);
    } else {
      console.warn(" No organisation found in user data:", userData);
    }
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
      console.log(" Organisation updated to:", organisation);
    } else {
      localStorage.setItem('userOrganisation', organisation);
      setUserOrganisation(organisation);
      console.log(" Organisation set (no user):", organisation);
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

      const storedPkg = localStorage.getItem('userPackage');
      if (storedPkg === 'essential' || storedPkg === 'premium' || storedPkg === 'startup') {
        setUserPackage(storedPkg);
      }
    };

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Also check on mount
    handleStorageChange();

    const handlePackageUpdated = () => {
      const storedPkg = localStorage.getItem('userPackage');
      if (storedPkg === 'essential' || storedPkg === 'premium' || storedPkg === 'startup') {
        setUserPackage(storedPkg);
      }
    };

    window.addEventListener('user-package-updated', handlePackageUpdated as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('user-package-updated', handlePackageUpdated as EventListener);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const hydrateUserPackage = async () => {
      if (!token) return;
      try {
        const subscription = await userSubscriptionService.getCurrentUserPackage();
        if (cancelled) return;

        const subscriptionType = subscription?.subscriptionType;
        const mapped =
          subscriptionType === 'ESSENTIAL'
            ? 'essential'
            : subscriptionType === 'PREMIUM'
              ? 'premium'
              : 'startup';

        localStorage.setItem('userPackage', mapped);
        setUserPackage(mapped);
        window.dispatchEvent(new CustomEvent('user-package-updated'));
      } catch {
        if (cancelled) return;
        const storedPkg = localStorage.getItem('userPackage');
        if (storedPkg === 'essential' || storedPkg === 'premium' || storedPkg === 'startup') {
          setUserPackage(storedPkg);
        }
      }
    };

    void hydrateUserPackage();

    return () => {
      cancelled = true;
    };
  }, [token]);

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
        userPackage,
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