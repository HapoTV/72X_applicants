import type { UserProductItem } from '../interfaces/MarketplaceData';

/**
 * Extracts the primary product image from a product's images array
 */
export const getPrimaryProductImage = (product: UserProductItem): string | null => {
  if (!product.images || product.images.length === 0) return null;
  const first = product.images[0];
  if (typeof first !== 'string') return null;
  const trimmed = first.trim();
  return trimmed.length > 0 ? trimmed : null;
};

/**
 * Normalizes preview images from various formats into a clean string array
 */
export const normalizePreviewImages = (raw: any): string[] => {
  if (Array.isArray(raw)) {
    return raw
      .filter((x) => typeof x === 'string')
      .map((x) => x.trim())
      .filter((x) => x.length > 0);
  }

  if (typeof raw === 'string') {
    const trimmed = raw.trim();
    if (!trimmed) return [];

    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          return parsed
            .filter((x) => typeof x === 'string')
            .map((x) => x.trim())
            .filter((x) => x.length > 0);
        }
      } catch {
        return [trimmed];
      }
    }

    return [trimmed];
  }

  return [];
};

/**
 * Converts a value to title case (first letter uppercase, rest lowercase)
 */
export const toTitleCase = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

/**
 * Formats a price value with R prefix if not already present
 */
export const formatPrice = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (/^r\b/i.test(trimmed)) return trimmed;
  return `R ${trimmed}`;
};

/**
 * Formats a condition label (new -> New, used -> Pre-owned, others -> Title Case)
 */
export const formatConditionLabel = (value: unknown): string => {
  if (typeof value !== 'string') return '';
  const v = value.trim().toLowerCase();
  if (!v) return '';
  if (v === 'new') return 'New';
  if (v === 'used') return 'Pre-owned';
  return toTitleCase(v);
};

/**
 * Checks if a product can be edited (within 3 hours of creation)
 */
export const canEditProduct = (product: UserProductItem): boolean => {
  const createdAt = product.createdAt;
  if (!createdAt) return true;

  const createdMs = new Date(createdAt).getTime();
  if (Number.isNaN(createdMs)) return true;

  const deadlineMs = createdMs + 3 * 60 * 60 * 1000; // 3 hours
  return Date.now() <= deadlineMs;
};

/**
 * Default categories for fallback when API is unavailable
 */
export const DEFAULT_CATEGORIES = [
  { id: 'all', name: 'All Categories' },
  { id: 'food', name: 'Food & Beverages' },
  { id: 'crafts', name: 'Arts & Crafts' },
  { id: 'clothing', name: 'Clothing & Fashion' },
  { id: 'services', name: 'Services' },
  { id: 'agriculture', name: 'Agriculture' },
  { id: 'beauty', name: 'Beauty & Personal Care' },
  { id: 'electronics', name: 'Electronics & Repairs' },
  { id: 'home', name: 'Home & Garden' },
  { id: 'other', name: 'Other' }
];

/**
 * Default locations for fallback when API is unavailable
 */
export const DEFAULT_LOCATIONS = [
  { id: 'all', name: 'All Locations' },
  { id: 'soweto', name: 'Soweto' },
  { id: 'alexandra', name: 'Alexandra' },
  { id: 'khayelitsha', name: 'Khayelitsha' },
  { id: 'mitchells-plain', name: 'Mitchells Plain' },
  { id: 'mamelodi', name: 'Mamelodi' },
  { id: 'umlazi', name: 'Umlazi' },
  { id: 'mdantsane', name: 'Mdantsane' },
  { id: 'other', name: 'Other' }
];

/**
 * Local storage key for featured products cache
 */
export const FEATURED_CACHE_KEY = 'marketplace_featured_cache_v1';

/**
 * Reads featured products from local storage cache
 */
export const readFeaturedCache = (): UserProductItem[] | null => {
  try {
    const raw = localStorage.getItem(FEATURED_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as UserProductItem[]) : null;
  } catch {
    return null;
  }
};

/**
 * Writes featured products to local storage cache (excludes sold items)
 */
export const writeFeaturedCache = (items: UserProductItem[]) => {
  try {
    const safeItems = Array.isArray(items) ? items.filter((p) => p?.status !== 'sold') : [];
    localStorage.setItem(FEATURED_CACHE_KEY, JSON.stringify(safeItems));
  } catch {
    // ignore
  }
};

/**
 * Removes a product from the featured cache by ID
 */
export const removeFromFeaturedCache = (productId: string) => {
  try {
    const raw = localStorage.getItem(FEATURED_CACHE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        localStorage.setItem(
          FEATURED_CACHE_KEY,
          JSON.stringify(parsed.filter((p: any) => (p?.id || p?.productId) !== productId))
        );
      }
    }
  } catch {
    // ignore
  }
};
