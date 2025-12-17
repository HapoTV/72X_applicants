import React from 'react';
import { NavLink } from 'react-router-dom';

interface LearningSubNavProps {
  onClose: () => void;
}

const LearningSubNav: React.FC<LearningSubNavProps> = ({ onClose }) => {
  const learningSections = [
    { path: '/learning/business-planning', label: 'Business Planning' },
    { path: '/learning/marketing-sales', label: 'Marketing & Sales' },
    { path: '/learning/financial-management', label: 'Financial Management' },
    { path: '/learning/operations', label: 'Operations' },
    { path: '/learning/leadership', label: 'Leadership' },
    { path: '/learning/standardbank-lm', label: 'StandardBank' },
  ];

  return (
    <div className="fixed left-56 w-56 bg-white shadow-lg z-40 border-r border-gray-200" style={{ top: '350px' }}>
      <div className="p-4">
        <nav>
          <ul className="space-y-1">
            {learningSections.map((section) => (
              <li key={section.path}>
                <NavLink
                  to={section.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  }
                >
                  {section.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default LearningSubNav;
