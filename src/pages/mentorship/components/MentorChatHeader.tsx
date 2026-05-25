import React from 'react';
import { X, MessageSquare } from 'lucide-react';

interface Props {
  mentorName: string;
  mentorEmail?: string;
  onClose: () => void;
}

const MentorChatHeader: React.FC<Props> = ({ mentorName, mentorEmail, onClose }) => (
  <div className="bg-primary-500 text-white p-4 flex items-center justify-between">
    <div className="flex items-center space-x-3">
      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
        <MessageSquare className="w-6 h-6 text-primary-500" />
      </div>
      <div>
        <h3 className="font-semibold">{mentorName}</h3>
        <p className="text-sm text-primary-100">Mentor</p>
        {mentorEmail && <p className="text-xs text-primary-200">{mentorEmail}</p>}
      </div>
    </div>
    <button onClick={onClose} className="text-white hover:text-gray-200" type="button">
      <X className="w-6 h-6" />
    </button>
  </div>
);

export default MentorChatHeader;
