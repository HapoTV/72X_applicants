import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, GraduationCap, ShoppingBag, MessageCircle, User, AppWindow } from 'lucide-react';

const MobileNav: React.FC = () => {
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/learning', icon: GraduationCap, label: 'Learn' },
    { path: '/marketplace', icon: ShoppingBag, label: 'Market' },
    { path: '/applications', icon: AppWindow, label: 'Apps' },
    { path: '/mentorship', icon: MessageCircle, label: 'Mentor' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)]">
      <div className="flex justify-around gap-1 px-1 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex min-w-0 flex-1 flex-col items-center rounded-lg px-1 py-2 transition-colors ${
                isActive
                  ? 'text-primary-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`
            }
          >
            <item.icon className="w-5 h-5 mb-1" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;