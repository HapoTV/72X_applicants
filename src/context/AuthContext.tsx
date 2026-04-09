// src/context/AuthContext.tsx
import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "../interfaces/UserData";
import userSubscriptionService from "../services/UserSubscriptionService";

interface AuthContextType {
  user: User | null;
  login: (userData: User, authToken?: string) => void;
  logout: () => void;
  updateUserStatus: (status: string) => void;
  updateUserOrganisation: (organisation: string) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  isCocAdmin: boolean;
  token: string | null;
  tempSessionToken: string | null;
  setTempSessionToken: (token: string | null) => void;
  twoFactorEnabled: boolean;
  setTwoFactorEnabled: (enabled: boolean) => void;
  userOrganisation: string | null;
  userPackage: 'startup' | 'essential' | 'premium' | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem("authToken"));

  const [userOrganisation, setUserOrganisation] = useState<string | null>(() =>
    localStorage.getItem("userOrganisation")
  );

  const [userPackage, setUserPackage] = useState<'startup' | 'essential' | 'premium' | null>(() => {
    const stored = localStorage.getItem('userPackage');
    if (stored === 'essential' || stored === 'premium' || stored === 'startup') return stored;
    return null;
  });

  const [tempSessionToken, setTempSessionToken] = useState<string | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const login = (userData: User, authToken?: string) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    if (authToken) {
      localStorage.setItem("authToken", authToken);
      setToken(authToken);
    }
    if (userData.organisation) {
      localStorage.setItem("userOrganisation", userData.organisation);
      setUserOrganisation(userData.organisation);
    }
  };

  const logout = () => {
    const itemsToKeep = ['language', 'theme'];
    Object.keys(localStorage).forEach(key => {
      if (!itemsToKeep.includes(key)) localStorage.removeItem(key);
    });
    setUser(null);
    setToken(null);
    setTempSessionToken(null);
    setTwoFactorEnabled(false);
    setUserOrganisation(null);
    window.location.href = "/login";
  };

  const updateUserStatus = (status: string) => {
    if (user) {
      const updatedUser = { ...user, status };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('userStatus', status);
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

  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("authToken"));
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
      setUserOrganisation(localStorage.getItem("userOrganisation"));
      const storedPkg = localStorage.getItem('userPackage');
      if (storedPkg === 'essential' || storedPkg === 'premium' || storedPkg === 'startup') {
        setUserPackage(storedPkg);
      } else {
        setUserPackage(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    handleStorageChange();

    const handlePackageUpdated = () => {
      const storedPkg = localStorage.getItem('userPackage');
      if (storedPkg === 'essential' || storedPkg === 'premium' || storedPkg === 'startup') {
        setUserPackage(storedPkg);
      } else {
        setUserPackage(null);
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

    const handleNoSubscription = async () => {
      const storedUser = localStorage.getItem('user');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const userRole = (parsedUser?.role || localStorage.getItem('userRole') || '').toUpperCase();
      if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN' || userRole === 'COC_ADMIN') return;
      const userOrg = localStorage.getItem('userOrganisation');
      if (userOrg && userOrg.trim()) return;

      try {
        const trialStatus = await userSubscriptionService.getFreeTrialStatus();
        const hasUsedTrial =
          trialStatus?.success === false ||
          trialStatus?.remainingDays === 0 ||
          (typeof trialStatus?.message === 'string' &&
            (trialStatus.message.toLowerCase().includes('already used') ||
              trialStatus.message.toLowerCase().includes('expired') ||
              trialStatus.message.toLowerCase().includes('already been used')));

        const currentPath = window.location.pathname;
        if (hasUsedTrial) {
          localStorage.setItem('userStatus', 'PENDING_PAYMENT');
          if (!currentPath.startsWith('/payments') && !currentPath.startsWith('/select-package')) {
            window.location.href = `${import.meta.env.BASE_URL}select-package`;
          }
        } else {
          localStorage.setItem('userStatus', 'PENDING_PACKAGE');
          if (!currentPath.startsWith('/select-package')) {
            window.location.href = `${import.meta.env.BASE_URL}select-package`;
          }
        }
      } catch {
        const currentPath = window.location.pathname;
        if (!currentPath.startsWith('/select-package') && !currentPath.startsWith('/payments')) {
          window.location.href = `${import.meta.env.BASE_URL}select-package`;
        }
      }
    };

    const hydrateUserPackage = async () => {
      if (!token) return;
      try {
        const storedUser = localStorage.getItem('user');
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        const userRole = (parsedUser?.role || localStorage.getItem('userRole') || '').toUpperCase();
        if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN' || userRole === 'COC_ADMIN') return;

        const subscription = await userSubscriptionService.getCurrentUserPackage();
        if (cancelled) return;

        const subscriptionType = subscription?.subscriptionType;
        const mapped =
          subscriptionType === 'ESSENTIAL' ? 'essential' :
          subscriptionType === 'PREMIUM' ? 'premium' :
          subscriptionType === 'START_UP' ? 'startup' : null;

        if (mapped) {
          localStorage.setItem('userPackage', mapped);
          setUserPackage(mapped);
          window.dispatchEvent(new CustomEvent('user-package-updated'));
        } else {
          const userOrg = localStorage.getItem('userOrganisation');
          if (!userOrg || !userOrg.trim()) {
            if (!cancelled) await handleNoSubscription();
          }
        }
      } catch {
        if (cancelled) return;
        await handleNoSubscription();
      }
    };

    void hydrateUserPackage();
    return () => { cancelled = true; };
  }, [token]);

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'COC_ADMIN';
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isCocAdmin = user?.role === 'COC_ADMIN';

  return (
    <AuthContext.Provider value={{
      user, login, logout, updateUserStatus, updateUserOrganisation,
      isAuthenticated, isAdmin, isSuperAdmin, isCocAdmin,
      token, tempSessionToken, setTempSessionToken,
      twoFactorEnabled, setTwoFactorEnabled,
      userOrganisation, userPackage,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
