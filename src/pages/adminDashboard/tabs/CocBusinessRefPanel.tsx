import React, { useEffect, useState } from 'react';
import { KeyRound, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { cocOrganisationService, type CocSubOrganisation } from '../../../services/CocOrganisationService';

const subscriptionBadge = (type: string | undefined) => {
  switch (type) {
    case 'PREMIUM':
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">PREMIUM</span>;
    case 'ESSENTIAL':
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">ESSENTIAL</span>;
    case 'START_UP':
      return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">START_UP</span>;
    default:
      return null;
  }
};

const CocBusinessRefPanel: React.FC = () => {
  const { isCocAdmin } = useAuth();
  const [items, setItems] = useState<CocSubOrganisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [revealedRefs, setRevealedRefs] = useState<Set<string>>(new Set());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [rowError, setRowError] = useState<string | null>(null);
  const [successId, setSuccessId] = useState<string | null>(null);

  const load = async () => {
    try {
      setLoading(true);
      const data = await cocOrganisationService.listMine();
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isCocAdmin) void load();
  }, [isCocAdmin]);

  const toggleReveal = (id: string) => {
    setRevealedRefs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const startEdit = (item: CocSubOrganisation) => {
    setEditingId(item.id);
    setEditValue(item.businessReference ?? '');
    setRowError(null);
    setSuccessId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
    setRowError(null);
  };

  const confirmEdit = async (id: string) => {
    if (!editValue.trim()) {
      setRowError('Business reference cannot be blank.');
      return;
    }
    try {
      setSaving(true);
      setRowError(null);
      await cocOrganisationService.updateBusinessReference(id, editValue.trim());
      setEditingId(null);
      setEditValue('');
      setSuccessId(id);
      await load();
      setTimeout(() => setSuccessId(null), 3000);
    } catch (e: any) {
      setRowError(e?.response?.data?.message || e?.response?.data || 'Failed to update reference.');
    } finally {
      setSaving(false);
    }
  };

  if (!isCocAdmin) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <Shield className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-red-800 mb-2">Access Denied</h3>
        <p className="text-red-600">Only COC Admins can access business reference management.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <KeyRound className="w-6 h-6 mr-2 text-primary-600" />
          Business References
        </h1>
        <p className="text-gray-600 mt-1">View and update business references for your sub-organisations</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg border border-gray-100 p-8 text-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading organisations...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-100 p-12 text-center">
          <KeyRound className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No organisations yet</h3>
          <p className="text-gray-600">Add sub-organisations first to manage their business references.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organisation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Reference</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{item.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    {subscriptionBadge(item.subscriptionType)}
                  </td>
                  <td className="px-6 py-4">
                    {editingId === item.id ? (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent w-48"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => confirmEdit(item.id)}
                            disabled={saving}
                            className="px-3 py-1 text-xs bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                          >
                            {saving ? 'Saving…' : 'Confirm'}
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            disabled={saving}
                            className="px-3 py-1 text-xs border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                        {rowError && (
                          <p className="text-xs text-red-600">{rowError}</p>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-sm text-gray-700">
                          <span className="font-mono">
                            {revealedRefs.has(item.id) ? (item.businessReference ?? '—') : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleReveal(item.id)}
                            className="text-gray-400 hover:text-gray-600"
                            aria-label={revealedRefs.has(item.id) ? 'Hide reference' : 'Show reference'}
                          >
                            {revealedRefs.has(item.id) ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        {successId === item.id && (
                          <p className="text-xs text-green-600">Reference updated successfully.</p>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    0
                  </td>
                  <td className="px-6 py-4 text-right">
                    {editingId !== item.id && (
                      <button
                        type="button"
                        onClick={() => startEdit(item)}
                        className="px-3 py-1 text-xs border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                      >
                        Change
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CocBusinessRefPanel;
