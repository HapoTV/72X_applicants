// src/context/AuthContext.tsx
import { createContext, useState, useContext, useEffect, useRef } from "react";
import type { ReactNode } from "react";
import type { User } from "../interfaces/UserData";
import userSubscriptionService from "../services/UserSubscriptionService";
import { authService } from "../services/AuthService";

interface AuthContextType {
  user: User | null;
  login: (userData: User, authToken?: string) => void;
  logout: () => void;
  logoutAppTab: () => void;
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
  const accessRefreshInProgress = useRef(false);

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

  const logout = (redirectTo = "/login") => {
    const itemsToKeep = ['language', 'theme'];
    Object.keys(localStorage).forEach(key => {
      if (!itemsToKeep.includes(key)) localStorage.removeItem(key);
    });
    setUser(null);
    setToken(null);
    setTempSessionToken(null);
    setTwoFactorEnabled(false);
    setUserOrganisation(null);
    window.location.href = redirectTo;
  };

  const logoutAppTab = () => {
    window.location.href = '/';
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
      const isStandaloneOrg = !userOrg || userOrg.trim().toLowerCase() === 'hapo';
      if (!isStandaloneOrg) return;

      try {
        const trialStatus = await userSubscriptionService.getFreeTrialStatus();
        const hasUsedTrial =
          trialStatus?.success === false ||
          trialStatus?.remainingDays === 0 ||
          (typeof trialStatus?.message === 'string' &&
            (trialStatus.message.toLowerCase().includes('already used') ||
              trialStatus.message.toLowerCase().includes('expired') ||
              trialStatus.message.toLowerCase().includes('already been used')));

        if (hasUsedTrial) {
          // mark user as pending payment but do not force-nav; wait for hydration to complete
          localStorage.setItem('userStatus', 'PENDING_PAYMENT');
          localStorage.setItem('requiresPackageSelection', 'true');
        } else {
          // mark user as pending package selection; do not force-nav here
          localStorage.setItem('userStatus', 'PENDING_PACKAGE');
          localStorage.setItem('requiresPackageSelection', 'true');
        }
      } catch {
        // On error, conservatively mark that package selection may be required
        localStorage.setItem('userStatus', 'PENDING_PACKAGE');
        localStorage.setItem('requiresPackageSelection', 'true');
      }
    };

    const hydrateUserPackage = async () => {
      // mark hydration as in-progress so UI router can wait before redirecting
      localStorage.setItem('userPackageHydrated', 'false');
      if (!token) {
        localStorage.setItem('userPackageHydrated', 'true');
        return;
      }
      try {
        const storedUser = localStorage.getItem('user');
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        const userRole = (parsedUser?.role || localStorage.getItem('userRole') || '').toUpperCase();
        if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN' || userRole === 'COC_ADMIN') {
          localStorage.setItem('userPackageHydrated', 'true');
          return;
        }

        const subscription = await userSubscriptionService.getCurrentUserPackage();
        if (cancelled) return;

        console.log('hydrateUserPackage - subscription:', subscription);

        const subscriptionType: string | undefined = subscription?.subscriptionType;
        const mapped =
          subscriptionType === 'ESSENTIAL' ? 'essential' :
          subscriptionType === 'PREMIUM' ? 'premium' :
          subscriptionType === 'START_UP' ? 'startup' : null;

        // Also support alternative backend value variants (e.g. STARTUP without underscore)
        const mappedFallback = !mapped && subscriptionType === 'STARTUP' ? 'startup' : mapped;

        const userOrg = localStorage.getItem('userOrganisation');
        const isStandaloneOrg = !userOrg || userOrg.trim().toLowerCase() === 'hapo';

        if (mappedFallback) {
          localStorage.setItem('userPackage', mappedFallback);
          setUserPackage(mappedFallback);
          window.dispatchEvent(new CustomEvent('user-package-updated'));

          const currentStatus = localStorage.getItem('userStatus');
          if (currentStatus !== 'ACTIVE') {
            localStorage.setItem('userStatus', 'ACTIVE');
          }
          localStorage.removeItem('requiresPackageSelection');
          localStorage.removeItem('selectedPackage');
        } else if (isStandaloneOrg) {
          if (!cancelled) await handleNoSubscription();
        }
      } catch (error) {
        if (!cancelled) {
          console.warn('Unable to hydrate user package; preserving existing access state:', error);
        }
      } finally {
        if (!cancelled) {
          localStorage.setItem('userPackageHydrated', 'true');
        }
      }
    };

    void hydrateUserPackage();
    return () => { cancelled = true; };
  }, [token]);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const refreshAccessState = async () => {
      if (cancelled || accessRefreshInProgress.current) return;
      accessRefreshInProgress.current = true;

      try {
        const [currentUser, subscription] = await Promise.all([
          authService.getCurrentUser(),
          userSubscriptionService.getCurrentUserPackage(),
        ]);

        if (cancelled) return;

        const nextStatus = currentUser.status || '';
        const storedUser = localStorage.getItem('user');
        const parsedUser = storedUser ? JSON.parse(storedUser) : {};
        const nextUser = { ...parsedUser, ...currentUser };
        localStorage.setItem('user', JSON.stringify(nextUser));
        localStorage.setItem('userStatus', nextStatus);
        setUser(nextUser);
        window.dispatchEvent(new CustomEvent('user-status-updated'));

        const subscriptionType = subscription?.subscriptionType;
        const mappedPackage =
          subscriptionType === 'ESSENTIAL' ? 'essential' :
          subscriptionType === 'PREMIUM' ? 'premium' :
          subscriptionType === 'START_UP' || subscriptionType === 'STARTUP' ? 'startup' :
          null;

        if (mappedPackage) {
          localStorage.setItem('userPackage', mappedPackage);
          setUserPackage(mappedPackage);
          window.dispatchEvent(new CustomEvent('user-package-updated'));
        } else {
          localStorage.removeItem('userPackage');
          setUserPackage(null);
          window.dispatchEvent(new CustomEvent('user-package-updated'));
        }

        if (nextStatus === 'PENDING_PACKAGE') {
          localStorage.setItem('requiresPackageSelection', 'true');
        } else if (nextStatus === 'ACTIVE' || nextStatus === 'FREE_TRIAL') {
          localStorage.removeItem('requiresPackageSelection');
        }
      } catch (error) {
        console.warn('Unable to refresh user access state:', error);
      } finally {
        accessRefreshInProgress.current = false;
      }
    };

    void refreshAccessState();
    const interval = window.setInterval(() => void refreshAccessState(), 30000);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') void refreshAccessState();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [token]);

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.role === 'COC_ADMIN';
  const isSuperAdmin = user?.role === 'SUPER_ADMIN';
  const isCocAdmin = user?.role === 'COC_ADMIN';

  return (
    <AuthContext.Provider value={{
      user, login, logout, logoutAppTab, updateUserStatus, updateUserOrganisation,
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
