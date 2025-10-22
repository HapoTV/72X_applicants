import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';
import Header from './Header';
import MobileNav from './MobileNav';
import DashboardSubNav from './DashboardSubNav';
import ScheduleSubNav from './ScheduleSubNav';
import LearningSubNav from './LearningSubNav';
import CommunitySubNav from './CommunitySubNav';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isDashboardSubNavOpen, setIsDashboardSubNavOpen] = useState(false);
  const [isScheduleSubNavOpen, setIsScheduleSubNavOpen] = useState(false);
  const [isLearningSubNavOpen, setIsLearningSubNavOpen] = useState(false);
  const [isCommunitySubNavOpen, setIsCommunitySubNavOpen] = useState(false);
  const location = useLocation();
  const [navCollapsed, setNavCollapsed] = useState<boolean>(() => localStorage.getItem('navCollapsed') === '1');

  // Listen for sidebar collapse toggle and update margin
  useEffect(() => {
    const onToggle = () => setNavCollapsed(localStorage.getItem('navCollapsed') === '1');
    window.addEventListener('nav-collapsed-changed', onToggle as EventListener);
    return () => window.removeEventListener('nav-collapsed-changed', onToggle as EventListener);
  }, []);

  // Lightweight engagement tracker
  useEffect(() => {
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
  }, [location.pathname]);

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
    }
  };

  // Handle Community toggle - close others
  const handleCommunityToggle = (isOpen: boolean) => {
    setIsCommunitySubNavOpen(isOpen);
    if (isOpen) {
      setIsDashboardSubNavOpen(false);
      setIsScheduleSubNavOpen(false);
      setIsLearningSubNavOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop Navigation */}
      <div className="hidden md:flex">
        <Navigation 
          onDashboardToggle={handleDashboardToggle}
          onScheduleToggle={handleScheduleToggle}
          onLearningToggle={handleLearningToggle}
          onCommunityToggle={handleCommunityToggle}
        />
        {isDashboardSubNavOpen && <DashboardSubNav onClose={() => setIsDashboardSubNavOpen(false)} />}
        {isScheduleSubNavOpen && <ScheduleSubNav onClose={() => setIsScheduleSubNavOpen(false)} />}
        {isLearningSubNavOpen && <LearningSubNav onClose={() => setIsLearningSubNavOpen(false)} />}
        {isCommunitySubNavOpen && <CommunitySubNav onClose={() => setIsCommunitySubNavOpen(false)} />}
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
    </div>
  );
};

export default Layout;