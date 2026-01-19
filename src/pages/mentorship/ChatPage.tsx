// src/pages/mentorship/ChatPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Paperclip, Image, User } from 'lucide-react';
import { mentorshipService } from '../../services/MentorshipService';
import type { Message } from '../../interfaces/MentorshipData';

interface ChatInterfaceProps {
  conversationId: string;
  currentUserId: string;
  otherUserId: string;
  otherUserName: string;
  otherUserEmail: string;
  onClose: () => void;
}

const ChatPage: React.FC<ChatInterfaceProps> = ({
  conversationId,
  currentUserId,
  otherUserId,
  otherUserName,
  otherUserEmail,
  onClose
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentUserId || !otherUserId) {
      setError('User information is missing');
      return;
    }
    
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [conversationId, currentUserId, otherUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!currentUserId || !otherUserId || otherUserId === 'undefined') {
      console.error('Cannot fetch messages: missing user IDs', { currentUserId, otherUserId });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('Fetching messages between:', currentUserId, 'and', otherUserId);
      const messagesData = await mentorshipService.getMessagesBetweenUsers(currentUserId, otherUserId);
      setMessages(messagesData);
      
      // Mark messages as read
      if (messagesData.length > 0) {
        try {
          await mentorshipService.markMessagesAsRead(otherUserId, currentUserId);
        } catch (markError) {
          console.log('Could not mark messages as read:', markError);
        }
      }
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      
      if (error.response?.status === 404) {
        setError('No conversation found. Send a message to start one!');
      } else {
        setError('Failed to load messages. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    if (!currentUserId || !otherUserId || otherUserId === 'undefined') {
      setError('Cannot send message: Invalid user information');
      return;
    }

    const currentUser = mentorshipService.getCurrentUser();
    
    const messageData: Message = {
      messageId: `temp-${Date.now()}`,
      senderId: currentUserId,
      senderName: currentUser?.name || 'You',
      senderEmail: currentUser?.email || '',
      receiverId: otherUserId,
      receiverName: otherUserName,
      receiverEmail: otherUserEmail,
      content: newMessage.trim(),
      messageType: 'TEXT',
      timestamp: new Date().toISOString(),
      isRead: false
    };

    // Optimistically add message
    setMessages(prev => [...prev, messageData]);
    setNewMessage('');
    setSending(true);
    setError(null);

    try {
      console.log('Sending message:', messageData);
      const sentMessage = await mentorshipService.sendMessage(messageData);
      
      // Replace temporary message with actual one from server
      setMessages(prev => 
        prev.map(msg => 
          msg.messageId === messageData.messageId ? sentMessage : msg
        )
      );
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.messageId !== messageData.messageId));
      
      // Show appropriate error message
      if (error.message?.includes('Receiver not found')) {
        setError('Cannot send message: The recipient user account was not found. This might be a mentor profile without a user account.');
      } else {
        setError(`Failed to send message: ${error.message || 'Please try again.'}`);
      }
    } finally {
      setSending(false);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (error) {
      return 'Invalid time';
    }
  };

  const getMessageDisplayName = (message: Message, isOwnMessage: boolean) => {
    if (isOwnMessage) {
      return 'You';
    }
    return message.senderName || message.receiverName || 'Unknown';
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-primary-500 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-primary-500" />
          </div>
          <div>
            <h3 className="font-semibold">{otherUserName}</h3>
            <p className="text-sm text-primary-100">{otherUserEmail}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 p-3 m-4 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-600 hover:text-red-800 text-xs mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No messages yet. Start a conversation!</p>
            {otherUserId && (
              <p className="text-gray-400 text-sm mt-2">
                Send a message to {otherUserName}
              </p>
            )}
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
                        {getMessageDisplayName(message, isOwnMessage)}
                      </p>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        isOwnMessage ? 'text-primary-100' : 'text-gray-500'
                      }`}
                    >
                      {formatMessageTime(message.timestamp)}
                      {isOwnMessage && message.isRead && (
                        <span className="ml-2">✓ Read</span>
                      )}
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
            disabled={sending || !otherUserId || otherUserId === 'undefined'}
          />
          <button
            onClick={handleSendMessage}
            disabled={sending || !newMessage.trim() || !otherUserId || otherUserId === 'undefined'}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        {(!otherUserId || otherUserId === 'undefined') && (
          <p className="text-red-500 text-xs mt-2">
            Cannot send messages: Invalid recipient user information
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatPage;