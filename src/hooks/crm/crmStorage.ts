import type { Contact } from '../../interfaces/crm/contact.interface';
import type { Lead } from '../../interfaces/crm/lead.interface';
import type { Sale } from '../../interfaces/crm/sale.interface';
import type { Product } from '../../interfaces/crm/product.interface';
import type { Activity } from '../../interfaces/crm/activity.interface';

const CONTACTS_KEY = 'crm_contacts';
const LEADS_KEY = 'crm_leads';
const SALES_KEY = 'crm_sales';
const PRODUCTS_KEY = 'crm_products';
const ACTIVITIES_KEY = 'crm_activities';

const readStorage = <T>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = <T>(key: string, value: T) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const now = () => new Date().toISOString();

const seededContacts: Contact[] = [
  {
    id: 'contact-seed-1',
    userId: 'local-user',
    name: 'Alicia Mokoena',
    company: '72X Labs',
    email: 'alicia@72xlabs.co.za',
    phone: '0712345678',
    notes: 'Priority account',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'contact-seed-2',
    userId: 'local-user',
    name: 'Sipho Dlamini',
    company: 'Nile Creative',
    email: 'sipho@nilecreative.co.za',
    phone: '0823456789',
    notes: 'Interested in growth plan',
    createdAt: now(),
    updatedAt: now(),
  },
];

const seededLeads: Lead[] = [
  {
    id: 'lead-seed-1',
    userId: 'local-user',
    name: 'Mandla Khumalo',
    email: 'mandla@example.co.za',
    phone: '0831112222',
    source: 'Website',
    stage: 'New',
    notes: 'Needs follow-up this week',
    createdAt: now(),
    updatedAt: now(),
  },
];

const seededSales: Sale[] = [
  {
    id: 'sale-seed-1',
    userId: 'local-user',
    customerId: 'contact-seed-1',
    customerName: 'Alicia Mokoena',
    productId: 'product-seed-1',
    productName: 'Growth Package',
    amount: 12500,
    paymentMethod: 'Card',
    date: '2026-06-18',
    status: 'Completed',
    notes: 'Annual package',
    createdAt: now(),
    updatedAt: now(),
  },
];

const seededProducts: Product[] = [
  {
    id: 'product-seed-1',
    userId: 'local-user',
    name: 'Growth Package',
    price: 12500,
    description: 'Full support package',
    createdAt: now(),
    updatedAt: now(),
  },
];

const seededActivities: Activity[] = [
  {
    id: 'activity-seed-1',
    userId: 'local-user',
    message: 'New contact added from the CRM workspace.',
    timestamp: '2 hours ago',
    createdAt: now(),
  },
];

export const crmStorage = {
  getContacts: () => readStorage(CONTACTS_KEY, seededContacts),
  setContacts: (contacts: Contact[]) => writeStorage(CONTACTS_KEY, contacts),

  getLeads: () => readStorage(LEADS_KEY, seededLeads),
  setLeads: (leads: Lead[]) => writeStorage(LEADS_KEY, leads),

  getSales: () => readStorage(SALES_KEY, seededSales),
  setSales: (sales: Sale[]) => writeStorage(SALES_KEY, sales),

  getProducts: () => readStorage(PRODUCTS_KEY, seededProducts),
  setProducts: (products: Product[]) => writeStorage(PRODUCTS_KEY, products),

  getActivities: () => readStorage(ACTIVITIES_KEY, seededActivities),
  setActivities: (activities: Activity[]) => writeStorage(ACTIVITIES_KEY, activities),
};
