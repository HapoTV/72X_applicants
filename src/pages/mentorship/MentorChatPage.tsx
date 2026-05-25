// src/pages/mentorship/MentorChatPage.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { mentorshipService } from '../../services/MentorshipService';
import MentorChatHeader from './components/MentorChatHeader';
import MentorChatInfoBanner from './components/MentorChatInfoBanner';
import MentorChatMessages from './components/MentorChatMessages';
import type { MentorChatMessage } from './components/MentorChatMessages';
import MentorChatInput from './components/MentorChatInput';
import MentorChatErrorBanner from './components/MentorChatErrorBanner';

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
  const [messages, setMessages] = useState<MentorChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = useCallback(async () => {
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
  }, [mentorId, currentUserId, mentorName]);

  useEffect(() => {
    if (!mentorId || !currentUserId) {
      setError('Mentor information or user information is missing');
      return;
    }
    
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [mentorId, currentUserId, fetchMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  return (
    <div className="flex flex-col h-full">
      <MentorChatHeader mentorName={mentorName} mentorEmail={mentorEmail} onClose={onClose} />
      <MentorChatInfoBanner mentorName={mentorName} />

      {error && (
        <MentorChatErrorBanner
          error={error}
          mentorEmail={mentorEmail}
          mentorName={mentorName}
          onSendEmail={handleSendEmail}
          onDismiss={() => setError(null)}
        />
      )}

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {!mentorId || !currentUserId ? (
          <div className="text-center py-8">
            <span className="text-3xl text-gray-300">⚠</span>
            <p className="text-gray-500 mt-2">Cannot load chat: Information is missing.</p>
            <p className="text-gray-400 text-sm mt-2">Please close this chat and try again.</p>
          </div>
        ) : (
          <MentorChatMessages
            messages={messages}
            currentUserId={currentUserId}
            loading={loading}
            mentorName={mentorName}
            messagesEndRef={messagesEndRef}
          />
        )}
      </div>

      <MentorChatInput
        newMessage={newMessage}
        onNewMessageChange={setNewMessage}
        onSendMessage={handleSendMessage}
        sending={sending}
        disabled={!mentorId || !currentUserId}
        mentorEmail={mentorEmail}
        mentorName={mentorName}
        onSendEmail={handleSendEmail}
      />
    </div>
  );
};

export default MentorChatPage;