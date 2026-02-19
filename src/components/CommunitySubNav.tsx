import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

interface CommunitySubNavProps {
  onClose: () => void;
}

const CommunitySubNav: React.FC<CommunitySubNavProps> = ({ onClose }) => {
  const subNavItems = [
    { path: '/community/discussions', icon: MessageSquare, label: 'Discussions', package: 'startup' },
  ];

  return (
    <div className="fixed left-56 w-56 bg-white shadow-lg border-r border-gray-200 z-40" style={{ top: '425px' }}>
      <div className="p-4">
        <nav>
          <ul className="space-y-1">
            {subNavItems.map((item) => {
              return (
                <li key={item.path} className="relative">
                  <NavLink
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="font-medium text-sm">{item.label}</span>
                    </div>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default CommunitySubNav;
