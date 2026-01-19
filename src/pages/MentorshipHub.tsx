// src/pages/MentorshipHub.tsx
import React, { useState } from 'react';
import FindMentor from './mentorship/FindMentor';
import PeerSupportGroups from './mentorship/PeerSupportGroups';
import MyConnections from './MyConnections';
import ChatPage from './mentorship/ChatPage';
import MentorChatPage from './mentorship/MentorChatPage';
import GroupChatPage from './mentorship/GroupChatPage';

const MentorshipHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState('find-mentor');
  const [showChat, setShowChat] = useState(false);
  const [showMentorChat, setShowMentorChat] = useState(false);
  const [showGroupChat, setShowGroupChat] = useState(false);
  
  const [currentChatDetails, setCurrentChatDetails] = useState<{
    otherUserId: string;
    otherUserName: string;
    otherUserEmail: string;
  } | null>(null);
  
  const [currentMentorChatDetails, setCurrentMentorChatDetails] = useState<{
    mentorId: string;
    mentorName: string;
    mentorEmail?: string;
  } | null>(null);
  
  const [currentGroupChatDetails, setCurrentGroupChatDetails] = useState<{
    groupId: string;
    groupName: string;
  } | null>(null);

  const tabs = [
    { id: 'find-mentor', name: 'Find Mentor' },
    { id: 'peer-support', name: 'Peer Support' },
    { id: 'my-connections', name: 'My Connections' }
  ];

  // Get current user ID from localStorage
  const getCurrentUserId = (): string => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        return userData.userId || userData.id || userData._id || '';
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    
    // Fallback to email
    const email = localStorage.getItem('userEmail') || '';
    return email || 'current-user';
  };

  // Get current user object
  const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    if (!user) return null;
    
    try {
      return JSON.parse(user);
    } catch (e) {
      console.error('Error parsing user data:', e);
      return null;
    }
  };

  // Handle starting chat with another user
  const handleStartUserChat = async (userId: string, userName: string, userEmail: string) => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert('Please login to start a chat');
      return;
    }

    console.log('Starting user chat with:', { userId, userName, userEmail });

    // Get current user ID
    const currentUserId = currentUser.userId || currentUser.id || currentUser._id;
    if (!currentUserId) {
      alert('Your user information is incomplete. Please log in again.');
      return;
    }

    let finalUserId = userId;
    
    // If we don't have a userId, try to get it from email
    if (!finalUserId || finalUserId === 'undefined') {
      console.log('No userId provided, trying to get from email:', userEmail);
      try {
        if (userEmail) {
          // We need to get userId from email - this requires an API endpoint
          // For now, we'll show an error
          alert(`Cannot start chat: User account for ${userEmail} was not found. Please try connecting with them first.`);
          return;
        } else {
          alert('Cannot start chat: No email address provided.');
          return;
        }
      } catch (error: any) {
        alert(`Cannot start chat: ${error.message || 'User not found.'}`);
        return;
      }
    }

    // Validate the userId
    if (!finalUserId || finalUserId === 'undefined') {
      alert('Cannot start chat: Invalid user information.');
      return;
    }

    console.log('Opening user chat with:', {
      currentUserId,
      otherUserId: finalUserId,
      otherUserName: userName,
      otherUserEmail: userEmail
    });

    // We have valid user IDs
    setCurrentChatDetails({
      otherUserId: finalUserId,
      otherUserName: userName,
      otherUserEmail: userEmail
    });
    setShowChat(true);
  };

  // Handle starting chat with a mentor
  const handleStartMentorChat = (mentorId: string, mentorName: string, mentorEmail?: string) => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert('Please login to start a chat');
      return;
    }

    console.log('Starting mentor chat with:', { mentorId, mentorName, mentorEmail });

    if (!mentorId || mentorId === 'undefined') {
      alert('Cannot start chat: Invalid mentor information.');
      return;
    }

    // For mentors, we use mentorId directly (not a user ID)
    setCurrentMentorChatDetails({
      mentorId,
      mentorName,
      mentorEmail
    });
    setShowMentorChat(true);
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

  // Handle close user chat
  const handleCloseChat = () => {
    setShowChat(false);
    setCurrentChatDetails(null);
  };

  // Handle close mentor chat
  const handleCloseMentorChat = () => {
    setShowMentorChat(false);
    setCurrentMentorChatDetails(null);
  };

  // Handle open group chat
  const handleOpenGroupChat = (groupId: string, groupName: string) => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      alert('Please login to join group chat');
      return;
    }

    console.log('Opening group chat:', { groupId, groupName });
    
    setCurrentGroupChatDetails({
      groupId,
      groupName
    });
    setShowGroupChat(true);
  };

  // Handle close group chat
  const handleCloseGroupChat = () => {
    setShowGroupChat(false);
    setCurrentGroupChatDetails(null);
  };

  // Join group handler
  const handleJoinGroup = async (groupId: string) => {
    try {
      console.log('Joining group:', groupId);
      // Implementation would be in the PeerSupportGroups component
    } catch (error) {
      console.error('Error joining group:', error);
    }
  };

  // Leave group handler
  const handleLeaveGroup = async (groupId: string) => {
    try {
      console.log('Leaving group:', groupId);
      // Implementation would be in the PeerSupportGroups component
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in px-2 sm:px-0">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Mentorship Hub</h1>
        <p className="text-gray-600 text-sm">Connect with experienced mentors and supportive peers in your community</p>
      </div>

      {/* User-to-User Chat Modal */}
      {showChat && currentChatDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl bg-white rounded-xl overflow-hidden shadow-2xl">
            <ChatPage
              conversationId=""
              currentUserId={getCurrentUserId()}
              otherUserId={currentChatDetails.otherUserId}
              otherUserName={currentChatDetails.otherUserName}
              otherUserEmail={currentChatDetails.otherUserEmail}
              onClose={handleCloseChat}
            />
          </div>
        </div>
      )}

      {/* Mentor Chat Modal */}
      {showMentorChat && currentMentorChatDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl bg-white rounded-xl overflow-hidden shadow-2xl">
            <MentorChatPage
              mentorId={currentMentorChatDetails.mentorId}
              mentorName={currentMentorChatDetails.mentorName}
              mentorEmail={currentMentorChatDetails.mentorEmail}
              currentUserId={getCurrentUserId()}
              onClose={handleCloseMentorChat}
            />
          </div>
        </div>
      )}

      {/* Group Chat Modal */}
      {showGroupChat && currentGroupChatDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl bg-white rounded-xl overflow-hidden shadow-2xl">
            <GroupChatPage
              groupId={currentGroupChatDetails.groupId}
              groupName={currentGroupChatDetails.groupName}
              currentUserId={getCurrentUserId()}
              onClose={handleCloseGroupChat}
            />
          </div>
        </div>
      )}

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
              onStartChat={handleStartMentorChat}
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
              onStartChat={handleStartUserChat}
              onStartVideoCall={handleStartVideoCall}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MentorshipHub;