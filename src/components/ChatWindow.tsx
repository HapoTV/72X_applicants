// src/components/ChatWindow.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  List,
  ListItem,
  Avatar,
  Typography,
  Paper,
  IconButton,
  CircularProgress,
} from '@mui/material';
import { Send, AttachFile, EmojiEmotions } from '@mui/icons-material';
import MessageServices from '../services/MessageServices';
import type { Message } from '../interfaces/MessageData';

interface ChatWindowProps {
  receiverId: string;
  receiverName: string;
  receiverEmail: string;
  onClose: () => void;
  isOpen: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  receiverId,
  receiverName,
  receiverEmail,
  isOpen,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUserId = localStorage.getItem('userId') || '';

  useEffect(() => {
    if (isOpen && currentUserId && receiverId) {
      fetchMessages();
    }
  }, [isOpen, currentUserId, receiverId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      
      // Check if user is authenticated
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No authentication token found');
        throw new Error('Please login to continue');
      }
      
      const fetchedMessages = await MessageServices.getMessagesBetweenUsers(
        currentUserId,
        receiverId
      );
      setMessages(fetchedMessages);
      
      // Mark messages as read
      const unreadMessages = fetchedMessages
        .filter(msg => msg.receiverId === currentUserId && !msg.isRead)
        .map(msg => msg.messageId);
      
      if (unreadMessages.length > 0) {
        await MessageServices.markMessagesAsRead(unreadMessages);
      }
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      
      // Handle specific error cases
      if (error.response?.status === 403) {
        console.error('Access denied. You may not have permission to view this conversation.');
        // You could show a user-friendly message here
      } else if (error.response?.status === 401) {
        console.error('Unauthorized. Please login again.');
        // The interceptor should handle redirecting to login
      }
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUserId) return;

    try {
      setSending(true);
      const messageData = {
        content: newMessage,
        senderId: currentUserId,
        receiverId,
        messageType: 'TEXT' as const,
      };

      await MessageServices.sendMessage(messageData);
      setNewMessage('');
      fetchMessages(); // Refresh messages
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '500px' }}>
      {/* Chat Header */}
      <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
        <Avatar sx={{ mr: 2 }}>
          {receiverName.split(' ').map(n => n[0]).join('')}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1">{receiverName}</Typography>
          <Typography variant="caption" color="text.secondary">
            {receiverEmail}
          </Typography>
        </Box>
      </Paper>

      {/* Messages Area */}
      <Paper
        sx={{
          flexGrow: 1,
          overflow: 'auto',
          p: 2,
          bgcolor: 'grey.50',
        }}
      >
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
            <CircularProgress />
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 4 }}>
            <Typography color="text.secondary">
              No messages yet. Start the conversation!
            </Typography>
          </Box>
        ) : (
          <List>
            {messages.map((message) => {
              const isOwnMessage = message.senderId === currentUserId;
              
              return (
                <ListItem
                  key={message.messageId}
                  sx={{
                    justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                    px: 1,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: '70%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isOwnMessage ? 'flex-end' : 'flex-start',
                    }}
                  >
                    <Paper
                      sx={{
                        p: 1.5,
                        bgcolor: isOwnMessage ? 'primary.main' : 'grey.100',
                        color: isOwnMessage ? 'white' : 'text.primary',
                        borderRadius: 2,
                      }}
                    >
                      {!isOwnMessage && (
                        <Typography variant="caption" color="text.secondary">
                          {message.senderName}
                        </Typography>
                      )}
                      <Typography>{message.content}</Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          textAlign: 'right',
                          color: isOwnMessage ? 'white' : 'text.secondary',
                          opacity: 0.8,
                        }}
                      >
                        {formatTime(message.createdAt)}
                        {message.isRead && isOwnMessage && ' ✓'}
                      </Typography>
                    </Paper>
                  </Box>
                </ListItem>
              );
            })}
            <div ref={messagesEndRef} />
          </List>
        )}
      </Paper>

      {/* Message Input */}
      <Paper sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton size="small">
            <AttachFile />
          </IconButton>
          <IconButton size="small">
            <EmojiEmotions />
          </IconButton>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            variant="outlined"
            size="small"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={sending}
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending}
            startIcon={sending ? <CircularProgress size={20} /> : <Send />}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatWindow;