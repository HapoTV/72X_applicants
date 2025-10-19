import React, { useState } from 'react';
import Navigation from './Navigation';
import Header from './Header';
import MobileNav from './MobileNav';
import DashboardSubNav from './DashboardSubNav';
import ScheduleSubNav from './ScheduleSubNav';
import LearningSubNav from './LearningSubNav';
import CommunitySubNav from './CommunitySubNav';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isDashboardSubNavOpen, setIsDashboardSubNavOpen] = useState(false);
  const [isScheduleSubNavOpen, setIsScheduleSubNavOpen] = useState(false);
  const [isLearningSubNavOpen, setIsLearningSubNavOpen] = useState(false);
  const [isCommunitySubNavOpen, setIsCommunitySubNavOpen] = useState(false);

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
        <div className="flex-1 ml-56">
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