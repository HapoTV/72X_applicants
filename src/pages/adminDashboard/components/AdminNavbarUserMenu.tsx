import { Building2, ChevronDown, Crown, LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminNavbarUserMenuProps {
  user: {
    fullName?: string;
    email?: string;
    role?: string;
  } | null | undefined;
  isSuperAdmin: boolean;
  userOrganisation?: string | null;
  showUserMenu: boolean;
  profilePath: string;
  notificationsPath: string;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onLogout: () => void;
}

export function AdminNavbarUserMenu({
  user,
  isSuperAdmin,
  userOrganisation,
  showUserMenu,
  profilePath,
  notificationsPath,
  onToggleMenu,
  onCloseMenu,
  onLogout,
}: AdminNavbarUserMenuProps) {
  return (
    <>
      <button
        onClick={onToggleMenu}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSuperAdmin ? 'bg-purple-100' : 'bg-blue-100'}`}>
          {isSuperAdmin ? <Crown className="w-4 h-4 text-purple-600" /> : <User className="w-4 h-4 text-blue-600" />}
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-medium text-gray-700">
            {user?.fullName?.split(' ')[0] || (isSuperAdmin ? 'Super Admin' : 'Admin')}
          </p>
          <p className="text-xs text-gray-500 truncate max-w-[120px]">
            {user?.email?.split('@')[0] || (isSuperAdmin ? 'superadmin' : 'admin')}
          </p>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {showUserMenu && (
        <>
          <div className="fixed inset-0 z-10" onClick={onCloseMenu} />
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">
                {user?.fullName || (isSuperAdmin ? 'Super Admin' : 'Admin User')}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || (isSuperAdmin ? 'superadmin@example.com' : 'admin@example.com')}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${isSuperAdmin ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                  {user?.role || (isSuperAdmin ? 'SUPER_ADMIN' : 'ADMIN')}
                </span>
                {userOrganisation && !isSuperAdmin && (
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center">
                    <Building2 className="w-3 h-3 mr-1" />
                    {userOrganisation}
                  </span>
                )}
              </div>
            </div>
            <div className="py-1">
              <Link to={profilePath} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={onCloseMenu}>
                Profile Settings
              </Link>
              <Link to={notificationsPath} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={onCloseMenu}>
                Notification Center
              </Link>
              {isSuperAdmin && (
                <Link to="/admin/organisations" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={onCloseMenu}>
                  Manage Organisations
                </Link>
              )}
              <div className="border-t border-gray-100 my-1"></div>
              <button onClick={onLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
