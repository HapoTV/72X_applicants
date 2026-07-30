import type { ProgrammeListItem } from '../pages/adminDashboard/programmes/types';

const STORAGE_KEY = '72x_programmes';

function slugifyProgrammeName(programmeName: string): string {
  return programmeName
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/(^-|-$)/g, '');
}

function loadProgrammesFromStorage(): ProgrammeListItem[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored) as ProgrammeListItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveProgrammesToStorage(programmes: ProgrammeListItem[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(programmes));
}

export function getProgrammes(): ProgrammeListItem[] {
  return loadProgrammesFromStorage();
}

export function getProgrammeById(id: string): ProgrammeListItem | undefined {
  return getProgrammes().find((programme) => programme.id === id);
}

export function getProgrammeBySlug(slug: string): ProgrammeListItem | undefined {
  const programmes = getProgrammes();
  return programmes.find(
    (programme) => programme.id === slug || slugifyProgrammeName(programme.programmeName) === slug,
  );
}

export function addOrUpdateProgramme(programme: ProgrammeListItem): ProgrammeListItem[] {
  const programmes = getProgrammes();
  const existingIndex = programmes.findIndex((item) => item.id === programme.id);
  const updatedProgrammes = [...programmes];

  if (existingIndex >= 0) {
    updatedProgrammes[existingIndex] = programme;
  } else {
    updatedProgrammes.unshift(programme);
  }

  saveProgrammesToStorage(updatedProgrammes);
  return updatedProgrammes;
}

export function deleteProgramme(id: string): ProgrammeListItem[] {
  const programmes = getProgrammes();
  const updated = programmes.filter((programme) => programme.id !== id);
  saveProgrammesToStorage(updated);
  return updated;
}
