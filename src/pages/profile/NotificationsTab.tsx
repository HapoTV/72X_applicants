import React from 'react';

type NotificationPreferences = {
  email: { dailyQuotes: boolean; aiInsights: boolean; dataAnalysis: boolean; weeklyReports: boolean };
  push: { urgentAlerts: boolean; goalMilestones: boolean; newResources: boolean };
};

interface NotificationsTabProps {
  preferences: NotificationPreferences;
  saving: boolean;
  onChange: (updated: NotificationPreferences) => void;
  onSave: () => void;
}

const EMAIL_ITEMS = [
  { id: 'dailyQuotes', label: 'Daily motivation quotes' },
  { id: 'aiInsights', label: 'AI insights and recommendations' },
  { id: 'dataAnalysis', label: 'Data analysis completion' },
  { id: 'weeklyReports', label: 'Weekly business reports' },
] as const;

const PUSH_ITEMS = [
  { id: 'urgentAlerts', label: 'Urgent business alerts' },
  { id: 'goalMilestones', label: 'Goal milestone achievements' },
  { id: 'newResources', label: 'New resources available' },
] as const;

const checkboxClass = 'w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-2 focus:ring-primary-500';

const NotificationsTab: React.FC<NotificationsTabProps> = ({ preferences, saving, onChange, onSave }) => (
  <div className="p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h2>
    <div className="space-y-6">
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">Email Notifications</h4>
        <div className="space-y-3">
          {EMAIL_ITEMS.map(({ id, label }) => (
            <label key={id} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={preferences.email[id]}
                onChange={(e) => onChange({ ...preferences, email: { ...preferences.email, [id]: e.target.checked } })}
                className={checkboxClass}
              />
              <span className="text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">Push Notifications</h4>
        <div className="space-y-3">
          {PUSH_ITEMS.map(({ id, label }) => (
            <label key={id} className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={preferences.push[id]}
                onChange={(e) => onChange({ ...preferences, push: { ...preferences.push, [id]: e.target.checked } })}
                className={checkboxClass}
              />
              <span className="text-gray-700">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
    <button
      onClick={onSave}
      disabled={saving}
      className="mt-6 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
    >
      {saving ? 'Saving...' : 'Save Preferences'}
    </button>
  </div>
);

export default NotificationsTab;
