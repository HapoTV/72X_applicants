// src/pages/adminDashboard/tabs/components/AddUserModal.tsx
import React from 'react';
import type { NewUserData } from './types';

interface AddUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: () => void;
  newUserData: NewUserData;
  setNewUserData: (data: NewUserData) => void;
  isSuperAdmin: boolean;
  userOrganisation: string | null;
  adding: boolean;
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  newUserData,
  setNewUserData,
  isSuperAdmin,
  userOrganisation,
  adding
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Add New {isSuperAdmin ? 'Admin/User' : 'User'}
        </h2>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newUserData.fullName}
                onChange={(e) => setNewUserData({...newUserData, fullName: e.target.value})}
                placeholder="Enter full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newUserData.email}
                onChange={(e) => setNewUserData({...newUserData, email: e.target.value})}
                placeholder="Enter email"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newUserData.mobileNumber}
                onChange={(e) => setNewUserData({...newUserData, mobileNumber: e.target.value})}
                placeholder="Enter mobile number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newUserData.companyName}
                onChange={(e) => setNewUserData({...newUserData, companyName: e.target.value})}
                placeholder="Enter company name"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organisation
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newUserData.organisation}
                onChange={(e) => setNewUserData({...newUserData, organisation: e.target.value})}
                placeholder={userOrganisation || "Enter organisation"}
                readOnly={!isSuperAdmin && !!userOrganisation}
              />
              {!isSuperAdmin && userOrganisation && (
                <p className="text-xs text-gray-500 mt-1">Organisation is fixed to your organisation</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newUserData.industry}
                onChange={(e) => setNewUserData({...newUserData, industry: e.target.value})}
                placeholder="Enter industry"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newUserData.location}
                onChange={(e) => setNewUserData({...newUserData, location: e.target.value})}
                placeholder="Enter location"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Employees
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newUserData.employees}
                onChange={(e) => setNewUserData({...newUserData, employees: e.target.value})}
                placeholder="e.g., 10-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Founded
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newUserData.founded}
                onChange={(e) => setNewUserData({...newUserData, founded: e.target.value})}
                placeholder="e.g., 2020"
              />
            </div>
          </div>

          {isSuperAdmin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newUserData.role}
                onChange={(e) => setNewUserData({...newUserData, role: e.target.value as 'ADMIN' | 'SUPER_ADMIN' | 'USER'})}
              >
                <option value="ADMIN">Admin</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="USER">Regular User</option>
              </select>
            </div>
          )}

          {!isSuperAdmin && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-700">
                User will be added to <strong>{userOrganisation}</strong> with role <strong>ADMIN</strong>
              </p>
            </div>
          )}

          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-xs text-yellow-700">
              The user will receive an email with instructions to set up their account.
            </p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onAdd}
            disabled={adding || !newUserData.email || !newUserData.fullName}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adding ? 'Creating...' : 'Create User'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};