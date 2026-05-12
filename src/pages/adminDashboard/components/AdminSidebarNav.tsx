import type { AdminTab } from '../AdminSidebar';
import type { AdminMenuItem } from '../utils/adminMenuItems';

interface AdminSidebarNavProps {
  menuItems: AdminMenuItem[];
  currentPath: string;
  onSelectTab: (tab: AdminTab, path: string) => void;
}

export function AdminSidebarNav({ menuItems, currentPath, onSelectTab }: AdminSidebarNavProps) {
  return (
    <nav className="space-y-1">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const active = currentPath === item.path;
        return (
          <button
            key={item.id}
            onClick={() => onSelectTab(item.id, item.path)}
            className={`w-full text-left px-3 py-3 rounded-lg flex items-center space-x-3 transition-colors ${active ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'hover:bg-gray-50 text-gray-700'}`}
          >
            <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : 'text-gray-500'}`} />
            <span className="font-medium">{item.label}</span>
            {active && <span className="ml-auto w-2 h-2 bg-blue-600 rounded-full" />}
          </button>
        );
      })}
    </nav>
  );
}
