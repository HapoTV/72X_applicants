// src/pages/mentorship/GroupChatPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Paperclip, Image, Users, Menu } from 'lucide-react';
import { mentorshipService } from '../../services/MentorshipService';
import type { GroupMessage, GroupMember } from '../../interfaces/MentorshipData';

interface GroupChatPageProps {
  groupId: string;
  groupName: string;
  currentUserId: string;
  onClose: () => void;
}

const GroupChatPage: React.FC<GroupChatPageProps> = ({
  groupId,
  groupName,
  currentUserId,
  onClose
}) => {
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [groupId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchMessages(), fetchMembers()]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const messagesData = await mentorshipService.getGroupMessages(groupId);
      setMessages(messagesData);
      
      if (messagesData.length > 0) {
        await mentorshipService.markGroupMessagesAsRead(groupId, currentUserId);
      }
    } catch (error) {
      console.error('Error fetching group messages:', error);
    }
  };

  const fetchMembers = async () => {
    try {
      const membersData = await mentorshipService.getGroupMembers(groupId);
      setMembers(membersData);
    } catch (error) {
      console.error('Error fetching group members:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const currentUser = mentorshipService.getCurrentUser();
    const messageData: GroupMessage = {
      messageId: `temp-${Date.now()}`,
      groupId,
      senderId: currentUserId,
      senderName: currentUser?.name || 'User',
      content: newMessage.trim(),
      messageType: 'TEXT',
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setMessages(prev => [...prev, messageData]);
    setNewMessage('');
    setSending(true);

    try {
      await mentorshipService.sendGroupMessage(groupId, messageData);
      fetchMessages();
    } catch (error) {
      console.error('Error sending group message:', error);
      alert('Failed to send message. Please try again.');
      setMessages(prev => prev.filter(msg => msg.messageId !== messageData.messageId));
    } finally {
      setSending(false);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Members Sidebar */}
      {showMembers && (
        <div className="w-64 border-r border-gray-200 bg-gray-50 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Group Members</h3>
              <button
                onClick={() => setShowMembers(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mt-1">{members.length} members</p>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {members.map(member => (
              <div
                key={member.memberId}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white transition-colors"
              >
                <img
                  src={mentorshipService.getUserImageUrl(member.userName || 'User')}
                  alt={member.userName}
                  className="w-8 h-8 rounded-full"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {member.userName}
                    {member.userId === currentUserId && ' (You)'}
                  </p>
                  <p className="text-xs text-gray-500">{member.userEmail}</p>
                  <p className="text-xs text-gray-400 capitalize">{member.role.toLowerCase()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-primary-500 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowMembers(true)}
              className="hover:text-gray-200"
            >
              <Users className="w-5 h-5" />
            </button>
            <div>
              <h3 className="font-semibold">{groupName}</h3>
              <p className="text-sm text-primary-100">Group Chat</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map(message => {
                const isOwnMessage = message.senderId === currentUserId;
                
                return (
                  <div
                    key={message.messageId}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        isOwnMessage
                          ? 'bg-primary-500 text-white rounded-br-none'
                          : 'bg-white border border-gray-200 rounded-bl-none'
                      }`}
                    >
                      {!isOwnMessage && (
                        <p className="text-xs font-medium text-gray-700 mb-1">
                          {message.senderName}
                        </p>
                      )}
                      <p className="text-sm">{message.content}</p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwnMessage ? 'text-primary-100' : 'text-gray-500'
                        }`}
                      >
                        {formatMessageTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex space-x-2">
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-500 hover:text-gray-700">
              <Image className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message here..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={sending}
            />
            <button
              onClick={handleSendMessage}
              disabled={sending || !newMessage.trim()}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 flex items-center space-x-2"
            >
              {sending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupChatPage;