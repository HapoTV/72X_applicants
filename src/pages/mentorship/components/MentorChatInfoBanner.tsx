import React from 'react';
import { MessageSquare } from 'lucide-react';

interface Props {
  mentorName: string;
}

const MentorChatInfoBanner: React.FC<Props> = ({ mentorName }) => (
  <div className="bg-blue-50 border-b border-blue-200 p-3">
    <div className="flex items-center space-x-2">
      <MessageSquare className="w-4 h-4 text-blue-600" />
      <p className="text-sm text-blue-800">
        Chatting with <span className="font-semibold">{mentorName}</span>. Messages are simulated for demonstration.
      </p>
    </div>
  </div>
);

export default MentorChatInfoBanner;
