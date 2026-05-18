// src/pages/learning/learningUtils.ts
import React from 'react';
import { Video, FileText, Link as LinkIcon } from 'lucide-react';

export const getTypeIcon = (type?: string): React.ReactNode => {
  const t = (type || '').toLowerCase();
  if (t.includes('video')) return React.createElement(Video, { className: 'w-3 h-3' });
  if (t.includes('pdf') || t.includes('doc')) return React.createElement(FileText, { className: 'w-3 h-3' });
  return React.createElement(LinkIcon, { className: 'w-3 h-3' });
};
