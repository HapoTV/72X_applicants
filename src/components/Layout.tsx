import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';
import Header from './Header';
import MobileNav from './MobileNav';
import DashboardSubNav from './DashboardSubNav';
import ScheduleSubNav from './ScheduleSubNav';
import LearningSubNav from './LearningSubNav';
import CommunitySubNav from './CommunitySubNav';
import AppStoreSubNav from './AppStoreSubNav';
import { useLocation, useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isDashboardSubNavOpen, setIsDashboardSubNavOpen] = useState(false);
  const [isScheduleSubNavOpen, setIsScheduleSubNavOpen] = useState(false);
  const [isLearningSubNavOpen, setIsLearningSubNavOpen] = useState(false);
  const [isCommunitySubNavOpen, setIsCommunitySubNavOpen] = useState(false);
  const [isAppStoreSubNavOpen, setIsAppStoreSubNavOpen] = useState(false);
  const [showLayout, setShowLayout] = useState(true);
  const [userStatus, setUserStatus] = useState<string>('');
  const [,setRequiresPackageSelection] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const [navCollapsed, setNavCollapsed] = useState<boolean>(() => localStorage.getItem('navCollapsed') === '1');

  // Check if layout should be hidden
  useEffect(() => {
    // Check if we should hide layout (for payment pages, package selection, etc.)
    const hideLayout = localStorage.getItem('hideLayout') === 'true';
    
    // Check user status and package requirement
    const status = localStorage.getItem('userStatus');
    const requiresPackage = localStorage.getItem('requiresPackageSelection');
    const currentPath = location.pathname;
    
    console.log('🏗️ Layout status check:', {
        userStatus: status,
        requiresPackage,
        currentPath,
        isSelectPackagePage: currentPath === '/select-package',
        isPaymentPage: currentPath.includes('/payments'),
        hideLayout
    });
    
    setUserStatus(status || '');
    setRequiresPackageSelection(requiresPackage === 'true');
    
    // Special case: if user is on payment page, allow access
    const isPaymentPage = currentPath.includes('/payments');
    
    // Hide navbar and sidebar if:
    // 1. hideLayout flag is set (for payment pages)
    // 2. User is on the package selection page
    // 3. User has PENDING_PACKAGE status AND is NOT on payment page
    // 4. User requires package selection AND is NOT on payment page
    if (hideLayout || 
        currentPath === '/select-package' || 
        (status === 'PENDING_PACKAGE' && !isPaymentPage) || 
        (requiresPackage === 'true' && !isPaymentPage)) {
        console.log('🚫 Hiding navbar and sidebar');
        setShowLayout(false);
        
        // If user is not on package page but needs package, redirect them
        if (currentPath !== '/select-package' && 
            !isPaymentPage &&
            (status === 'PENDING_PACKAGE' || requiresPackage === 'true')) {
            console.log('🔄 Redirecting to package selection from layout');
            navigate('/select-package');
        }
    } else {
        setShowLayout(true);
    }
  }, [location.pathname, navigate]);

  // Check if current route is an app route (full-screen mode)
  const isAppRoute = location.pathname.startsWith('/applications/') && location.pathname !== '/applications';

  // Listen for sidebar collapse toggle and update margin
  useEffect(() => {
    const onToggle = () => setNavCollapsed(localStorage.getItem('navCollapsed') === '1');
    window.addEventListener('nav-collapsed-changed', onToggle as EventListener);
    return () => window.removeEventListener('nav-collapsed-changed', onToggle as EventListener);
  }, []);

  // Lightweight engagement tracker - Only run if layout is shown
  useEffect(() => {
    if (!showLayout) return; // Skip tracking if layout is hidden
    
    try {
      const today = new Date();
      const todayStr = today.toISOString().slice(0, 10); // YYYY-MM-DD
      const key = 'engagement';
      const raw = localStorage.getItem(key);
      const data = raw ? JSON.parse(raw) : {};

      // Track daily streak
      const lastActive = data.lastActiveDate as string | undefined;
      let streak = Number(data.streak || 0);
      if (!lastActive) {
        streak = 1;
      } else if (lastActive !== todayStr) {
        const prev = new Date(lastActive);
        const diffDays = Math.floor((today.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));
        streak = diffDays === 1 ? streak + 1 : 1;
      }

      // Count actions today (simple signal = route changes)
      const actions = (data.actionsByDate && data.actionsByDate[todayStr]) || 0;
      const newActions = actions + 1;
      const actionsByDate = { ...(data.actionsByDate || {}), [todayStr]: newActions };

      // Derive simple XP/progress from actions
      const xp = newActions * 10; // 10 XP per action
      const xpGoal = 100; // next level at 100 XP
      const progressPercent = Math.min(100, Math.round((xp / xpGoal) * 100));

      // Derive badges rudimentarily
      const badges = (data.badgesCount || 0) + (newActions % 5 === 0 ? 1 : 0);

      const updated = {
        ...data,
        lastActiveDate: todayStr,
        streak,
        badgesCount: badges,
        actionsByDate,
        levelTitle: `Level ${1 + Math.floor((data.totalXp || 0 + xp) / 100)} - Active Entrepreneur`,
        streakLabel: `${streak} day streak`,
        badgesLabel: `${badges} badges`,
        xpLabel: `${(data.totalXp || 0) + xp} XP`,
        nextLevelLabel: `${Math.max(0, xpGoal - (xp % xpGoal))} to next level`,
        progressPercent,
      };

      // Keep a running total of XP
      updated.totalXp = (data.totalXp || 0) + 10; // +10 per route change

      localStorage.setItem(key, JSON.stringify(updated));

      // Community highlights aggregator
      const getInitials = () => {
        const name = (localStorage.getItem('firstName') || localStorage.getItem('userFirstName') || '').trim();
        if (name) return name.split(' ').map(s => s[0]?.toUpperCase()).join('').slice(0,2) || 'U';
        const email = (localStorage.getItem('userEmail') || '').trim();
        return email ? email[0].toUpperCase() : 'U';
      };

      const pushUpdate = (title: string, message?: string) => {
        try {
          const list = JSON.parse(localStorage.getItem('communityUpdates') || '[]');
          list.push({ initials: getInitials(), title, message, timestamp: new Date().toISOString() });
          localStorage.setItem('communityUpdates', JSON.stringify(list));
        } catch { /* ignore */ }
      };

      // 1) Goals achievement update when value changes
      const goalsKey = 'goalsAchieved';
      const lastGoalsPostedKey = 'lastGoalsPosted';
      const goalsVal = (localStorage.getItem(goalsKey) || '').trim();
      const lastGoalsPosted = localStorage.getItem(lastGoalsPostedKey) || '';
      if (goalsVal && goalsVal !== lastGoalsPosted) {
        pushUpdate('Goals updated', `Now at ${goalsVal}`);
        localStorage.setItem(lastGoalsPostedKey, goalsVal);
      }

      // 2) Level up update when level changes
      const levelMatch = String(updated.levelTitle || '').match(/Level\s+(\d+)/i);
      const levelNum = levelMatch ? Number(levelMatch[1]) : undefined;
      const lastLevelPostedKey = 'lastLevelPosted';
      const lastLevelPosted = Number(localStorage.getItem(lastLevelPostedKey) || '0');
      if (levelNum && levelNum > lastLevelPosted) {
        pushUpdate('Level up!', `Reached Level ${levelNum}`);
        localStorage.setItem(lastLevelPostedKey, String(levelNum));
      }

      // 3) Challenge completed update: mark via localStorage.challengeCompletedDate = todayStr
      const challengeDoneKey = 'challengeCompletedDate';
      const lastChallengePostedKey = 'lastChallengePostedDate';
      const doneDate = localStorage.getItem(challengeDoneKey);
      const lastPostedDate = localStorage.getItem(lastChallengePostedKey);
      if (doneDate === todayStr && lastPostedDate !== todayStr) {
        pushUpdate("Completed today's challenge");
        localStorage.setItem(lastChallengePostedKey, todayStr);
      }

      // Expose a small helper for UI to mark completion without backend yet
      (window as any).markChallengeCompleted = () => {
        localStorage.setItem(challengeDoneKey, todayStr);
      };
    } catch {
      // ignore tracking errors
    }
  }, [location.pathname, showLayout]); // Added showLayout dependency

  // Handle Dashboard toggle - close others
  const handleDashboardToggle = (isOpen: boolean) => {
    setIsDashboardSubNavOpen(isOpen);
    if (isOpen) {
      setIsScheduleSubNavOpen(false);
      setIsLearningSubNavOpen(false);
      setIsCommunitySubNavOpen(false);
    }
  };

  // Handle Schedule toggle - close others
  const handleScheduleToggle = (isOpen: boolean) => {
    setIsScheduleSubNavOpen(isOpen);
    if (isOpen) {
      setIsDashboardSubNavOpen(false);
      setIsLearningSubNavOpen(false);
      setIsCommunitySubNavOpen(false);
    }
  };

  // Handle Learning toggle - close others
  const handleLearningToggle = (isOpen: boolean) => {
    setIsLearningSubNavOpen(isOpen);
    if (isOpen) {
      setIsDashboardSubNavOpen(false);
      setIsScheduleSubNavOpen(false);
      setIsCommunitySubNavOpen(false);
      setIsAppStoreSubNavOpen(false);
    }
  };

  // Handle Community toggle - close others
  const handleCommunityToggle = (isOpen: boolean) => {
    setIsCommunitySubNavOpen(isOpen);
    if (isOpen) {
      setIsDashboardSubNavOpen(false);
      setIsScheduleSubNavOpen(false);
      setIsLearningSubNavOpen(false);
      setIsAppStoreSubNavOpen(false);
    }
  };

  // Handle App Store toggle - close others
  const handleAppStoreToggle = (isOpen: boolean) => {
    setIsAppStoreSubNavOpen(isOpen);
    if (isOpen) {
      setIsDashboardSubNavOpen(false);
      setIsScheduleSubNavOpen(false);
      setIsLearningSubNavOpen(false);
      setIsCommunitySubNavOpen(false);
    }
  };

  // If layout should be hidden (user needs to select package or is on payment page)
  if (!showLayout) {
    // Return only the content without navbar and sidebar
    // Add a special class for package selection page
    const isPackageSelectionPage = location.pathname === '/select-package';
    const isPaymentPage = location.pathname.includes('/payments');
    
    return (
      <div className={`min-h-screen ${isPackageSelectionPage ? 'bg-gradient-to-br from-primary-50 to-primary-100' : 
        isPaymentPage ? 'bg-gradient-to-br from-primary-50 to-blue-50' : 'bg-gray-50'}`}>
        {/* Optional: Show a simple header for package selection */}
        {isPackageSelectionPage && (
          <div className="p-4">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-center mb-6">
                <img 
                  src="/Logo.svg" 
                  alt="SeventyTwoX Logo" 
                  className="w-12 h-12"
                  onClick={() => navigate('/')}
                />
              </div>
            </div>
          </div>
        )}
        
        <main className={`${isPackageSelectionPage || isPaymentPage ? '' : 'p-6'}`}>
          {children}
        </main>
        
        {/* Show warning banner if user tries to access other pages */}
        {!isPackageSelectionPage && !isPaymentPage && userStatus === 'PENDING_PACKAGE' && (
          <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-4 text-center z-50">
            <p className="font-medium">
              ⚠️ Please select a package to continue using the platform. 
              <button 
                onClick={() => navigate('/select-package')}
                className="ml-2 underline font-bold"
              >
                Go to Package Selection
              </button>
            </p>
          </div>
        )}
      </div>
    );
  }

  // Normal layout mode with navigation (for ACTIVE users)
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Full-screen app mode - no navigation or sidebar */}
      {isAppRoute ? (
        <main className="p-6">
          {children}
        </main>
      ) : (
        // Normal layout mode with navigation
        <>
          {/* Desktop Navigation */}
          <div className="hidden md:flex">
            <Navigation 
              onDashboardToggle={handleDashboardToggle}
              onScheduleToggle={handleScheduleToggle}
              onLearningToggle={handleLearningToggle}
              onCommunityToggle={handleCommunityToggle}
              onAppStoreToggle={handleAppStoreToggle}
            />
            {isDashboardSubNavOpen && <DashboardSubNav onClose={() => setIsDashboardSubNavOpen(false)} />}
            {isScheduleSubNavOpen && <ScheduleSubNav onClose={() => setIsScheduleSubNavOpen(false)} />}
            {isLearningSubNavOpen && <LearningSubNav onClose={() => setIsLearningSubNavOpen(false)} />}
            {isCommunitySubNavOpen && <CommunitySubNav onClose={() => setIsCommunitySubNavOpen(false)} />}
            {isAppStoreSubNavOpen && <AppStoreSubNav onClose={() => setIsAppStoreSubNavOpen(false)} />}
            <div className={`flex-1 ${navCollapsed ? 'ml-20' : 'ml-56'} transition-all duration-200`}>
              <Header onMobileMenuToggle={() => setIsMobileNavOpen(!isMobileNavOpen)} />
              <main className="p-6">
                {children}
              </main>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            <Header onMobileMenuToggle={() => setIsMobileNavOpen(!isMobileNavOpen)} />
            <main className="pb-20 px-4 pt-4">
              {children}
            </main>
            <MobileNav />
          </div>

          {/* Mobile Navigation Overlay */}
          {isMobileNavOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div 
                className="fixed inset-0 bg-black bg-opacity-50"
                onClick={() => setIsMobileNavOpen(false)}
              />
              <div className="fixed top-0 left-0 w-56 h-full bg-white shadow-lg">
                <Navigation onClose={() => setIsMobileNavOpen(false)} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Layout;