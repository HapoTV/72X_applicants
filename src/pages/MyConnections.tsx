// src/pages/MyConnections.tsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  Avatar,
  Box,
  Chip,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  IconButton,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search,
  FilterList,
  LocationOn,
  Business,
  Message,
  VideoCall,
  Phone,
} from '@mui/icons-material';
import MessageServices from '../services/MessageServices';
import ChatWindow from '../components/ChatWindow';

interface User {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  location?: string;
  industry?: string;
  bio?: string;
  profileImage?: string;
  isOnline?: boolean;
  lastSeen?: string;
}

const MyConnections: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [chatOpen, setChatOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [industries, setIndustries] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await MessageServices.getChatUsers();
      
      // Don't filter on frontend if backend already filters
      // Let backend handle the filtering based on user role
      setUsers(response);
      setFilteredUsers(response);
      
      // Extract unique industries and locations for filters
      const uniqueIndustries = Array.from(
        new Set(response.map((user: any) => user.industry).filter(Boolean))
      ) as string[];
      
      const uniqueLocations = Array.from(
        new Set(response.map((user: any) => user.location).filter(Boolean))
      ) as string[];
      
      setIndustries(uniqueIndustries);
      setLocations(uniqueLocations);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    filterUsers();
  }, [searchTerm, selectedIndustry, selectedLocation, users]);

  const filterUsers = () => {
    let filtered = [...users];

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user =>
        user.firstName?.toLowerCase().includes(term) ||
        user.lastName?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.industry?.toLowerCase().includes(term) ||
        user.location?.toLowerCase().includes(term)
      );
    }

    // Filter by industry
    if (selectedIndustry !== 'all') {
      filtered = filtered.filter(user => user.industry === selectedIndustry);
    }

    // Filter by location
    if (selectedLocation !== 'all') {
      filtered = filtered.filter(user => user.location === selectedLocation);
    }

    setFilteredUsers(filtered);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleIndustryChange = (event: any) => {
    setSelectedIndustry(event.target.value);
  };

  const handleLocationChange = (event: any) => {
    setSelectedLocation(event.target.value);
  };

  const handleStartChat = (user: User) => {
    setSelectedUser(user);
    setChatOpen(true);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
    setSelectedUser(null);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedIndustry('all');
    setSelectedLocation('all');
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
        <Button onClick={fetchUsers} variant="contained" sx={{ mt: 2 }}>
          Retry
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Connections
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Connect with other users, search by name, industry, or location
      </Typography>

      {/* Search and Filter Bar */}
      <Card sx={{ mb: 4, p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search users by name, email, industry, or location..."
              value={searchTerm}
              onChange={handleSearch}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Industry</InputLabel>
              <Select
                value={selectedIndustry}
                label="Industry"
                onChange={handleIndustryChange}
                startAdornment={
                  <InputAdornment position="start">
                    <Business />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">All Industries</MenuItem>
                {industries.map((industry) => (
                  <MenuItem key={industry} value={industry}>
                    {industry}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Location</InputLabel>
              <Select
                value={selectedLocation}
                label="Location"
                onChange={handleLocationChange}
                startAdornment={
                  <InputAdornment position="start">
                    <LocationOn />
                  </InputAdornment>
                }
              >
                <MenuItem value="all">All Locations</MenuItem>
                {locations.map((location) => (
                  <MenuItem key={location} value={location}>
                    {location}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<FilterList />}
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Results Summary */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="subtitle1">
          Showing {filteredUsers.length} of {users.length} users
        </Typography>
        {users.length > 0 && (
          <Chip 
            label={`${users.length} total users`} 
            color="primary" 
            variant="outlined" 
          />
        )}
      </Box>

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No users found matching your criteria
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Try adjusting your search or filters
          </Typography>
          <Button onClick={clearFilters} variant="contained" sx={{ mt: 2 }}>
            Clear All Filters
          </Button>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredUsers.map((user) => (
            <Grid item xs={12} sm={6} md={4} key={user.userId}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Badge
                      color="success"
                      variant="dot"
                      invisible={!user.isOnline}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                      }}
                    >
                      <Avatar
                        src={user.profileImage}
                        sx={{ width: 56, height: 56, mr: 2 }}
                      >
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </Avatar>
                    </Badge>
                    <Box>
                      <Typography variant="h6">
                        {user.firstName} {user.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                      {user.isOnline ? (
                        <Chip label="Online" color="success" size="small" />
                      ) : (
                        <Typography variant="caption" color="text.secondary">
                          Last seen: {user.lastSeen || 'Recently'}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  {user.industry && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Business fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{user.industry}</Typography>
                    </Box>
                  )}

                  {user.location && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocationOn fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{user.location}</Typography>
                    </Box>
                  )}

                  {user.bio && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {user.bio.length > 100 ? `${user.bio.substring(0, 100)}...` : user.bio}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<Message />}
                      fullWidth
                      onClick={() => handleStartChat(user)}
                    >
                      Message
                    </Button>
                    <IconButton color="primary">
                      <VideoCall />
                    </IconButton>
                    <IconButton color="primary">
                      <Phone />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Chat Dialog */}
      {selectedUser && (
        <Dialog
          open={chatOpen}
          onClose={handleCloseChat}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            Chat with {selectedUser.firstName} {selectedUser.lastName}
          </DialogTitle>
          <DialogContent>
            <ChatWindow
              receiverId={selectedUser.userId}
              receiverName={`${selectedUser.firstName} ${selectedUser.lastName}`}
              receiverEmail={selectedUser.email}
              onClose={handleCloseChat}
              isOpen={chatOpen}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseChat}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default MyConnections;