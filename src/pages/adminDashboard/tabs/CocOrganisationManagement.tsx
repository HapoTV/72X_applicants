import React, { useEffect, useMemo, useState } from 'react';
import { Building2, Plus, Edit, Trash2, Shield } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { cocOrganisationService, type CocSubOrganisation, type CocSubOrganisationUpsert } from '../../../services/CocOrganisationService';

const CocOrganisationManagement: React.FC = () => {
  const { isCocAdmin } = useAuth();
  const [items, setItems] = useState<CocSubOrganisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editing, setEditing] = useState<CocSubOrganisation | null>(null);
  const [createForm, setCreateForm] = useState<CocSubOrganisationUpsert>({
    name: '',
    contactFullName: '',
    contactEmail: '',
    contactMobile: '',
    industry: '',
    location: '',
    employees: '',
    yearEstablished: new Date().getFullYear(),
  });
  const [editForm, setEditForm] = useState<CocSubOrganisationUpsert>({
    name: '',
    contactFullName: '',
    contactEmail: '',
    contactMobile: '',
    industry: '',
    location: '',
    employees: '',
    yearEstablished: new Date().getFullYear(),
  });

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
    if (isCocAdmin) {
      void load();
    }
  }, [isCocAdmin]);

  const canCreate = useMemo(() => {
    return (
      createForm.name.trim().length > 0 &&
      createForm.contactFullName.trim().length > 0 &&
      createForm.contactEmail.trim().length > 0 &&
      createForm.contactMobile.trim().length > 0 &&
      createForm.industry.trim().length > 0 &&
      createForm.location.trim().length > 0 &&
      createForm.employees.trim().length > 0 &&
      Number.isFinite(Number(createForm.yearEstablished))
    );
  }, [createForm]);

  const canEdit = useMemo(() => {
    return (
      editForm.name.trim().length > 0 &&
      editForm.contactFullName.trim().length > 0 &&
      editForm.contactEmail.trim().length > 0 &&
      editForm.contactMobile.trim().length > 0 &&
      editForm.industry.trim().length > 0 &&
      editForm.location.trim().length > 0 &&
      editForm.employees.trim().length > 0 &&
      Number.isFinite(Number(editForm.yearEstablished))
    );
  }, [editForm]);

  if (!isCocAdmin) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <Shield className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-red-800 mb-2">Access Denied</h3>
        <p className="text-red-600">Only COC Admins can access COC organisation management.</p>
      </div>
    );
  }

  const handleCreate = async () => {
    if (!canCreate) return;
    try {
      await cocOrganisationService.createMineWithDetails({
        name: createForm.name.trim(),
        contactFullName: createForm.contactFullName.trim(),
        contactEmail: createForm.contactEmail.trim(),
        contactMobile: createForm.contactMobile.trim(),
        industry: createForm.industry.trim(),
        location: createForm.location.trim(),
        employees: createForm.employees.trim(),
        yearEstablished: Number(createForm.yearEstablished),
      });
      setIsCreateOpen(false);
      setCreateForm({
        name: '',
        contactFullName: '',
        contactEmail: '',
        contactMobile: '',
        industry: '',
        location: '',
        employees: '',
        yearEstablished: new Date().getFullYear(),
      });
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.response?.data || 'Failed to create organisation');
    }
  };

  const openEdit = (item: CocSubOrganisation) => {
    setEditing(item);
    setEditForm({
      name: item.name || '',
      contactFullName: item.contactFullName || '',
      contactEmail: item.contactEmail || '',
      contactMobile: item.contactMobile || '',
      industry: item.industry || '',
      location: item.location || '',
      employees: item.employees || '',
      yearEstablished: item.yearEstablished || new Date().getFullYear(),
    });
    setIsEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editing?.id) return;
    if (!canEdit) return;
    try {
      await cocOrganisationService.updateMineWithDetails(editing.id, {
        name: editForm.name.trim(),
        contactFullName: editForm.contactFullName.trim(),
        contactEmail: editForm.contactEmail.trim(),
        contactMobile: editForm.contactMobile.trim(),
        industry: editForm.industry.trim(),
        location: editForm.location.trim(),
        employees: editForm.employees.trim(),
        yearEstablished: Number(editForm.yearEstablished),
      });
      setIsEditOpen(false);
      setEditing(null);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.response?.data || 'Failed to update organisation');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this organisation?')) return;
    try {
      await cocOrganisationService.deleteMine(id);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.response?.data || 'Failed to delete organisation');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Building2 className="w-6 h-6 mr-2 text-primary-600" />
            COC Organisations
          </h1>
          <p className="text-gray-600 mt-1">Manage organisations under your COC organisation</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg border border-gray-100">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Add Organisation</h2>
              <p className="text-sm text-gray-600 mt-1">Enter organisation details under your COC.</p>
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Organisation</label>
                <input
                  value={createForm.name}
                  onChange={(e) => setCreateForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  value={createForm.contactFullName}
                  onChange={(e) => setCreateForm((p) => ({ ...p, contactFullName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={createForm.contactEmail}
                  onChange={(e) => setCreateForm((p) => ({ ...p, contactEmail: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input
                  value={createForm.contactMobile}
                  onChange={(e) => setCreateForm((p) => ({ ...p, contactMobile: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <input
                  value={createForm.industry}
                  onChange={(e) => setCreateForm((p) => ({ ...p, industry: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  value={createForm.location}
                  onChange={(e) => setCreateForm((p) => ({ ...p, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employees</label>
                <input
                  value={createForm.employees}
                  onChange={(e) => setCreateForm((p) => ({ ...p, employees: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year Established</label>
                <input
                  type="number"
                  value={createForm.yearEstablished}
                  onChange={(e) => setCreateForm((p) => ({ ...p, yearEstablished: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreate}
                disabled={!canCreate}
                className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
              >
                Add Organisation
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg border border-gray-100">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Edit Organisation</h2>
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Organisation</label>
                <input
                  value={editForm.name}
                  onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  value={editForm.contactFullName}
                  onChange={(e) => setEditForm((p) => ({ ...p, contactFullName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={editForm.contactEmail}
                  onChange={(e) => setEditForm((p) => ({ ...p, contactEmail: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
                <input
                  value={editForm.contactMobile}
                  onChange={(e) => setEditForm((p) => ({ ...p, contactMobile: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <input
                  value={editForm.industry}
                  onChange={(e) => setEditForm((p) => ({ ...p, industry: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  value={editForm.location}
                  onChange={(e) => setEditForm((p) => ({ ...p, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employees</label>
                <input
                  value={editForm.employees}
                  onChange={(e) => setEditForm((p) => ({ ...p, employees: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year Established</label>
                <input
                  type="number"
                  value={editForm.yearEstablished}
                  onChange={(e) => setEditForm((p) => ({ ...p, yearEstablished: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setIsEditOpen(false);
                  setEditing(null);
                }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={!canEdit}
                className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-lg border border-gray-100 p-8 text-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading organisations...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-100 p-12 text-center">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No organisations yet</h3>
          <p className="text-gray-600">Add your first organisation under your COC.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organisation</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Building2 className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        {item.contactEmail ? (
                          <div className="text-xs text-gray-500 mt-0.5">{item.contactEmail}</div>
                        ) : null}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="text-gray-400 hover:text-blue-600 mr-3"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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

export default CocOrganisationManagement;
