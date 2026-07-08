import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessageSquare, Users, TrendingUp } from 'lucide-react';
import Discussion from './community/Discussion';
import Mentorship from './MentorshipHub';
import MyConnections from './MyConnections';

type PackageType = 'startup' | 'essential' | 'premium';
type TabId = 'discussions' | 'connections' | 'mentorship';

const getTabFromLocation = (pathname: string, search: string): TabId => {
  const params = new URLSearchParams(search);
  const requestedTab = params.get('tab') as TabId | null;

  if (requestedTab === 'discussions' || requestedTab === 'connections' || requestedTab === 'mentorship') {
    return requestedTab;
  }

  if (pathname === '/connections') return 'connections';
  if (pathname === '/mentorship' || pathname.endsWith('/mentorship')) return 'mentorship';
  return 'discussions';
};

const Community: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabId>(getTabFromLocation(location.pathname, location.search));

  // Mirror location changes to active tab (so redirects/links work)
  useEffect(() => {
    setActiveTab(getTabFromLocation(location.pathname, location.search));
  }, [location.pathname, location.search]);

  const tabs = [
    { id: 'discussions', name: 'Discussions', icon: MessageSquare },
    { id: 'connections', name: 'Connections', icon: Users },
    { id: 'mentorship', name: 'Mentorship', icon: TrendingUp },
  ];

  const userPackage = (localStorage.getItem('userPackage') || 'startup') as PackageType;
  const packageOrder: Record<PackageType, number> = { startup: 0, essential: 1, premium: 2 };
  const hasEssentialAccess = packageOrder[userPackage] >= packageOrder.essential;

  

  const renderAccessMessage = (title: string, description: string, upgradePath: string) => (
    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-600">
        <TrendingUp className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>
      <a
        href={upgradePath}
        className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
      >
        Upgrade to access
      </a>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Community</h1>
        <p className="text-gray-600">Explore discussions, connect with peers, and find mentorship all in one place.</p>
      </div>

      

      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex flex-col md:flex-row gap-3 px-6 py-3">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    const params = new URLSearchParams(location.search);
                    if (params.get('tab') !== tab.id) {
                      params.set('tab', tab.id);
                      navigate(`/community?${params.toString()}`, { replace: true });
                    }
                  }}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'discussions' && (
            <Discussion />
          )}

          {activeTab === 'connections' && (
            <div className="space-y-6">
              {hasEssentialAccess ? (
                <MyConnections />
              ) : (
                renderAccessMessage(
                  'Connections require Essential access',
                  'Upgrade to the Essential package to connect with other entrepreneurs and send chat requests.',
                  '/upgrade/connections'
                )
              )}
            </div>
          )}

          {activeTab === 'mentorship' && (
            <div className="space-y-6">
              {hasEssentialAccess ? (
                <Mentorship />
              ) : (
                renderAccessMessage(
                  'Mentorship requires Essential access',
                  'Upgrade to the Essential package to access mentors and book mentorship sessions.',
                  '/upgrade/mentorship'
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Community;
