import React, { useEffect, useState } from "react";
import { TextField, Button, Typography, Container, Paper, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import api from "../api";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUsername, resetForm } from "../slices/FormSlice";

const EditUser = () => {
    const dispatch = useDispatch();
    const { username } = useSelector((state) => state.form);
    const { userId } = useParams(); 
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/api/users/${userId}/`)
            .then(response => {
                dispatch(setUsername(response.data.username)); 
            })
            .catch(error => {
                console.error('Failed to fetch user data:', error);
                setError('Failed to fetch user data.');
            });

        return () => {
            dispatch(resetForm());
        };
    }, [userId, dispatch]);

    const validate = () => {
        const newErrors = {};
        if (!username) {
            newErrors.username = "Username is required.";
        } else if (!/^[a-zA-Z0-9_]{3,}$/.test(username)) {
            newErrors.username = "Username must be at least 3 characters and can only contain letters, numbers, and underscores.";
        }
        return newErrors; 
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setError(validationErrors.username); 
            return;
        } else {
            setError(''); 
        }

        const updatedUserData = { username }; 

        api.put(`/api/users/${userId}/`, updatedUserData)
            .then(response => {
                setSuccess('User updated successfully.');
                navigate('/admindashboard'); 
            })
            .catch(error => {
                console.error('Failed to update user:', error.response.data); 
                setError('Failed to update user.'); 
            });
    };


    const back = () => {
        navigate('/admindashboard')
    }

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} style={{ padding: '16px', marginTop: '16px' }}>
                <Typography variant="h4" gutterBottom>Edit User</Typography>
                
                <form onSubmit={handleSubmit}>
                     <TextField
                        label="Username"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        type="text"
                        value={username}
                        onChange={(e) => dispatch(setUsername(e.target.value))}
                        placeholder="Username"
                        error={!!error} 
                        helperText={error} 
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        fullWidth
                        style={{ marginTop: '16px' }}
                    >
                        Save Changes
                    </Button>

                    <Button
                    variant="outlined"
                    color="secondary"
                    onClick={back}
                    fullWidth
                    style={{ marginTop: '16px' }}
                >
                    Back
                </Button>
                </form>
            </Paper>
        </Container>
    );
};

export default EditUser;