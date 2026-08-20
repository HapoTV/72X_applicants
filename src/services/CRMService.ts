import axiosClient from '../api/axiosClient';
import type {
  CreateCrmContactRequest,
  CreateCrmLeadRequest,
  CreateCrmSaleRequest,
  CrmActivity,
  CrmContact,
  CrmDashboardData,
  CrmLead,
  CrmOverviewMetrics,
  CrmReportsSummary,
  CrmSale,
  UpdateCrmContactRequest,
  UpdateCrmLeadRequest,
  UpdateCrmSaleRequest,
} from '../interfaces/CrmData';

class CRMService {
  async getDashboardData(): Promise<CrmDashboardData> {
    const response = await axiosClient.get('/crm/dashboard');
    return response.data;
  }

  async getOverviewMetrics(): Promise<CrmOverviewMetrics> {
    const response = await axiosClient.get('/crm/metrics');
    return response.data;
  }

  async getReportsSummary(): Promise<CrmReportsSummary> {
    const response = await axiosClient.get('/crm/reports/summary');
    return response.data;
  }

  async getActivities(): Promise<CrmActivity[]> {
    const response = await axiosClient.get('/crm/activities');
    return response.data || [];
  }

  async getContacts(): Promise<CrmContact[]> {
    const response = await axiosClient.get('/crm/contacts');
    return response.data || [];
  }

  async createContact(contactData: CreateCrmContactRequest): Promise<CrmContact> {
    const response = await axiosClient.post('/crm/contacts', contactData);
    return response.data;
  }

  async updateContact(contactId: string | number, contactData: UpdateCrmContactRequest): Promise<CrmContact> {
    const response = await axiosClient.put(`/crm/contacts/${contactId}`, contactData);
    return response.data;
  }

  async deleteContact(contactId: string | number): Promise<void> {
    await axiosClient.delete(`/crm/contacts/${contactId}`);
  }

  async getLeads(): Promise<CrmLead[]> {
    const response = await axiosClient.get('/crm/leads');
    return response.data || [];
  }

  async createLead(leadData: CreateCrmLeadRequest): Promise<CrmLead> {
    const response = await axiosClient.post('/crm/leads', leadData);
    return response.data;
  }

  async updateLead(leadId: string | number, leadData: UpdateCrmLeadRequest): Promise<CrmLead> {
    const response = await axiosClient.put(`/crm/leads/${leadId}`, leadData);
    return response.data;
  }

  async deleteLead(leadId: string | number): Promise<void> {
    await axiosClient.delete(`/crm/leads/${leadId}`);
  }

  async getSales(): Promise<CrmSale[]> {
    const response = await axiosClient.get('/crm/sales');
    return response.data || [];
  }

  async createSale(saleData: CreateCrmSaleRequest): Promise<CrmSale> {
    const response = await axiosClient.post('/crm/sales', saleData);
    return response.data;
  }

  async updateSale(saleId: string | number, saleData: UpdateCrmSaleRequest): Promise<CrmSale> {
    const response = await axiosClient.put(`/crm/sales/${saleId}`, saleData);
    return response.data;
  }

  async deleteSale(saleId: string | number): Promise<void> {
    await axiosClient.delete(`/crm/sales/${saleId}`);
  }
}

export default new CRMService();
