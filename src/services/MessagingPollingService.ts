// src/services/MessagingPollingService.ts
import MessageServices from './MessageServices';
import type { Conversation } from '../interfaces/MessageData';

type UnreadCountListener = (count: number) => void;
type ConversationsListener = (conversations: Conversation[]) => void;

/**
 * Unified polling service for all messaging-related data.
 * Prevents multiple overlapping polling loops across Header, Connections, and ChatWindow.
 */
class MessagingPollingService {
  private unreadCountListeners = new Set<UnreadCountListener>();
  private conversationsListeners = new Set<ConversationsListener>();
  private pollInterval: ReturnType<typeof setInterval> | null = null;
  private isPolling = false;
  private lastUnreadCount = 0;
  private lastConversations: Conversation[] = [];

  /** Start polling if not already running. Polls every 15 seconds. */
  private start() {
    if (this.isPolling) return;
    this.isPolling = true;
    void this.poll();
    this.pollInterval = setInterval(() => void this.poll(), 15000);
  }

  /** Stop polling when no components need updates. */
  private stop() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
    this.isPolling = false;
  }

  /** Subscribe to unread count updates. Returns an unsubscribe function. */
  subscribeToUnreadCount(listener: UnreadCountListener): () => void {
    this.unreadCountListeners.add(listener);
    if (this.lastUnreadCount > 0) listener(this.lastUnreadCount);
    if (!this.isPolling) this.start();
    return () => {
      this.unreadCountListeners.delete(listener);
      if (this.unreadCountListeners.size === 0 && this.conversationsListeners.size === 0) {
        this.stop();
      }
    };
  }

  /** Subscribe to conversations updates. Returns an unsubscribe function. */
  subscribeToConversations(listener: ConversationsListener): () => void {
    this.conversationsListeners.add(listener);
    if (this.lastConversations.length > 0) listener(this.lastConversations);
    if (!this.isPolling) this.start();
    return () => {
      this.conversationsListeners.delete(listener);
      if (this.unreadCountListeners.size === 0 && this.conversationsListeners.size === 0) {
        this.stop();
      }
    };
  }

  /** Force an immediate poll — call after sending a message or marking as read. */
  async refresh() {
    await this.poll();
  }

  private async poll() {
    try {
      const [unreadCount, conversations] = await Promise.all([
        MessageServices.getUnreadCount().catch(() => 0),
        MessageServices.getUserConversations().catch(() => [] as Conversation[]),
      ]);

      if (unreadCount !== this.lastUnreadCount) {
        this.lastUnreadCount = unreadCount;
        this.unreadCountListeners.forEach(l => l(unreadCount));
      }

      this.lastConversations = conversations;
      this.conversationsListeners.forEach(l => l(conversations));
    } catch {
      // Silently ignore poll failures — UI retains last known state
    }
  }
}

export const messagingPollingService = new MessagingPollingService();
