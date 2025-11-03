interface AdminSidebarProps {
    activeTab: 'applicants' | 'events' | 'learning' | 'mentorship' | 'funding';
    onTabChange: (tab: 'applicants' | 'events' | 'learning' | 'mentorship' | 'funding') => void;
}

export default function AdminSidebar({ activeTab, onTabChange }: AdminSidebarProps) {
    return (
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-80px)] p-4">
            <nav className="space-y-1">
                <button 
                    onClick={() => onTabChange('applicants')} 
                    className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === 'applicants' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                    🧾 Applicants
                </button>
                <button 
                    onClick={() => onTabChange('events')} 
                    className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === 'events' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                    📅 Events
                </button>
                <button 
                    onClick={() => onTabChange('learning')} 
                    className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === 'learning' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                    📚 Learning Material
                </button>
                <button 
                    onClick={() => onTabChange('mentorship')} 
                    className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === 'mentorship' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                    🤝 Mentorship
                </button>
                <button 
                    onClick={() => onTabChange('funding')} 
                    className={`w-full text-left px-3 py-2 rounded-lg ${activeTab === 'funding' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'}`}
                >
                    💰 Funding
                </button>
            </nav>
        </aside>
    );
}