import React, { useEffect, useMemo, useState } from 'react';
import { Building2, Plus, Edit, Trash2, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { cocOrganisationService, type CocSubOrganisation, type CocSubOrganisationUpsert } from '../../../services/CocOrganisationService';

const EMPTY_FORM: CocSubOrganisationUpsert = {
  name: '',
  contactFullName: '',
  contactEmail: '',
  contactMobile: '',
  industry: '',
  location: '',
  employees: '',
  yearEstablished: new Date().getFullYear(),
  businessReference: '',
  subscriptionType: '',
};

const CocOrganisationManagement: React.FC = () => {
  const { isCocAdmin } = useAuth();
  const [items, setItems] = useState<CocSubOrganisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editing, setEditing] = useState<CocSubOrganisation | null>(null);
  const [createForm, setCreateForm] = useState<CocSubOrganisationUpsert>(EMPTY_FORM);
  const [editForm, setEditForm] = useState<CocSubOrganisationUpsert>(EMPTY_FORM);
  const [revealedRefs, setRevealedRefs] = useState<Set<string>>(new Set());

  const toggleReveal = (id: string) => {
    setRevealedRefs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

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

  const isFormValid = (form: CocSubOrganisationUpsert) =>
    form.name.trim().length > 0 &&
    form.contactFullName.trim().length > 0 &&
    form.contactEmail.trim().length > 0 &&
    form.contactMobile.trim().length > 0 &&
    form.industry.trim().length > 0 &&
    form.location.trim().length > 0 &&
    form.employees.trim().length > 0 &&
    Number.isFinite(Number(form.yearEstablished)) &&
    form.businessReference.trim().length > 0 &&
    form.subscriptionType.trim().length > 0;

  const canCreate = useMemo(() => isFormValid(createForm), [createForm]);
  const canEdit = useMemo(() => isFormValid(editForm), [editForm]);

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
        ...createForm,
        name: createForm.name.trim(),
        yearEstablished: Number(createForm.yearEstablished),
      });
      setIsCreateOpen(false);
      setCreateForm(EMPTY_FORM);
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
      businessReference: item.businessReference || '',
      subscriptionType: item.subscriptionType || '',
    });
    setIsEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editing?.id || !canEdit) return;
    try {
      await cocOrganisationService.updateMineWithDetails(editing.id, {
        ...editForm,
        name: editForm.name.trim(),
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

  const FormFields = ({ form, setForm }: { form: CocSubOrganisationUpsert; setForm: React.Dispatch<React.SetStateAction<CocSubOrganisationUpsert>> }) => (
    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Organisation</label>
        <input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
      </div>
      {[
        { key: 'contactFullName', label: 'Full Name', type: 'text' },
        { key: 'contactEmail', label: 'Email Address', type: 'email' },
        { key: 'contactMobile', label: 'Mobile Number', type: 'text' },
        { key: 'industry', label: 'Industry', type: 'text' },
        { key: 'location', label: 'Location', type: 'text' },
        { key: 'employees', label: 'Employees', type: 'text' },
        { key: 'yearEstablished', label: 'Year Established', type: 'number' },
      ].map(({ key, label, type }) => (
        <div key={key}>
          <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
          <input type={type} value={String((form as any)[key])}
            onChange={(e) => setForm((p) => ({ ...p, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
        </div>
      ))}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Business Reference</label>
        <input type="text" value={form.businessReference}
          onChange={(e) => setForm((p) => ({ ...p, businessReference: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subscription Type</label>
        <select value={form.subscriptionType}
          onChange={(e) => setForm((p) => ({ ...p, subscriptionType: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
          <option value="">Select subscription type</option>
          <option value="START_UP">START_UP</option>
          <option value="ESSENTIAL">ESSENTIAL</option>
          <option value="PREMIUM">PREMIUM</option>
        </select>
      </div>
    </div>
  );

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

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex justify-end">
        <button type="button" onClick={() => setIsCreateOpen(true)} disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg border border-gray-100">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Add Organisation</h2>
            </div>
            <FormFields form={createForm} setForm={setCreateForm} />
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
              <button type="button" onClick={() => setIsCreateOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={handleCreate} disabled={!canCreate}
                className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50">Add Organisation</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg border border-gray-100">
            <div className="p-5 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Edit Organisation</h2>
            </div>
            <FormFields form={editForm} setForm={setEditForm} />
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3">
              <button type="button" onClick={() => { setIsEditOpen(false); setEditing(null); }}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
              <button type="button" onClick={handleSaveEdit} disabled={!canEdit}
                className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-lg border border-gray-100 p-8 text-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription / Reference</th>
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
                        {item.contactEmail && <div className="text-xs text-gray-500 mt-0.5">{item.contactEmail}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1.5">
                      {subscriptionBadge(item.subscriptionType)}
                      {item.businessReference && (
                        <div className="flex items-center gap-1.5 text-sm text-gray-700">
                          <span className="font-mono">
                            {revealedRefs.has(item.id) ? item.businessReference : '••••••••'}
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
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button type="button" onClick={() => openEdit(item)} className="text-gray-400 hover:text-blue-600 mr-3">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button type="button" onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-600">
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
