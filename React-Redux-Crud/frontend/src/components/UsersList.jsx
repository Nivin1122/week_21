import React, { useState, useEffect } from 'react';
import { TextField, List, ListItem, ListItemText, Button, Typography, Container, Paper } from '@mui/material';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { setUsers, setFilteredUsers, setSearchTerm } from '../slices/userslistSlice';
import { useDispatch, useSelector } from 'react-redux';

const UserList = () => {

    const [error, setError] = useState('');

    const { users, filteredUsers, searchTerm } = useSelector( (state) => 
        state.userslist
    )

    const dispatch = useDispatch();

    const navigate = useNavigate();
    
    useEffect(() => {
        api.get('/api/admin/users/')
            .then(response => {
                dispatch(setUsers(response.data));
                dispatch(setFilteredUsers(response.data));
            })
            .catch(error => {
                setError('Failed to fetch users');
            });
    }, []);

    const toggleUserStatus = (userId) => {
        api.post(`/api/admin/users/toggle/${userId}/`)
            .then(response => {
                const updatedUsers = users.map(user => 
                    user.id === userId ? { ...user, is_active: !user.is_active } : user
                );
                dispatch(setUsers(updatedUsers));
                filterUsers(searchTerm, updatedUsers); 
            })
            .catch(error => {
                setError('Failed to update user status');
            });
    };


    const filterUsers = (term, userList = users) => {
        const filtered = userList.filter(user =>
            user.username.toLowerCase().includes(term.toLowerCase())
        );
        dispatch(setFilteredUsers(filtered));
    };

    const handleSearch = (event) => {
        const term = event.target.value;
        dispatch(setSearchTerm(term));
        filterUsers(term);
    };

    const logout = () => {
        navigate('/adminlogout');
    };

    const handleEditUser = (userId) => {
        navigate(`/edit-user/${userId}`);
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} style={{ padding: '16px', marginTop: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h4" gutterBottom>
                        User List
                    </Typography>
                    <Button variant="outlined" color="secondary" onClick={logout}>
                        Logout
                    </Button>
                </div>
                {error && <Typography color="error">{error}</Typography>}
                <TextField
                    label="Search Users"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <List>
                    {filteredUsers.map(user => (
                        <ListItem key={user.id} divider>
                            <ListItemText 
                                primary={user.username} 
                                secondary={`Status: ${user.is_active ? 'Active' : 'Inactive'}`}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => toggleUserStatus(user.id)}
                                style={{ marginRight: '8px' }} 
                            >
                                Toggle Status
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => handleEditUser(user.id)} 
                            >
                                Edit
                            </Button>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Container>
    );
};

export default UserList;