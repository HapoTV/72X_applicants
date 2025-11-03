import Logo from '../../assets/Logo.svg';

interface AdminNavbarProps {
    onLogout: () => void;
}

export default function AdminNavbar({ onLogout }: AdminNavbarProps) {
    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <img src={Logo} alt="SeventyTwoX Logo" className="w-16 h-16" />
                        <span className="text-2xl font-bold ml-3">Admin Dashboard</span>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-600">👤</span>
                            </div>
                            <span className="text-sm font-medium text-gray-700">Admin</span>
                        </div>
                        <button
                            onClick={onLogout}
                            className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm"
                        >
                            <span>🚪</span>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}