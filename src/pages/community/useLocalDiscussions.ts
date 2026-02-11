import { UserDiscussionItem } from '../../interfaces/CommunityData';

export const useLocalDiscussions = () => {
  const readLocalDiscussions = (): UserDiscussionItem[] => {
    try {
      const raw = localStorage.getItem('communityDiscussionsLocal');
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as UserDiscussionItem[]) : [];
    } catch {
      return [];
    }
  };

  const writeLocalDiscussions = (items: UserDiscussionItem[]) => {
    try {
      localStorage.setItem('communityDiscussionsLocal', JSON.stringify(items));
    } catch {
      // ignore
    }
  };

  const mergeDiscussions = (primary: UserDiscussionItem[], secondary: UserDiscussionItem[]) => {
    const seen = new Set<string>();
    const merged: UserDiscussionItem[] = [];
    for (const item of [...primary, ...secondary]) {
      if (!item?.id) continue;
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      merged.push(item);
    }
    return merged;
  };

  return {
    readLocalDiscussions,
    writeLocalDiscussions,
    mergeDiscussions
  };
};