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
  Alert,
  Snackbar,
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
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout>();
  
  // Get current user ID from localStorage
  const getCurrentUserId = (): string => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.id || user.userId || '';
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
    return localStorage.getItem('userId') || '';
  };
  
  const currentUserId = getCurrentUserId();

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen && currentUserId && receiverId) {
      fetchMessages();
      
      // Set up polling for new messages every 3 seconds
      pollingIntervalRef.current = setInterval(fetchMessages, 3000);
      
      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      };
    }
  }, [isOpen, currentUserId, receiverId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    if (!receiverId || !currentUserId) {
      console.log('Cannot fetch messages: missing receiverId or currentUserId', { receiverId, currentUserId });
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Check if user is authenticated
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No authentication token found');
        setError('Please login to continue');
        throw new Error('Please login to continue');
      }
      
      console.log('Fetching messages between:', currentUserId, 'and', receiverId);
      
      // Pass only the receiverId - the backend will get sender ID from the token
      const fetchedMessages = await MessageServices.getMessagesBetweenUsers(receiverId);
      console.log('Fetched messages:', fetchedMessages);
      
      setMessages(fetchedMessages);
      
      // Mark messages as read if there are any unread messages from the receiver
      const hasUnreadFromReceiver = fetchedMessages.some(
        msg => msg.senderId === receiverId && !msg.isRead
      );
      
      if (hasUnreadFromReceiver) {
        console.log('Marking messages as read from:', receiverId);
        await MessageServices.markMessagesAsRead(receiverId);
      }
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      
      // Handle specific error cases
      if (error.response?.status === 403) {
        setError('Access denied. You may not have permission to view this conversation.');
      } else if (error.response?.status === 401) {
        setError('Unauthorized. Please login again.');
      } else {
        setError(error.message || 'Failed to load messages');
      }
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUserId || !receiverId) return;

    try {
      setSending(true);
      setError(null);
      
      const messageData = {
        content: newMessage.trim(),
        senderId: currentUserId,
        receiverId: receiverId,
        messageType: 'TEXT' as const,
      };

      console.log('Sending message:', messageData);
      
      const sentMessage = await MessageServices.sendMessage(messageData);
      console.log('Message sent successfully:', sentMessage);
      
      // Add the sent message to the list immediately for better UX
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
      
      // Also refresh to ensure we have the latest
      setTimeout(() => fetchMessages(), 500);
    } catch (error: any) {
      console.error('Error sending message:', error);
      setError(error.message || 'Failed to send message');
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

  const handleCloseError = () => {
    setError(null);
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '500px', bgcolor: 'background.paper' }}>
      {/* Error Snackbar */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      {/* Chat Header */}
      <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: 1, borderColor: 'divider', borderRadius: 0 }}>
        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
          {receiverName.split(' ').map(n => n[0]).join('').toUpperCase()}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>{receiverName}</Typography>
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
          borderRadius: 0,
        }}
      >
        {loading && messages.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <CircularProgress />
          </Box>
        ) : messages.length === 0 ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <Typography color="text.secondary" align="center">
              No messages yet.<br />
              Start the conversation!
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {messages.map((message) => {
              const isOwnMessage = message.senderId === currentUserId;
              
              return (
                <ListItem
                  key={message.messageId}
                  sx={{
                    justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                    px: 0,
                    py: 0.5,
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
                    {!isOwnMessage && (
                      <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, ml: 1 }}>
                        {message.senderName || receiverName}
                      </Typography>
                    )}
                    <Paper
                      elevation={1}
                      sx={{
                        p: 1.5,
                        bgcolor: isOwnMessage ? 'primary.main' : 'background.paper',
                        color: isOwnMessage ? 'white' : 'text.primary',
                        borderRadius: 2,
                        borderTopRightRadius: isOwnMessage ? 4 : 2,
                        borderTopLeftRadius: !isOwnMessage ? 4 : 2,
                      }}
                    >
                      <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                        {message.content}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          textAlign: 'right',
                          color: isOwnMessage ? 'rgba(255,255,255,0.7)' : 'text.secondary',
                          mt: 0.5,
                        }}
                      >
                        {formatTime(message.createdAt)}
                        {isOwnMessage && message.isRead && ' ✓✓'}
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
      <Paper sx={{ p: 2, borderTop: 1, borderColor: 'divider', borderRadius: 0 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton size="small" disabled={sending}>
            <AttachFile />
          </IconButton>
          <IconButton size="small" disabled={sending}>
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
            disabled={sending || !currentUserId}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || sending || !currentUserId}
            startIcon={sending ? <CircularProgress size={20} color="inherit" /> : <Send />}
            sx={{ minWidth: 100 }}
          >
            Send
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatWindow;