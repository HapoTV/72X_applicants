export interface User {
  id: string
  email: string
  selected_industries: string[]
  created_at: string
}

export interface Tender {
  tender_id: string
  title: string
  description: string
  buyer: string
  industry_category: string
  province: string
  closing_date: string
  published_date: string
  document_links: string[]
  source: string
  source_url: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  tender_id: string
  sent_at: string
}

export interface IndustryCategory {
  id: string
  name: string
  keywords: string[]
}

export const INDUSTRY_CATEGORIES = [
  'Construction',
  'ICT & Software',
  'Security Services',
  'Cleaning & Hygiene',
  'Transport & Fleet',
  'Catering & Hospitality',
  'Agriculture',
  'Printing & Branding',
  'Consulting & Professional Services',
  'Supply & Delivery',
  'Mechanical & Engineering',
  'Health & Medical Supplies',
  'Education & Training',
  'Energy & Electrical Services'
] as const

export const PROVINCES = [
  'GP', // Gauteng
  'WC', // Western Cape
  'KZN', // KwaZulu-Natal
  'EC', // Eastern Cape
  'FS', // Free State
  'MP', // Mpumalanga
  'NW', // North West
  'LP', // Limpopo
  'NC'  // Northern Cape
] as const
