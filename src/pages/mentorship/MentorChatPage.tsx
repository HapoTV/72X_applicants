// src/pages/mentorship/MentorChatPage.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Paperclip, Image, MessageSquare, Mail } from 'lucide-react';
import { mentorshipService } from '../../services/MentorshipService';

interface MentorChatPageProps {
  mentorId: string;
  mentorName: string;
  mentorEmail?: string;
  currentUserId: string;
  onClose: () => void;
}

const MentorChatPage: React.FC<MentorChatPageProps> = ({
  mentorId,
  mentorName,
  mentorEmail,
  currentUserId,
  onClose
}) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mentorId || !currentUserId) {
      setError('Mentor information or user information is missing');
      return;
    }
    
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [mentorId, currentUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!mentorId || !currentUserId) {
      console.error('Cannot fetch messages: missing mentorId or userId');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      console.log('Fetching messages with mentor:', mentorId, 'user:', currentUserId);
      
      // For now, we'll use mock messages since mentor messaging API might not exist
      // In production, you would call: mentorshipService.getMentorMessages(mentorId, currentUserId)
      const mockMessages = [
        {
          messageId: 'mentor-msg-1',
          mentorId: mentorId,
          senderId: currentUserId,
          senderName: 'You',
          content: `Hi ${mentorName}, I'd like to learn more about your expertise.`,
          messageType: 'TEXT',
          timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          isRead: true
        },
        {
          messageId: 'mentor-msg-2',
          mentorId: mentorId,
          senderId: 'mentor-' + mentorId,
          senderName: mentorName,
          content: 'Hello! I\'d be happy to help. What would you like to know?',
          messageType: 'TEXT',
          timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
          isRead: true
        }
      ];
      
      setMessages(mockMessages);
      
    } catch (error: any) {
      console.error('Error fetching mentor messages:', error);
      setError('Failed to load messages. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    if (!mentorId || !currentUserId) {
      setError('Cannot send message: Missing information');
      return;
    }

    const currentUser = mentorshipService.getCurrentUser();
    
    const messageData = {
      messageId: `temp-${Date.now()}`,
      mentorId,
      senderId: currentUserId,
      senderName: currentUser?.name || 'You',
      senderEmail: currentUser?.email || '',
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
      console.log('Sending message to mentor:', messageData);
      
      // In production, you would call: mentorshipService.sendMentorMessage(mentorId, messageData)
      // For now, simulate sending
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update message with "sent" status
      setMessages(prev => 
        prev.map(msg => 
          msg.messageId === messageData.messageId 
            ? { ...msg, isRead: false } 
            : msg
        )
      );
      
      // Show success message
      setError('Message sent! (Note: Mentor messaging is simulated for now)');
      
    } catch (error: any) {
      console.error('Error sending message to mentor:', error);
      
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.messageId !== messageData.messageId));
      
      // Show email fallback option
      if (mentorEmail) {
        setError(`Mentor messaging is not yet available. Would you like to email ${mentorName} at ${mentorEmail} instead?`);
      } else {
        setError(`Failed to send message: ${error.message || 'Please try again.'}`);
      }
    } finally {
      setSending(false);
    }
  };

  const handleSendEmail = () => {
    if (mentorEmail) {
      const subject = `Message regarding mentorship - ${mentorName}`;
      const body = `Dear ${mentorName},\n\nI saw your mentor profile and would like to connect with you.\n\n`;
      window.location.href = `mailto:${mentorEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-primary-500 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-primary-500" />
          </div>
          <div>
            <h3 className="font-semibold">{mentorName}</h3>
            <p className="text-sm text-primary-100">Mentor</p>
            {mentorEmail && (
              <p className="text-xs text-primary-200">{mentorEmail}</p>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border-b border-blue-200 p-3">
        <div className="flex items-center space-x-2">
          <MessageSquare className="w-4 h-4 text-blue-600" />
          <p className="text-sm text-blue-800">
            Chatting with <span className="font-semibold">{mentorName}</span>. Messages are simulated for demonstration.
          </p>
        </div>
      </div>

      {/* Error/Info Message */}
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 p-3 m-4 rounded-lg">
          <div className="flex items-start space-x-2">
            <span className="text-yellow-600 mt-0.5">ℹ</span>
            <div className="flex-1">
              <p className="text-yellow-800 text-sm">{error}</p>
              {error.includes('email') && mentorEmail && (
                <button
                  onClick={handleSendEmail}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm flex items-center space-x-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Email Instead</span>
                </button>
              )}
            </div>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-yellow-600 hover:text-yellow-800 text-xs mt-2 ml-7"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {!mentorId || !currentUserId ? (
          <div className="text-center py-8">
            <span className="text-3xl text-gray-300">⚠</span>
            <p className="text-gray-500 mt-2">Cannot load chat: Information is missing.</p>
            <p className="text-gray-400 text-sm mt-2">
              Please close this chat and try again.
            </p>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No messages yet. Start a conversation with {mentorName}!</p>
            <p className="text-gray-400 text-sm mt-2">
              Ask questions about their expertise or request mentorship.
            </p>
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
                        {message.senderName || mentorName}
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
                        <span className="ml-2">✓ Sent</span>
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
          <button 
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            disabled={!mentorId || !currentUserId}
            title="Attach file"
          >
            <Paperclip className="w-5 h-5" />
          </button>
          <button 
            className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            disabled={!mentorId || !currentUserId}
            title="Attach image"
          >
            <Image className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={`Message ${mentorName}...`}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
            disabled={sending || !mentorId || !currentUserId}
          />
          <button
            onClick={handleSendMessage}
            disabled={sending || !newMessage.trim() || !mentorId || !currentUserId}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            title="Send message"
          >
            {sending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
        {mentorEmail && (
          <div className="mt-2 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Or contact directly via email
            </p>
            <button
              onClick={handleSendEmail}
              className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center space-x-1"
            >
              <Mail className="w-3 h-3" />
              <span>Email {mentorName}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorChatPage;