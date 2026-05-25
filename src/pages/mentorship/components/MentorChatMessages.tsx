import React from 'react';
import { MessageSquare } from 'lucide-react';

export interface MentorChatMessage {
  messageId: string;
  senderId: string;
  senderName?: string;
  content: string;
  timestamp: string;
  isRead?: boolean;
}

interface Props {
  messages: MentorChatMessage[];
  currentUserId: string;
  loading: boolean;
  mentorName: string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}

const MentorChatMessages: React.FC<Props> = ({ messages, currentUserId, loading, mentorName, messagesEndRef }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-8">
        <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No messages yet. Start a conversation with {mentorName}!</p>
        <p className="text-gray-400 text-sm mt-2">
          Ask questions about their expertise or request mentorship.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map(message => {
        const isOwnMessage = message.senderId === currentUserId;

        return (
          <div key={message.messageId} className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] rounded-lg p-3 ${isOwnMessage ? 'bg-primary-500 text-white rounded-br-none' : 'bg-white border border-gray-200 rounded-bl-none'}`}>
              {!isOwnMessage && (
                <p className="text-xs font-medium text-gray-700 mb-1">
                  {message.senderName || mentorName}
                </p>
              )}
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${isOwnMessage ? 'text-primary-100' : 'text-gray-500'}`}>
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {isOwnMessage && message.isRead && <span className="ml-2">✓ Sent</span>}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MentorChatMessages;
