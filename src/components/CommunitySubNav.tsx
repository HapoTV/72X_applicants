import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, Users, MessageCircle, X, Lock } from 'lucide-react';

interface CommunitySubNavProps {
  onClose: () => void;
}

type PackageType = 'startup' | 'essential' | 'premium';

const CommunitySubNav: React.FC<CommunitySubNavProps> = ({ onClose }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const userPackage = (localStorage.getItem('userPackage') || 'startup') as PackageType;

  const subNavItems = [
    { path: '/community/discussions', icon: MessageSquare, label: 'Discussions', package: 'startup' },
    { path: '/community/networking', icon: Users, label: 'Networking', package: 'startup' },
    { path: '/community/mentorship', icon: MessageCircle, label: 'Mentorship', package: 'essential' }
  ];

  const isFeatureLocked = (itemPackage: string) => {
    if (itemPackage === 'essential') {
      return userPackage === 'startup';
    }
    if (itemPackage === 'premium') {
      return userPackage === 'startup' || userPackage === 'essential';
    }
    return false;
  };

  return (
    <div className="fixed left-56 w-56 bg-white shadow-lg border-r border-gray-200 z-40" style={{ top: '425px' }}>
      <div className="p-4">
        <nav>
          <ul className="space-y-1">
            {subNavItems.map((item) => {
              const locked = isFeatureLocked(item.package);
              const upgradePath = '/upgrade/mentorship';

              return (
                <li 
                  key={item.path}
                  className="relative"
                  onMouseEnter={() => locked && setHoveredItem(item.path)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <NavLink
                    to={locked ? upgradePath : item.path}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        locked
                          ? 'text-gray-400 hover:bg-gray-50'
                          : isActive
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="font-medium text-sm">{item.label}</span>
                    </div>
                    {locked && <Lock className="w-3 h-3 flex-shrink-0" />}
                  </NavLink>
                  
                  {/* Hover Tooltip */}
                  {locked && hoveredItem === item.path && (
                    <div 
                      className="fixed bg-orange-50 border-2 border-orange-400 text-gray-800 px-4 py-2 rounded-lg text-sm shadow-lg z-50 whitespace-nowrap flex items-center space-x-2"
                      style={{
                        left: '380px',
                        top: '505px'
                      }}
                    >
                      <span className="text-orange-500">⚠</span>
                      <span>
                        This feature is for <span className="font-semibold text-orange-600">Essential</span> package. <br />You need to upgrade to unlock it!
                      </span>
                    </div>
                  )}
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
