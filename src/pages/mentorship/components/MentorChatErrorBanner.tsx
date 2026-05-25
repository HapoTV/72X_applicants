import React from 'react';
import { Mail } from 'lucide-react';

interface Props {
  error: string;
  mentorEmail?: string;
  mentorName: string;
  onSendEmail: () => void;
  onDismiss: () => void;
}

const MentorChatErrorBanner: React.FC<Props> = ({ error, mentorEmail, mentorName, onSendEmail, onDismiss }) => (
  <div className="bg-yellow-50 border border-yellow-200 p-3 m-4 rounded-lg">
    <div className="flex items-start space-x-2">
      <span className="text-yellow-600 mt-0.5">ℹ</span>
      <div className="flex-1">
        <p className="text-yellow-800 text-sm">{error}</p>
        {mentorEmail && error.includes('email') && (
          <button
            onClick={onSendEmail}
            type="button"
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm flex items-center space-x-2"
          >
            <Mail className="w-4 h-4" />
            <span>Send Email Instead</span>
          </button>
        )}
      </div>
    </div>
    <button
      onClick={onDismiss}
      type="button"
      className="text-yellow-600 hover:text-yellow-800 text-xs mt-2 ml-7"
    >
      Dismiss
    </button>
  </div>
);

export default MentorChatErrorBanner;
