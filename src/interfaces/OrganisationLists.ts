// src/interfaces/OrganisationLists.ts
export const ORGANISATIONS = [

  'Standard Bank',
//  'TymeBank',
//  'First National Bank',
//  'xxxxx'
] as const;

export type Organisation = typeof ORGANISATIONS[number];