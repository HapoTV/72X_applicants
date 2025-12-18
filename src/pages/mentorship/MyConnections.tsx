// src/pages/mentorship/MyConnections.tsx
import React, { useState, useEffect } from 'react';
import { MessageSquare, Video, UserPlus, X, Clock, CheckCircle, XCircle, Phone, Mail, Users } from 'lucide-react';
import { mentorshipService } from '../../services/MentorshipService';
import type { Connection, Conversation, Mentor, PeerSupportGroup } from '../../interfaces/MentorshipData';

interface MyConnectionsProps {
  onStartChat: (connectionId: string) => void;
  onStartVideoCall: (connectionId: string) => void;
}

const MyConnections: React.FC<MyConnectionsProps> = ({ onStartChat, onStartVideoCall }) => {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [showConnectionDetails, setShowConnectionDetails] = useState(false);
  const [userId, setUserId] = useState<string>('');
  const [showAddConnectionModal, setShowAddConnectionModal] = useState(false);
  const [newConnectionEmail, setNewConnectionEmail] = useState('');
  const [newConnectionType, setNewConnectionType] = useState<'Mentor' | 'Peer' | 'Mentee'>('Peer');

  useEffect(() => {
    // Get user ID from localStorage or context
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserId(userData.userId || userData.id || '');
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const fetchData = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    try {
      // Since we don't have a direct connections API, we'll fetch from multiple sources
      const [mentors, myGroups, conversationsData] = await Promise.all([
        mentorshipService.getAllMentors(),
        mentorshipService.getMyGroups(userId),
        mentorshipService.getConversations(userId)
      ]);
      
      // Transform mentors and group members into connections
      const mentorConnections = mentors.map(mentor => ({
        id: `mentor-${mentor.mentorId}`,
        userId: mentor.mentorId,
        name: mentor.name,
        email: mentor.contactInfo || '',
        type: 'Mentor' as const,
        lastContact: mentor.createdAt ? mentorshipService.formatDateRelative(mentor.createdAt) : 'Never',
        status: 'Connected' as const,
        conversationId: undefined
      }));
      
      // Get group members from user's groups and create connections
      const groupConnectionsPromises = myGroups.map(async group => {
        if (group.isMember) {
          const members = await mentorshipService.getGroupMembers(group.groupId);
          return members.filter(member => member.userId !== userId).map(member => ({
            id: `group-member-${member.memberId}`,
            userId: member.userId,
            name: member.userName,
            email: member.userEmail,
            type: 'Peer' as const,
            lastContact: member.joinedAt ? mentorshipService.formatDateRelative(member.joinedAt) : 'Never',
            status: 'Connected' as const,
            conversationId: undefined,
            groupId: group.groupId
          }));
        }
        return [];
      });
      
      const groupConnectionsArrays = await Promise.all(groupConnectionsPromises);
      const groupConnections = groupConnectionsArrays.flat();
      
      // Combine all connections
      const allConnections = [...mentorConnections, ...groupConnections];
      
      // Remove duplicates based on email
      const uniqueConnections = Array.from(
        new Map(allConnections.map(conn => [conn.email, conn])).values()
      );
      
      setConnections(uniqueConnections);
      setConversations(conversationsData);
    } catch (err) {
      setError('Failed to load connections. Please try again later.');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getConnectionConversation = (connection: Connection) => {
    return conversations.find(conv => 
      conv.user2Email === connection.email ||
      conv.user1Email === connection.email
    );
  };

  const handleViewDetails = (connection: Connection) => {
    setSelectedConnection(connection);
    setShowConnectionDetails(true);
  };

  const handleRemoveConnection = async (connectionId: string) => {
    if (!window.confirm('Are you sure you want to remove this connection?')) {
      return;
    }

    if (!userId) {
      alert('Please login to remove a connection');
      return;
    }

    try {
      // Find if this is a group member connection
      const connection = connections.find(conn => conn.id === connectionId);
      if (connection && 'groupId' in connection) {
        // Leave the group instead of removing connection
        await mentorshipService.leavePeerGroup(connection.groupId, userId);
      }
      
      // Remove from local state
      setConnections(prev => prev.filter(conn => conn.id !== connectionId));
      
      // Show success message
      alert('Connection removed successfully!');
    } catch (error) {
      console.error('Error removing connection:', error);
      alert('Failed to remove connection. Please try again.');
    }
  };

  const handleSendEmail = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  const handleAddConnection = async () => {
    if (!newConnectionEmail.trim()) {
      alert('Please enter an email address');
      return;
    }

    if (!userId) {
      alert('Please login to add a connection');
      return;
    }

    try {
      // Since we don't have a direct add connection API, we'll simulate it
      // In a real app, this would send a connection request
      const newConnection: Connection = {
        id: `new-${Date.now()}`,
        userId: `user-${Date.now()}`,
        name: newConnectionEmail.split('@')[0], // Use email prefix as name
        email: newConnectionEmail,
        type: newConnectionType,
        lastContact: 'Just now',
        status: 'Pending',
        conversationId: undefined
      };
      
      // Add to local state
      setConnections(prev => [...prev, newConnection]);
      
      // Reset form
      setNewConnectionEmail('');
      setNewConnectionType('Peer');
      setShowAddConnectionModal(false);
      
      alert('Connection request sent successfully!');
    } catch (error) {
      console.error('Error adding connection:', error);
      alert('Failed to add connection. Please try again.');
    }
  };

  const handleStartChat = (connection: Connection) => {
    // Create a conversation ID based on user IDs
    const conversationId = `conv-${userId}-${connection.userId}`;
    
    // Check if conversation already exists
    const existingConversation = conversations.find(conv => 
      conv.conversationId === conversationId ||
      (conv.user1Email === connection.email || conv.user2Email === connection.email)
    );
    
    if (existingConversation) {
      onStartChat(existingConversation.conversationId);
    } else {
      // Start new conversation
      onStartChat(conversationId);
    }
  };

  if (!userId) {
    return (
      <div className="text-center py-12">
        <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Please Login</h3>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          You need to login to view and manage your connections.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600">Loading connections...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <X className="w-5 h-5 text-red-600" />
          <span className="text-red-800 text-sm">{error}</span>
        </div>
        <button
          onClick={fetchData}
          className="mt-3 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">My Connections</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">{connections.length} connections</span>
          <button 
            onClick={() => setShowAddConnectionModal(true)}
            className="p-2 text-primary-600 hover:text-primary-800 hover:bg-primary-50 rounded-full transition-colors"
            title="Add Connection"
          >
            <UserPlus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {connections.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No connections yet</h3>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Connect with mentors from the mentor directory or join peer support groups to build your network.
          </p>
          <button
            onClick={() => setShowAddConnectionModal(true)}
            className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Add Connection
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {connections.map(connection => {
            const conversation = getConnectionConversation(connection);
            const unreadCount = conversation?.unreadCount || 0;
            
            return (
              <div key={connection.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img 
                        src={mentorshipService.getUserImageUrl(connection.name)}
                        alt={connection.name}
                        className="w-12 h-12 object-cover rounded-full"
                      />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900 text-sm">{connection.name}</h4>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          connection.type === 'Mentor' 
                            ? 'bg-blue-100 text-blue-800' 
                            : connection.type === 'Mentee'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {connection.type}
                        </span>
                      </div>
                      <p className="text-gray-600 text-xs">{connection.email}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-gray-500 text-xs">{connection.lastContact}</span>
                        </div>
                        {connection.status === 'Active' || connection.status === 'Connected' ? (
                          <div className="flex items-center space-x-1">
                            <CheckCircle className="w-3 h-3 text-green-500" />
                            <span className="text-green-600 text-xs">{connection.status}</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-1">
                            <XCircle className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-500 text-xs">{connection.status}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex space-x-1">
                      <button
                        onClick={() => handleViewDetails(connection)}
                        className="px-2 py-1 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleRemoveConnection(connection.id)}
                        className="px-2 py-1 text-xs text-red-600 hover:text-red-900 hover:bg-red-50 rounded"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-100">
                  {conversation ? (
                    <>
                      <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                        Last message: {conversation.lastMessage}
                      </p>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleStartChat(connection)}
                          className="flex-1 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-xs flex items-center justify-center space-x-1"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Message {unreadCount > 0 ? `(${unreadCount})` : ''}</span>
                        </button>
                        <button 
                          onClick={() => onStartVideoCall(connection.id)}
                          className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs flex items-center justify-center space-x-1"
                        >
                          <Video className="w-3 h-3" />
                          <span>Video Call</span>
                        </button>
                        <button 
                          onClick={() => handleSendEmail(connection.email)}
                          className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          title="Send Email"
                        >
                          <Mail className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleStartChat(connection)}
                        className="flex-1 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-xs flex items-center justify-center space-x-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Start Chat</span>
                      </button>
                      <button 
                        onClick={() => onStartVideoCall(connection.id)}
                        className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-xs flex items-center justify-center space-x-1"
                      >
                        <Video className="w-3 h-3" />
                        <span>Video Call</span>
                      </button>
                      <button 
                        onClick={() => handleSendEmail(connection.email)}
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        title="Send Email"
                      >
                        <Mail className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Connection Modal */}
      {showAddConnectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Connection</h3>
              <button 
                onClick={() => setShowAddConnectionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Email Address *</label>
                <input 
                  type="email"
                  value={newConnectionEmail}
                  onChange={(e) => setNewConnectionEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="person@example.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-700 mb-1">Connection Type</label>
                <select 
                  value={newConnectionType}
                  onChange={(e) => setNewConnectionType(e.target.value as any)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="Mentor">Mentor</option>
                  <option value="Peer">Peer</option>
                  <option value="Mentee">Mentee</option>
                </select>
              </div>
              
              <div className="text-sm text-gray-600">
                <p className="mb-2">Note: This will send a connection request to the user.</p>
                <p>You can also connect with people by:</p>
                <ul className="list-disc pl-4 mt-1">
                  <li>Joining peer support groups</li>
                  <li>Exploring mentors in the directory</li>
                  <li>Participating in group discussions</li>
                </ul>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <button 
                  onClick={() => setShowAddConnectionModal(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddConnection}
                  className="flex-1 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm flex items-center justify-center space-x-1"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Send Request</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connection Details Modal */}
      {showConnectionDetails && selectedConnection && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Connection Details</h3>
              <button 
                onClick={() => setShowConnectionDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <img 
                  src={mentorshipService.getUserImageUrl(selectedConnection.name)}
                  alt={selectedConnection.name}
                  className="w-16 h-16 object-cover rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{selectedConnection.name}</h4>
                  <p className="text-gray-600 text-sm">{selectedConnection.email}</p>
                  <span className={`px-2 py-1 text-xs rounded-full mt-1 inline-block ${
                    selectedConnection.type === 'Mentor' 
                      ? 'bg-blue-100 text-blue-800' 
                      : selectedConnection.type === 'Mentee'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedConnection.type}
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Status</p>
                  <p className={`font-medium ${
                    selectedConnection.status === 'Active' || selectedConnection.status === 'Connected'
                      ? 'text-green-600' 
                      : 'text-gray-600'
                  }`}>
                    {selectedConnection.status}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Last Contact</p>
                  <p className="font-medium text-gray-900">{selectedConnection.lastContact}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">Connection Type</p>
                  <p className="font-medium text-gray-900">
                    {selectedConnection.type === 'Mentor' ? 'Mentor' : 
                     selectedConnection.type === 'Mentee' ? 'Mentee' : 'Peer'}
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-4">
                <button 
                  onClick={() => {
                    handleStartChat(selectedConnection);
                    setShowConnectionDetails(false);
                  }}
                  className="flex-1 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                >
                  Message
                </button>
                <button 
                  onClick={() => {
                    onStartVideoCall(selectedConnection.id);
                    setShowConnectionDetails(false);
                  }}
                  className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center space-x-1"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyConnections;