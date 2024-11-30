import React, { useState } from 'react';
import { adminLogin } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { setUsername, setPassword, resetForm } from "../slices/FormSlice";
import { setUser } from '../slices/adminSlice'; 
import { Container, Paper, TextField, Button, IconButton, InputAdornment, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

function AdminLogin() {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { username, password } = useSelector((state) => state.form);

    const validate = () => {
        const newErrors = {};
        if (!username) {
            newErrors.username = "Username is required.";
        }
        if (!password) {
            newErrors.password = "Password is required.";
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({}); 
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setLoading(false);
            return; 
        }

        try {
            const response = await adminLogin(username, password); 
            const { isSuperuser, isActive } = response; 
            
            dispatch(setUser({ isSuperuser, isActive })); 
            navigate('/admindashboard'); 
            
            dispatch(resetForm()); 
        } catch (error) {
            alert('Login failed. You must be an admin.');
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: "2rem" }}>
            <Paper elevation={3} style={{ padding: "2rem", borderRadius: "8px" }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Admin Login
                </Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        className="form-input"
                        type="text"
                        value={username}
                        onChange={(e) => dispatch(setUsername(e.target.value))}
                        label="Username"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        error={!!errors.username} 
                        helperText={errors.username} 
                    />

                    <TextField
                        className="form-input"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => dispatch(setPassword(e.target.value))}
                        label="Password"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        error={!!errors.password} 
                        helperText={errors.password} 
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button 
                        className="form-button" 
                        type="submit" 
                        variant="contained" 
                        color="primary" 
                        fullWidth 
                        disabled={loading}
                        style={{ marginTop: "1rem" }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </Button>
                </form>
            </Paper>
        </Container>
    );
} 

export default AdminLogin;