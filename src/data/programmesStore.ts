import type { ProgrammeListItem } from '../pages/adminDashboard/programmes/types';
import { mockProgrammes } from './mockProgrammes';

const STORAGE_KEY = '72x_programmes';

function loadProgrammesFromStorage(): ProgrammeListItem[] {
  if (typeof window === 'undefined') return mockProgrammes;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return mockProgrammes;
    const parsed = JSON.parse(stored) as ProgrammeListItem[];
    return Array.isArray(parsed) ? parsed : mockProgrammes;
  } catch {
    return mockProgrammes;
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
