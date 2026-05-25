import React from 'react';
import { Paperclip, Image, Send, Mail } from 'lucide-react';

interface Props {
  newMessage: string;
  onNewMessageChange: (value: string) => void;
  onSendMessage: () => void;
  sending: boolean;
  disabled: boolean;
  mentorEmail?: string;
  mentorName: string;
  onSendEmail: () => void;
}

const MentorChatInput: React.FC<Props> = ({
  newMessage,
  onNewMessageChange,
  onSendMessage,
  sending,
  disabled,
  mentorEmail,
  mentorName,
  onSendEmail,
}) => (
  <div className="border-t border-gray-200 p-4">
    <div className="flex space-x-2">
      <button
        className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
        disabled={disabled}
        title="Attach file"
        type="button"
      >
        <Paperclip className="w-5 h-5" />
      </button>
      <button
        className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
        disabled={disabled}
        title="Attach image"
        type="button"
      >
        <Image className="w-5 h-5" />
      </button>
      <input
        type="text"
        value={newMessage}
        onChange={(e) => onNewMessageChange(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
        placeholder={`Message ${mentorName}...`}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
        disabled={sending || disabled}
      />
      <button
        onClick={onSendMessage}
        disabled={sending || !newMessage.trim() || disabled}
        className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        type="button"
        title="Send message"
      >
        {sending ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="w-4 h-4" />}
      </button>
    </div>
    {mentorEmail && (
      <div className="mt-2 flex items-center justify-between">
        <p className="text-xs text-gray-500">Or contact directly via email</p>
        <button
          onClick={onSendEmail}
          type="button"
          className="text-xs text-blue-600 hover:text-blue-800 hover:underline flex items-center space-x-1"
        >
          <Mail className="w-3 h-3" />
          <span>Email {mentorName}</span>
        </button>
      </div>
    )}
  </div>
);

export default MentorChatInput;
