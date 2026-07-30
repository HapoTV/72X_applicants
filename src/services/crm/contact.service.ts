// src/services/crm/contact.service.ts

import type {
    Contact,
    CreateContactRequest,
    UpdateContactRequest,
    ContactResponse,
    ContactsResponse,
} from '../../interfaces/crm/contact.interface';
import { CRMService } from './crm.service';

export class ContactService extends CRMService {
    private readonly endpoint = '/crm/contacts';

    async getContacts(): Promise<ContactsResponse> {
        const response = await this.get<ContactsResponse>(this.endpoint);
        console.log('ContactService - getContacts raw response:', response);
        return response;
    }

    async getContact(id: string): Promise<ContactResponse> {
        return this.get<ContactResponse>(`${this.endpoint}/${id}`);
    }

    async createContact(data: CreateContactRequest): Promise<ContactResponse> {
        return this.post<ContactResponse>(this.endpoint, data);
    }

    async updateContact(id: string, data: UpdateContactRequest): Promise<ContactResponse> {
        return this.put<ContactResponse>(`${this.endpoint}/${id}`, data);
    }

    async deleteContact(id: string): Promise<{ success: boolean; message: string }> {
        return this.delete<{ success: boolean; message: string }>(`${this.endpoint}/${id}`);
    }

    async searchContacts(query: string): Promise<ContactsResponse> {
        return this.get<ContactsResponse>(`${this.endpoint}/search`, { params: { q: query } });
    }
}

export const contactService = new ContactService();