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
  Menu,
  MenuItem,
  Chip,
  Stack,
  Popover,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Send,
  AttachFile,
  EmojiEmotions,
  Image as ImageIcon,
  Videocam,
  Description,
  Audiotrack,
  InsertDriveFile,
  Close,
} from '@mui/icons-material';
import MessageServices from '../services/MessageServices';
import type { Message } from '../interfaces/MessageData';

interface ChatWindowProps {
  receiverId: string;
  receiverName: string;
  receiverEmail: string;
  onClose: () => void;
  isOpen: boolean;
}

interface SelectedAttachment {
  id: string;
  file: File;
  category: 'image' | 'video' | 'document' | 'audio';
}

const EMOJI_OPTIONS = ['😀', '😂', '😍', '😊', '👍', '👏', '🙏', '🔥', '🎉', '❤️', '😎', '🤝'];

const ChatWindow: React.FC<ChatWindowProps> = ({
  receiverId,
  receiverName,
  receiverEmail,
  isOpen,
  onClose: _onClose,
  initialMessage,
  autoSend,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attachmentAnchorEl, setAttachmentAnchorEl] = useState<HTMLElement | null>(null);
  const [emojiAnchorEl, setEmojiAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedAttachments, setSelectedAttachments] = useState<SelectedAttachment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout>();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

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
    if (!receiverId || !currentUserId) return;

    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No authentication token found');
        setError('Please login to continue');
        throw new Error('Please login to continue');
      }

      console.log('Fetching messages between:', currentUserId, 'and', receiverId);
      
      const fetchedMessages = await MessageServices.getMessagesBetweenUsers(receiverId);
      console.log('Fetched messages:', fetchedMessages);

      setMessages(fetchedMessages);
      
      const hasUnreadFromReceiver = fetchedMessages.some(
        (msg) => msg.senderId === receiverId && !msg.isRead
      );

      if (hasUnreadFromReceiver) {
        console.log('Marking messages as read from:', receiverId);
        await MessageServices.markMessagesAsRead(receiverId);
      }
    } catch (error: any) {
      console.error('Error fetching messages:', error);
      
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

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const shouldAutoSend = Boolean(autoSend);
    const content = (initialMessage || '').trim();
    if (!isOpen) return;
    if (!shouldAutoSend) return;
    if (!content) return;
    if (!currentUserId || !receiverId) return;

    const key = `${receiverId}::${content}`;
    if (lastAutoSentKeyRef.current === key) return;

    const run = async () => {
      try {
        lastAutoSentKeyRef.current = key;
        setSending(true);
        setError(null);

        const sentMessage = await MessageServices.sendMessage({
          content,
          senderId: currentUserId,
          receiverId,
          messageType: 'TEXT' as const,
        });

        setMessages((prev) => [...prev, sentMessage]);
        setNewMessage('');
        setTimeout(() => fetchMessages(), 500);
      } catch (err: any) {
        console.error('Error auto-sending message:', err);
        setError(err?.message || 'Failed to send message');
      } finally {
        setSending(false);
      }
    };

    void run();
  }, [autoSend, currentUserId, initialMessage, isOpen, receiverId]);

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
    if (isOpen) return;
    lastAutoSentKeyRef.current = '';
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (!initialMessage || !initialMessage.trim()) return;

    setNewMessage((prev) => (prev.trim().length > 0 ? prev : initialMessage));
  }, [isOpen, initialMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const buildAttachmentSummary = () => {
    if (selectedAttachments.length === 0) {
      return '';
    }

    const attachmentNames = selectedAttachments.map(({ file, category }) => `${category}: ${file.name}`);
    return `Attachments: ${attachmentNames.join(', ')}`;
  };

  const handleSendMessage = async () => {
    const trimmedMessage = newMessage.trim();
    const attachmentSummary = buildAttachmentSummary();
    const content = [trimmedMessage, attachmentSummary].filter(Boolean).join('\n');

    if (!content || !currentUserId || !receiverId) return;

    try {
      setSending(true);
      setError(null);

      const messageData = {
        content,
        senderId: currentUserId,
        receiverId,
        messageType: selectedAttachments.length > 0 ? 'FILE' : 'TEXT',
      };

      console.log('Sending message:', messageData);
      
      const sentMessage = await MessageServices.sendMessage(messageData);
      console.log('Message sent successfully:', sentMessage);
      
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
      setSelectedAttachments([]);
      
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

  const handleEmojiToggle = (event: React.MouseEvent<HTMLElement>) => {
    setEmojiAnchorEl((prev) => (prev ? null : event.currentTarget));
  };

  const handleAttachmentToggle = (event: React.MouseEvent<HTMLElement>) => {
    setAttachmentAnchorEl(event.currentTarget);
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage((prev) => `${prev}${emoji}`);
  };

  const handleAttachmentMenuClose = () => {
    setAttachmentAnchorEl(null);
  };

  const triggerFilePicker = (category: SelectedAttachment['category']) => {
    handleAttachmentMenuClose();

    const inputMap = {
      image: imageInputRef,
      video: videoInputRef,
      document: documentInputRef,
      audio: audioInputRef,
    };

    inputMap[category].current?.click();
  };

  const handleFilesSelected = (
    event: React.ChangeEvent<HTMLInputElement>,
    category: SelectedAttachment['category']
  ) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) {
      return;
    }

    setSelectedAttachments((prev) => [
      ...prev,
      ...files.map((file) => ({
        id: `${category}-${file.name}-${file.size}-${file.lastModified}`,
        file,
        category,
      })),
    ]);

    event.target.value = '';
  };

  const removeAttachment = (attachmentId: string) => {
    setSelectedAttachments((prev) => prev.filter((attachment) => attachment.id !== attachmentId));
  };

  const getAttachmentIcon = (category: SelectedAttachment['category']) => {
    switch (category) {
      case 'image':
        return <ImageIcon fontSize="small" />;
      case 'video':
        return <Videocam fontSize="small" />;
      case 'audio':
        return <Audiotrack fontSize="small" />;
      case 'document':
      default:
        return <Description fontSize="small" />;
    }
  };

  if (!isOpen) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '500px', bgcolor: 'background.paper' }}>
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

      <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: 1, borderColor: 'divider', borderRadius: 0 }}>
        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
          {receiverName
            .split(' ')
            .map((part) => part[0])
            .join('')
            .toUpperCase()}
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" fontWeight={600}>
            {receiverName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {receiverEmail}
          </Typography>
        </Box>
      </Paper>

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

      <Paper sx={{ p: 2, borderTop: 1, borderColor: 'divider', borderRadius: 0 }}>
        {selectedAttachments.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 1.5, rowGap: 1 }}>
            {selectedAttachments.map((attachment) => (
              <Chip
                key={attachment.id}
                icon={getAttachmentIcon(attachment.category)}
                label={attachment.file.name}
                onDelete={() => removeAttachment(attachment.id)}
                deleteIcon={<Close />}
                variant="outlined"
              />
            ))}
          </Stack>
        )}

        <input
          ref={imageInputRef}
          type="file"
          hidden
          accept="image/*"
          multiple
          onChange={(event) => handleFilesSelected(event, 'image')}
        />
        <input
          ref={videoInputRef}
          type="file"
          hidden
          accept="video/*"
          multiple
          onChange={(event) => handleFilesSelected(event, 'video')}
        />
        <input
          ref={documentInputRef}
          type="file"
          hidden
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"
          multiple
          onChange={(event) => handleFilesSelected(event, 'document')}
        />
        <input
          ref={audioInputRef}
          type="file"
          hidden
          accept="audio/*"
          multiple
          onChange={(event) => handleFilesSelected(event, 'audio')}
        />

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <IconButton size="small" disabled={sending} onClick={handleAttachmentToggle}>
            <AttachFile />
          </IconButton>
          <IconButton size="small" disabled={sending} onClick={handleEmojiToggle}>
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
            disabled={(!newMessage.trim() && selectedAttachments.length === 0) || sending || !currentUserId}
            startIcon={sending ? <CircularProgress size={20} color="inherit" /> : <Send />}
            sx={{ minWidth: 100 }}
          >
            Send
          </Button>
        </Box>

        <Menu
          anchorEl={attachmentAnchorEl}
          open={Boolean(attachmentAnchorEl)}
          onClose={handleAttachmentMenuClose}
        >
          <MenuItem onClick={() => triggerFilePicker('image')}>
            <ListItemIcon>
              <ImageIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Image" />
          </MenuItem>
          <MenuItem onClick={() => triggerFilePicker('video')}>
            <ListItemIcon>
              <Videocam fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Video" />
          </MenuItem>
          <MenuItem onClick={() => triggerFilePicker('document')}>
            <ListItemIcon>
              <InsertDriveFile fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Document" />
          </MenuItem>
          <MenuItem onClick={() => triggerFilePicker('audio')}>
            <ListItemIcon>
              <Audiotrack fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Audio" />
          </MenuItem>
        </Menu>

        <Popover
          open={Boolean(emojiAnchorEl)}
          anchorEl={emojiAnchorEl}
          onClose={() => setEmojiAnchorEl(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
          transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, minmax(32px, 1fr))',
              gap: 1,
              p: 1.5,
              maxWidth: 260,
            }}
          >
            {EMOJI_OPTIONS.map((emoji) => (
              <Button
                key={emoji}
                onClick={() => handleEmojiSelect(emoji)}
                sx={{ minWidth: 0, p: 0.75, fontSize: '1.2rem' }}
              >
                {emoji}
              </Button>
            ))}
          </Box>
        </Popover>
      </Paper>
    </Box>
  );
};

export default ChatWindow;
