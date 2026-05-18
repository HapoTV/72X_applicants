import { Crown } from 'lucide-react';

const logoUrl = `${import.meta.env.BASE_URL}Logo2.svg`;

interface AdminNavbarBrandProps {
  isSuperAdmin: boolean;
  userOrganisation?: string | null;
}

export function AdminNavbarBrand({ isSuperAdmin, userOrganisation }: AdminNavbarBrandProps) {
  return (
    <div className="flex items-center">
      <img src={logoUrl} alt="SeventyTwoX Logo" className="w-12 h-12" />
      <span className="text-xl font-bold ml-3 hidden md:inline">
        {isSuperAdmin ? (
          <span className="flex items-center">
            <Crown className="w-5 h-5 text-purple-600 mr-1" />
            Admin Dashboard
          </span>
        ) : (
          'Admin Dashboard'
        )}
      </span>
      <span className="text-xl font-bold ml-3 md:hidden">Admin</span>

      {userOrganisation && !isSuperAdmin && (
        <span className="ml-3 px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full hidden md:inline">
          {userOrganisation}
        </span>
      )}
    </div>
  );
}
