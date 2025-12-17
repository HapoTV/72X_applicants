// src/pages/MentorshipHub.tsx
import React, { useState } from 'react';
import { Users, MessageSquare, Video, Star, Search, Filter, X } from 'lucide-react';
import FindMentor from './mentorship/FindMentor';
import PeerSupportGroups from './mentorship/PeerSupportGroups';
import MyConnections from './mentorship/MyConnections';

const MentorshipHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('find-mentor');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tabs = [
    { id: 'find-mentor', name: 'Find Mentor' },
    { id: 'peer-support', name: 'Peer Support' },
    { id: 'my-connections', name: 'My Connections' }
  ];

  // Handle starting chat with connection
  const handleStartChat = (connectionId: string) => {
    console.log('Starting chat with connection:', connectionId);
    // Implement chat functionality
    alert(`Chat with connection ${connectionId} will open in a future update`);
  };

  // Handle connecting with a mentor
  const handleConnectMentor = (mentorId: string) => {
    console.log('Connecting with mentor:', mentorId);
    alert(`Connection request sent to mentor ${mentorId}`);
  };

  // Handle starting video call with connection
  const handleStartVideoCall = (connectionId: string) => {
    console.log('Starting video call with connection:', connectionId);
    // Implement video call functionality
    alert(`Video call with connection ${connectionId} will open in a future update`);
  };

  return (
    <div className="space-y-4 animate-fade-in px-2 sm:px-0">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Mentorship Hub</h1>
        <p className="text-gray-600 text-sm">Connect with experienced mentors and supportive peers in your community</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 sm:py-4 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === 'find-mentor' && (
            <FindMentor
              onStartChat={handleStartChat}
              onConnect={handleConnectMentor}
            />
          )}

          {activeTab === 'peer-support' && (
            <PeerSupportGroups
              onJoinGroup={handleJoinGroup}
              onLeaveGroup={handleLeaveGroup}
              onOpenGroupChat={handleOpenGroupChat}
            />
          )}

          {activeTab === 'my-connections' && (
            <MyConnections
              onStartChat={handleStartChat}
              onStartVideoCall={handleStartVideoCall}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Add these handler functions that were missing
const handleJoinGroup = async (groupId: string) => {
  try {
    console.log('Joining group:', groupId);
    // Implementation would be in the PeerSupportGroups component
  } catch (error) {
    console.error('Error joining group:', error);
  }
};

const handleLeaveGroup = async (groupId: string) => {
  try {
    console.log('Leaving group:', groupId);
    // Implementation would be in the PeerSupportGroups component
  } catch (error) {
    console.error('Error leaving group:', error);
  }
};

const handleOpenGroupChat = (groupId: string) => {
  console.log('Opening chat for group:', groupId);
  // Implement chat functionality
  alert(`Chat for group ${groupId} will open in a future update`);
};

export default MentorshipHub;