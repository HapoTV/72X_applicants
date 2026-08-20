import type { UserWithSubscription } from './types';

type UserDetailsModalProps = {
  user: UserWithSubscription | null;
  onClose: () => void;
};

export function UserDetailsModal({ user, onClose }: UserDetailsModalProps) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">User Details</h2>
            <p className="text-sm text-gray-500">{user.fullName || user.email}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="text-xs font-medium text-gray-500">Full Name</div>
            <div className="text-sm text-gray-900">{user.fullName || '-'}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500">Email</div>
            <div className="text-sm text-gray-900 break-all">{user.email || '-'}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500">Mobile</div>
            <div className="text-sm text-gray-900">{user.mobileNumber || '-'}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500">Company</div>
            <div className="text-sm text-gray-900">{user.companyName || '-'}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500">Organisation</div>
            <div className="text-sm text-gray-900">{user.organisation || '-'}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500">Role</div>
            <div className="text-sm text-gray-900">{user.role || '-'}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500">Status</div>
            <div className="text-sm text-gray-900">{user.status || '-'}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500">Business Reference</div>
            <div className="text-sm text-gray-900 break-all">{user.businessReference || '-'}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500">Industry</div>
            <div className="text-sm text-gray-900">{user.industry || '-'}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500">Location</div>
            <div className="text-sm text-gray-900">{user.location || '-'}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500">Employees</div>
            <div className="text-sm text-gray-900">{user.employees || '-'}</div>
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500">Founded</div>
            <div className="text-sm text-gray-900">{user.founded || '-'}</div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
