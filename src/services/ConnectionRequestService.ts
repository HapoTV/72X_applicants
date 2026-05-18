// src/services/ConnectionRequestService.ts
import axiosClient from '../api/axiosClient';

export type ConnectionStatus = 'NONE' | 'PENDING_SENT' | 'PENDING_RECEIVED' | 'ACCEPTED';

export interface ConnectionStatusDTO {
  otherUserId: string;
  status: ConnectionStatus;
  requestId: string | null;
}

export interface ConnectionRequestDTO {
  requestId: string;
  senderId: string;
  senderName: string;
  senderEmail: string;
  senderProfileImage: string | null;
  senderIndustry: string | null;
  senderLocation: string | null;
  senderOrganisation: string | null;
  receiverId: string;
  receiverName: string;
  receiverEmail: string;
  status: string;
  message: string | null;
  createdAt: string;
  respondedAt: string | null;
}

class ConnectionRequestService {
  private getAuthHeader() {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  /** Send a connection request to another user */
  async sendRequest(receiverId: string, message?: string): Promise<ConnectionRequestDTO> {
    const response = await axiosClient.post(
      `/connections/request/${receiverId}`,
      { message: message ?? null },
      { headers: this.getAuthHeader() }
    );
    return response.data;
  }

  /** Accept a received connection request */
  async acceptRequest(requestId: string): Promise<ConnectionRequestDTO> {
    const response = await axiosClient.put(
      `/connections/request/${requestId}/accept`,
      {},
      { headers: this.getAuthHeader() }
    );
    return response.data;
  }

  /** Decline a received connection request */
  async declineRequest(requestId: string): Promise<ConnectionRequestDTO> {
    const response = await axiosClient.put(
      `/connections/request/${requestId}/decline`,
      {},
      { headers: this.getAuthHeader() }
    );
    return response.data;
  }

  /** Cancel a sent connection request */
  async cancelRequest(requestId: string): Promise<void> {
    await axiosClient.put(
      `/connections/request/${requestId}/cancel`,
      {},
      { headers: this.getAuthHeader() }
    );
  }

  /** Remove an accepted connection */
  async removeConnection(requestId: string): Promise<void> {
    await axiosClient.delete(`/connections/${requestId}`, {
      headers: this.getAuthHeader(),
    });
  }

  /** Get all pending requests received (inbox) */
  async getPendingReceived(): Promise<ConnectionRequestDTO[]> {
    const response = await axiosClient.get('/connections/requests/received', {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  /** Get all pending requests sent (outbox) */
  async getPendingSent(): Promise<ConnectionRequestDTO[]> {
    const response = await axiosClient.get('/connections/requests/sent', {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  /** Get all accepted connections */
  async getConnections(): Promise<ConnectionRequestDTO[]> {
    const response = await axiosClient.get('/connections', {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  /** Count pending received requests */
  async countPendingReceived(): Promise<number> {
    const response = await axiosClient.get('/connections/requests/received/count', {
      headers: this.getAuthHeader(),
    });
    return response.data.count ?? 0;
  }

  /** Get connection status with a specific user */
  async getStatusWith(otherUserId: string): Promise<ConnectionStatusDTO> {
    const response = await axiosClient.get(`/connections/status/${otherUserId}`, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  /**
   * Get bulk connection statuses for all users.
   * Returns a map of userId -> ConnectionStatusDTO
   */
  async getBulkStatus(): Promise<Record<string, ConnectionStatusDTO>> {
    const response = await axiosClient.get('/connections/status/bulk', {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }
}

export default new ConnectionRequestService();
