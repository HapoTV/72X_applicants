import React from 'react';
import { Trash2 } from 'lucide-react';

interface SecurityTabProps {
  downloadingData: boolean;
  deletingAccount: boolean;
  onChangePassword: () => void;
  onDownloadData: () => void;
  onDeleteAccount: () => void;
}

const SecurityTab: React.FC<SecurityTabProps> = ({
  downloadingData, deletingAccount,
  onChangePassword, onDownloadData, onDeleteAccount,
}) => (
  <div className="p-6">
    <h2 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h2>
    <div className="space-y-6">
      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">Password</h4>
        <button
          type="button"
          onClick={onChangePassword}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
        >
          Change Password
        </button>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">Two-Factor Authentication</h4>
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <p className="font-medium text-gray-900">Two-Factor Authentication is enabled</p>
            <p className="text-sm text-gray-600">For security, 2FA is enabled by default for all applicants.</p>
          </div>
          <span className="px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-semibold">
            Enabled
          </span>
        </div>
      </div>

      <div>
        <h4 className="text-md font-medium text-gray-900 mb-4">Data & Privacy</h4>
        <div className="space-y-3">
          <button
            onClick={onDownloadData}
            disabled={downloadingData}
            className="w-full text-left p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Download Your Data</p>
                <p className="text-sm text-gray-600">Get a copy of your business data</p>
              </div>
              <span className="text-primary-600">{downloadingData ? 'Preparing…' : 'Download'}</span>
            </div>
          </button>

          <button
            type="button"
            onClick={onDeleteAccount}
            disabled={deletingAccount}
            className="w-full text-left p-4 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-red-900">Delete Account</p>
                <p className="text-sm text-red-600">Permanently delete your account and data (cannot be undone)</p>
              </div>
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default SecurityTab;
