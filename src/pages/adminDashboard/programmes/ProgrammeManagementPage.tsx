import { useEffect, useMemo, useState } from 'react';
import { toast } from '../../../hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { deleteProgramme } from '../../../data/programmesStore';
import { cocProgrammeService } from '../../../services/coc-admin/CocProgrammeService';
import { ProgrammeFilters } from './components/ProgrammeFilters';
import { ProgrammeTable } from './components/ProgrammeTable';
import type { ProgrammeListItem } from './types';

const ProgrammeManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'Closed' | 'Coming Soon'>('All');
  const [partnerFilter, setPartnerFilter] = useState('All');
  const [programmes, setProgrammes] = useState<ProgrammeListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProgrammes = async () => {
      try {
        const data = await cocProgrammeService.getProgrammes();
        setProgrammes(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load programmes from service:', error);
        setProgrammes([]);
      } finally {
        setLoading(false);
      }
    };

    loadProgrammes();
  }, []);

  const filteredProgrammes = useMemo(() => {
    return programmes.filter((programme) => {
      const matchesSearch = programme.programmeName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'All' || programme.status === statusFilter;
      const matchesPartner = partnerFilter === 'All' || programme.partner === partnerFilter;
      return matchesSearch && matchesStatus && matchesPartner;
    });
  }, [programmes, searchTerm, statusFilter, partnerFilter]);

  const partners = useMemo(() => [...new Set(programmes.map((programme) => programme.partner))], [programmes]);

  const handleEdit = (programme: ProgrammeListItem) => {
    navigate(`/admin/programmes/create?id=${programme.id}`, { state: { programme } });
  };

  const handleDelete = async (programme: ProgrammeListItem) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete? This programme will also be deleted from the user side.`
    );
    if (!confirmed) return;

    try {
      await cocProgrammeService.deleteProgramme(programme.id);
      setProgrammes((current) => current.filter((item) => item.id !== programme.id));
      toast({ title: 'Programme deleted', description: 'Programme removed successfully.' });
    } catch (err) {
      console.error('Failed to delete programme through service:', err);
      let serverMessage = '';
      try {
        const e = err as any;
        if (e?.response?.data) {
          serverMessage = typeof e.response.data === 'string' ? e.response.data : (e.response.data.message || JSON.stringify(e.response.data));
        } else {
          serverMessage = e?.message || 'Unknown error';
        }
      } catch {
        serverMessage = 'Unknown error';
      }

      const updated = deleteProgramme(programme.id);
      setProgrammes(updated);
      toast({ title: 'Delete failed (server)', description: `Failed to delete on server: ${serverMessage}. Deleted locally.`, variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">Programme Management</h1>
          <p className="mt-2 text-sm text-slate-600">Create and manage business development programmes.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/admin/programmes/create')}
          className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Create Programme
        </button>
      </div>

      <ProgrammeFilters
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        partnerFilter={partnerFilter}
        onPartnerFilterChange={setPartnerFilter}
        partners={partners}
      />

      <ProgrammeTable
        programmes={filteredProgrammes}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default ProgrammeManagementPage;
