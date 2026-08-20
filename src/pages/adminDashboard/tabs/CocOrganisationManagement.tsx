import React, { useEffect, useMemo, useState } from 'react';
import { Building2, Plus, Shield } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { cocOrganisationService, type CocSubOrganisation, type CocSubOrganisationUpsert } from '../../../services/CocOrganisationService';
import {
  EMPTY_COC_ORGANISATION_FORM,
  getCocOrganisationFormFromItem,
  getCocOrganisationUpsertPayload,
  isCocOrganisationFormValid,
  toggleSetMembership,
} from './components/cocOrgHelpers';
import { CocOrganisationList } from './components/CocOrganisationList';
import { CocOrganisationModal } from './components/CocOrganisationModal';

const CocOrganisationManagement: React.FC = () => {
  const { isCocAdmin } = useAuth();
  const [items, setItems] = useState<CocSubOrganisation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editing, setEditing] = useState<CocSubOrganisation | null>(null);
  const [createForm, setCreateForm] = useState<CocSubOrganisationUpsert>(EMPTY_COC_ORGANISATION_FORM);
  const [editForm, setEditForm] = useState<CocSubOrganisationUpsert>(EMPTY_COC_ORGANISATION_FORM);
  const [revealedRefs, setRevealedRefs] = useState<Set<string>>(new Set());

  const toggleReveal = (id: string) => {
    setRevealedRefs((prev) => toggleSetMembership(prev, id));
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

  const canCreate = useMemo(() => isCocOrganisationFormValid(createForm), [createForm]);
  const canEdit = useMemo(() => isCocOrganisationFormValid(editForm), [editForm]);

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
      await cocOrganisationService.createMineWithDetails(getCocOrganisationUpsertPayload(createForm));
      setIsCreateOpen(false);
      setCreateForm(EMPTY_COC_ORGANISATION_FORM);
      await load();
    } catch (e: any) {
      alert(e?.response?.data?.message || e?.response?.data || 'Failed to create organisation');
    }
  };

  const openEdit = (item: CocSubOrganisation) => {
    setEditing(item);
    setEditForm(getCocOrganisationFormFromItem(item));
    setIsEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editing?.id || !canEdit) return;
    try {
      await cocOrganisationService.updateMineWithDetails(editing.id, getCocOrganisationUpsertPayload(editForm));
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

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 flex justify-end">
        <button type="button" onClick={() => setIsCreateOpen(true)} disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
          <Plus className="w-4 h-4" />
          <span>Add</span>
        </button>
      </div>

      {isCreateOpen && (
        <CocOrganisationModal
          title="Add Organisation"
          form={createForm}
          setForm={setCreateForm}
          confirmLabel="Add Organisation"
          confirmDisabled={!canCreate}
          onCancel={() => setIsCreateOpen(false)}
          onConfirm={handleCreate}
        />
      )}

      {isEditOpen && (
        <CocOrganisationModal
          title="Edit Organisation"
          form={editForm}
          setForm={setEditForm}
          confirmLabel="Save Changes"
          confirmDisabled={!canEdit}
          onCancel={() => {
            setIsEditOpen(false);
            setEditing(null);
          }}
          onConfirm={handleSaveEdit}
        />
      )}

      <CocOrganisationList
        loading={loading}
        items={items}
        revealedRefs={revealedRefs}
        onToggleReveal={toggleReveal}
        onEdit={openEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default CocOrganisationManagement;
