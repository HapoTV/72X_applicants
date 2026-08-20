// src/interfaces/crm/contact.interface.ts

export interface Contact {
    id: string;
    userId: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    notes: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateContactRequest {
    name: string;
    company?: string;
    email?: string;
    phone?: string;
    notes?: string;
}

export interface UpdateContactRequest extends Partial<CreateContactRequest> {
    id: string;
}

export interface ContactResponse {
    success: boolean;
    data: Contact;
    message?: string;
}

export interface ContactsResponse {
    success: boolean;
    data: Contact[];
    count: number;
    message?: string;
}