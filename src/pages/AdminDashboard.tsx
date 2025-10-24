import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../assets/Logo.svg';

interface Application {
    id: string;
    referenceNumber: string;
    businessName: string;
    businessOwner: string;
    package: string;
    submitted: string;
    actions: string;
    status: 'Pending' | 'Active' | 'Inactive';
}

interface LearningItem {
  id: string;
  title: string;
  type: 'Article' | 'Video' | 'PDF';
  updated?: string;
}

interface AdminEventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location?: string;
}

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [activeTab, setActiveTab] = useState<'applicants' | 'events' | 'learning' | 'mentorship' | 'funding'>('applicants');
    const [learningSection, setLearningSection] = useState<'business' | 'marketing' | 'financial' | 'operations' | 'leadership'>('business');
    const [learningData, setLearningData] = useState<Record<typeof learningSection, LearningItem[]>>({
        business: [],
        marketing: [],
        financial: [],
        operations: [],
        leadership: [],
    });
    const [showAddLearning, setShowAddLearning] = useState(false);
    const [newLearning, setNewLearning] = useState<{ title: string; type: 'Article' | 'Video' | 'PDF' }>({ title: '', type: 'Article' });

    const [eventsAdmin, setEventsAdmin] = useState<AdminEventItem[]>([]);
    const [showAddEventAdmin, setShowAddEventAdmin] = useState(false);
    const [newEvent, setNewEvent] = useState<{ title: string; date: string; time: string; location: string }>({ title: '', date: '', time: '', location: '' });
    const [editEventId, setEditEventId] = useState<string | null>(null);
    const [showViewEvent, setShowViewEvent] = useState(false);
    const [viewEvent, setViewEvent] = useState<AdminEventItem | null>(null);
    const [mentors, setMentors] = useState<Array<{ id: string; name: string; expertise: string; contact?: string }>>([]);
    const [showAddMentor, setShowAddMentor] = useState(false);
    const [newMentor, setNewMentor] = useState<{ name: string; expertise: string; contact: string }>({ name: '', expertise: '', contact: '' });
    const [fundingItems, setFundingItems] = useState<Array<{ id: string; title: string; provider: string; deadline?: string }>>([]);
    const [showAddFunding, setShowAddFunding] = useState(false);
    const [newFunding, setNewFunding] = useState<{ title: string; provider: string; deadline: string }>({ title: '', provider: '', deadline: '' });

    const stats = [
        { 
            title: 'Total Applicants', 
            value: '0', 
            icon: '📄',
            color: 'blue'
        },
        { 
            title: 'Active', 
            value: '0', 
            icon: '✅',
            color: 'green'
        },
        { 
            title: 'Pending', 
            value: '0', 
            icon: '⏳',
            color: 'yellow'
        },
        { 
            title: 'Inactive', 
            value: '0', 
            icon: '❌',
            color: 'red'
        },
    ];

    const applications: Application[] = [];

    const filteredApplications = applications.filter((app: Application) => {
        const searchable = [app.referenceNumber, app.businessName, app.businessOwner, app.package]
            .filter(Boolean) as string[];
        const matchesSearch = searchTerm === '' || searchable.some(value => 
            value.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    function getStatusIcon(status: string) {
        switch (status) {
            case 'Active': return '✅';
            case 'Inactive': return '❌';
            default: return '⏳';
        }
    }

    function handleLogout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userType');
        localStorage.removeItem('userEmail');
        navigate('/');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
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
                                onClick={handleLogout}
                                className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-sm"
                            >
                                <span>🚪</span>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-80px)] p-4">
                    <nav className="space-y-1">
                        <button onClick={() => setActiveTab('applicants')} className={`w-full text-left px-3 py-2 rounded-lg ${activeTab==='applicants' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'}`}>🧾 Applicants</button>
                        <button onClick={() => setActiveTab('events')} className={`w-full text-left px-3 py-2 rounded-lg ${activeTab==='events' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'}`}>📅 Events</button>
                        <button onClick={() => setActiveTab('learning')} className={`w-full text-left px-3 py-2 rounded-lg ${activeTab==='learning' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'}`}>📚 Learning Material</button>
                        <button onClick={() => setActiveTab('mentorship')} className={`w-full text-left px-3 py-2 rounded-lg ${activeTab==='mentorship' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'}`}>🤝 Mentorship</button>
                        <button onClick={() => setActiveTab('funding')} className={`w-full text-left px-3 py-2 rounded-lg ${activeTab==='funding' ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'}`}>💰 Funding</button>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-6">
                    {activeTab === 'applicants' && (
                        <div className="max-w-7xl mx-auto">
                            {/* Stats Overview */}
                            <div className="mb-8">
                                <div className="mb-6">
                                    <h1 className="text-2xl font-bold text-gray-900">Applications Overview</h1>
                                    <p className="text-gray-600 mb-4">Track and manage all business applications</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                    {stats.map((stat, index) => (
                                        <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                                                <div className={`p-2 rounded-lg ${stat.title === 'Active' ? 'bg-green-50' : stat.title === 'Inactive' ? 'bg-red-50' : stat.title === 'Pending' ? 'bg-yellow-50' : 'bg-blue-50'}`}>
                                                    <span className="text-xl">{stat.icon}</span>
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Applications Table */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                                        <div className="relative flex-1">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-400">🔍</span>
                                            </div>
                                            <input
                                                type="text"
                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                                                placeholder="Search by name, email, business name, or reference..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        <div className="w-40">
                                            <select
                                                className="w-full appearance-none bg-white border border-gray-300 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                value={statusFilter}
                                                onChange={(e) => setStatusFilter(e.target.value)}
                                            >
                                                <option value="All">All Status</option>
                                                <option value="Pending">Pending</option>
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">REFERENCE NUMBER</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BUSINESS NAME</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OWNER</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PACKAGE</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SUBMITTED</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredApplications.length > 0 ? (
                                                filteredApplications.map((app) => (
                                                    <tr key={app.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{app.referenceNumber}</div></td>
                                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{app.businessName}</div></td>
                                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{app.businessOwner}</div></td>
                                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{app.package}</div></td>
                                                        <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${app.status === 'Active' ? 'bg-green-100 text-green-800' : app.status === 'Inactive' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{app.status}</span></td>
                                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{app.submitted}</div></td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium"><button className="text-blue-600 hover:text-blue-900 mr-4">View</button><button className="text-green-600 hover:text-green-900">Edit</button></td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={7} className="px-6 py-12 text-center">
                                                        <div className="text-center">
                                                            <div className="text-4xl mb-2">📄</div>
                                                            <h3 className="mt-2 text-sm font-medium text-gray-900">No applications</h3>
                                                            <p className="mt-1 text-sm text-gray-500">{searchTerm || statusFilter !== 'All' ? 'No applications match your search criteria.' : 'Get started by approving new applications.'}</p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'events' && (
                        <div className="max-w-7xl mx-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-2xl font-bold text-gray-900">Events</h1>
                                <button onClick={() => setShowAddEventAdmin(true)} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm">Add Event</button>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TITLE</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TIME</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LOCATION</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {eventsAdmin.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="px-6 py-6 text-center text-sm text-gray-600">No events yet</td>
                                                </tr>
                                            ) : (
                                                eventsAdmin.map(ev => (
                                                    <tr key={ev.id}>
                                                        <td className="px-6 py-3 text-sm text-gray-900">{ev.title}</td>
                                                        <td className="px-6 py-3 text-sm text-gray-600">{ev.date}</td>
                                                        <td className="px-6 py-3 text-sm text-gray-600">{ev.time}</td>
                                                        <td className="px-6 py-3 text-sm text-gray-600">{ev.location || '—'}</td>
                                                        <td className="px-6 py-3 text-sm">
                                                            <button className="text-blue-600 hover:text-blue-800 mr-4" onClick={()=>{ setViewEvent(ev); setShowViewEvent(true); }}>View</button>
                                                            <button className="text-green-600 hover:text-green-800" onClick={()=>{ setEditEventId(ev.id); setNewEvent({ title: ev.title, date: ev.date, time: ev.time, location: ev.location || ''}); setShowAddEventAdmin(true); }}>Edit</button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {showAddEventAdmin && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                                        <h3 className="text-lg font-semibold mb-4">{editEventId ? 'Edit Event' : 'Add Event'}</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm text-gray-700 mb-1">Title</label>
                                                <input value={newEvent.title} onChange={e=>setNewEvent({...newEvent,title:e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div>
                                                    <label className="block text-sm text-gray-700 mb-1">Date</label>
                                                    <input type="date" value={newEvent.date} onChange={e=>setNewEvent({...newEvent,date:e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm text-gray-700 mb-1">Time</label>
                                                    <input type="time" value={newEvent.time} onChange={e=>setNewEvent({...newEvent,time:e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-700 mb-1">Location</label>
                                                <input value={newEvent.location} onChange={e=>setNewEvent({...newEvent,location:e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                                            </div>
                                            <div className="flex gap-2 pt-2">
                                                <button onClick={()=>{ setShowAddEventAdmin(false); setEditEventId(null); }} className="px-4 py-2 border rounded-lg">Cancel</button>
                                                <button onClick={()=>{ if(!newEvent.title||!newEvent.date||!newEvent.time){alert('Please fill title, date and time');return;} if(editEventId){ setEventsAdmin(prev=> prev.map(ev=> ev.id===editEventId ? { ...ev, title:newEvent.title, date:newEvent.date, time:newEvent.time, location:newEvent.location } : ev)); } else { setEventsAdmin(prev=>[...prev,{ id: String(Date.now()), title:newEvent.title, date:newEvent.date, time:newEvent.time, location:newEvent.location }]); } setShowAddEventAdmin(false); setEditEventId(null); setNewEvent({ title:'', date:'', time:'', location:''}); }} className="px-4 py-2 bg-primary-600 text-white rounded-lg">{editEventId ? 'Save' : 'Add'}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {showViewEvent && viewEvent && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                                        <h3 className="text-lg font-semibold mb-4">Event Details</h3>
                                        <div className="space-y-2 text-sm text-gray-700">
                                            <div><span className="font-medium">Title:</span> {viewEvent.title}</div>
                                            <div><span className="font-medium">Date:</span> {viewEvent.date}</div>
                                            <div><span className="font-medium">Time:</span> {viewEvent.time}</div>
                                            <div><span className="font-medium">Location:</span> {viewEvent.location || '—'}</div>
                                        </div>
                                        <div className="flex justify-end gap-2 mt-4">
                                            <button className="px-4 py-2 border rounded-lg" onClick={()=>{ setShowViewEvent(false); setViewEvent(null); }}>Close</button>
                                            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg" onClick={()=>{ setShowViewEvent(false); setViewEvent(null); if(viewEvent){ setEditEventId(viewEvent.id); setNewEvent({ title:viewEvent.title, date:viewEvent.date, time:viewEvent.time, location:viewEvent.location || ''}); setShowAddEventAdmin(true); } }}>Edit</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'learning' && (
                        <div className="max-w-7xl mx-auto">
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">Learning Material</h1>
                            {/* Horizontal nav for sections */}
                            <div className="border-b border-gray-200 mb-4">
                                <nav className="-mb-px flex flex-wrap gap-2">
                                    <button onClick={() => setLearningSection('business')} className={`px-3 py-2 text-sm font-medium border-b-2 ${learningSection==='business' ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-600 hover:text-gray-800'}`}>Business Planning</button>
                                    <button onClick={() => setLearningSection('marketing')} className={`px-3 py-2 text-sm font-medium border-b-2 ${learningSection==='marketing' ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-600 hover:text-gray-800'}`}>Marketing & Sales</button>
                                    <button onClick={() => setLearningSection('financial')} className={`px-3 py-2 text-sm font-medium border-b-2 ${learningSection==='financial' ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-600 hover:text-gray-800'}`}>Financial Management</button>
                                    <button onClick={() => setLearningSection('operations')} className={`px-3 py-2 text-sm font-medium border-b-2 ${learningSection==='operations' ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-600 hover:text-gray-800'}`}>Operations</button>
                                    <button onClick={() => setLearningSection('leadership')} className={`px-3 py-2 text-sm font-medium border-b-2 ${learningSection==='leadership' ? 'border-primary-600 text-primary-700' : 'border-transparent text-gray-600 hover:text-gray-800'}`}>Leadership</button>
                                </nav>
                            </div>

                            {/* Table + Add Content button for selected section */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-4 flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        {learningSection === 'business' && 'Business Planning'}
                                        {learningSection === 'marketing' && 'Marketing & Sales'}
                                        {learningSection === 'financial' && 'Financial Management'}
                                        {learningSection === 'operations' && 'Operations'}
                                        {learningSection === 'leadership' && 'Leadership'}
                                        {' '}content
                                    </div>
                                    <button onClick={()=> setShowAddLearning(true)} className="px-3 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700">Add Content</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TITLE</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TYPE</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LAST UPDATED</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {learningData[learningSection].length === 0 ? (
                                                <tr>
                                                    <td colSpan={3} className="px-6 py-6 text-center text-sm text-gray-600">No content yet</td>
                                                </tr>
                                            ) : (
                                                learningData[learningSection].map(item => (
                                                    <tr key={item.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{item.title}</div></td>
                                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{item.type}</div></td>
                                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-500">{item.updated || '—'}</div></td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {showAddLearning && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                                        <h3 className="text-lg font-semibold mb-4">Add Content</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm text-gray-700 mb-1">Title</label>
                                                <input value={newLearning.title} onChange={e=>setNewLearning({...newLearning,title:e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-700 mb-1">Type</label>
                                                <select value={newLearning.type} onChange={e=>setNewLearning({...newLearning, type: e.target.value as any})} className="w-full px-3 py-2 border rounded-lg">
                                                    <option>Article</option>
                                                    <option>Video</option>
                                                    <option>PDF</option>
                                                </select>
                                            </div>
                                            <div className="flex gap-2 pt-2">
                                                <button onClick={()=> setShowAddLearning(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                                                <button onClick={()=>{ if(!newLearning.title.trim()){alert('Please enter a title'); return;} const id = String(Date.now()); const updated = new Date().toLocaleDateString(); setLearningData(prev=>({ ...prev, [learningSection]: [...prev[learningSection], { id, title: newLearning.title, type: newLearning.type, updated }] })); setShowAddLearning(false); setNewLearning({ title: '', type: 'Article' }); }} className="px-4 py-2 bg-primary-600 text-white rounded-lg">Add</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'mentorship' && (
                        <div className="max-w-7xl mx-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-2xl font-bold text-gray-900">Mentorship</h1>
                                <button onClick={()=>setShowAddMentor(true)} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm">Add Mentor</button>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">NAME</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EXPERTISE</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CONTACT</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {mentors.length === 0 ? (
                                                <tr>
                                                    <td colSpan={3} className="px-6 py-6 text-center text-sm text-gray-600">No mentors yet</td>
                                                </tr>
                                            ) : (
                                                mentors.map(m => (
                                                    <tr key={m.id}>
                                                        <td className="px-6 py-3 text-sm text-gray-900">{m.name}</td>
                                                        <td className="px-6 py-3 text-sm text-gray-600">{m.expertise}</td>
                                                        <td className="px-6 py-3 text-sm text-gray-600">{m.contact || '—'}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {showAddMentor && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                                        <h3 className="text-lg font-semibold mb-4">Add Mentor</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm text-gray-700 mb-1">Name</label>
                                                <input value={newMentor.name} onChange={e=>setNewMentor({...newMentor,name:e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-700 mb-1">Expertise</label>
                                                <input value={newMentor.expertise} onChange={e=>setNewMentor({...newMentor,expertise:e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-700 mb-1">Contact</label>
                                                <input value={newMentor.contact} onChange={e=>setNewMentor({...newMentor,contact:e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                                            </div>
                                            <div className="flex gap-2 pt-2">
                                                <button onClick={()=>setShowAddMentor(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                                                <button onClick={()=>{ if(!newMentor.name.trim()||!newMentor.expertise.trim()){alert('Please enter name and expertise');return;} setMentors(prev=>[...prev,{ id:String(Date.now()), name:newMentor.name, expertise:newMentor.expertise, contact:newMentor.contact }]); setShowAddMentor(false); setNewMentor({ name:'', expertise:'', contact:''}); }} className="px-4 py-2 bg-primary-600 text-white rounded-lg">Add</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'funding' && (
                        <div className="max-w-7xl mx-auto">
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-2xl font-bold text-gray-900">Funding</h1>
                                <button onClick={()=>setShowAddFunding(true)} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm">Add Funding</button>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TITLE</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PROVIDER</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DEADLINE</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {fundingItems.length === 0 ? (
                                                <tr>
                                                    <td colSpan={3} className="px-6 py-6 text-center text-sm text-gray-600">No funding opportunities yet</td>
                                                </tr>
                                            ) : (
                                                fundingItems.map(f => (
                                                    <tr key={f.id}>
                                                        <td className="px-6 py-3 text-sm text-gray-900">{f.title}</td>
                                                        <td className="px-6 py-3 text-sm text-gray-600">{f.provider}</td>
                                                        <td className="px-6 py-3 text-sm text-gray-600">{f.deadline || '—'}</td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {showAddFunding && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                                        <h3 className="text-lg font-semibold mb-4">Add Funding</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-sm text-gray-700 mb-1">Title</label>
                                                <input value={newFunding.title} onChange={e=>setNewFunding({...newFunding,title:e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-700 mb-1">Provider</label>
                                                <input value={newFunding.provider} onChange={e=>setNewFunding({...newFunding,provider:e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                                            </div>
                                            <div>
                                                <label className="block text-sm text-gray-700 mb-1">Deadline</label>
                                                <input type="date" value={newFunding.deadline} onChange={e=>setNewFunding({...newFunding,deadline:e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
                                            </div>
                                            <div className="flex gap-2 pt-2">
                                                <button onClick={()=>setShowAddFunding(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                                                <button onClick={()=>{ if(!newFunding.title.trim()||!newFunding.provider.trim()){alert('Please enter title and provider');return;} setFundingItems(prev=>[...prev,{ id:String(Date.now()), title:newFunding.title, provider:newFunding.provider, deadline:newFunding.deadline }]); setShowAddFunding(false); setNewFunding({ title:'', provider:'', deadline:''}); }} className="px-4 py-2 bg-primary-600 text-white rounded-lg">Add</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}