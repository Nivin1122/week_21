import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUsername, setPassword, resetForm } from "../slices/FormSlice";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { Container, Paper, TextField, Button, IconButton, InputAdornment, Typography } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "../styles/Form.css";

function Form({ route, method }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { username, password } = useSelector((state) => state.form);

    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [generalError, setGeneralError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const name = method === "login" ? "Login" : "Register";

    const validate = () => {
        const newErrors = {};
        if (!username) {
            newErrors.username = "Username is required.";
        } else if (!/^[a-zA-Z0-9_]{3,}$/.test(username)) {
            newErrors.username = "Username must be at least 3 characters and can only contain letters, numbers, and underscores.";
        }

        if (!password) {
            newErrors.password = "Password is required.";
        } else if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters long.";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setGeneralError("");

        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setLoading(false);
            return; 
        }

        try {
            const res = await api.post(route, { username, password });
            console.log('Response:', res.data); 
            
            if (method === "login") {
                if (res.data.access && res.data.refresh) {
                    localStorage.setItem(ACCESS_TOKEN, res.data.access);
                    localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                    localStorage.setItem('user_id', res.data.user_id); 
                    console.log('User ID stored:', res.data.user_id);
                    navigate("/");
                } else {
                    console.error('Access and Refresh tokens not found in login response:', res.data);
                }
            } else if (method === "register") {
                console.log('Registration successful:', res.data);
                
                navigate("/login"); 
            }
            
            dispatch(resetForm());
        } catch (error) {
            if (error.response && error.response.data && error.response.data.detail) {
                setGeneralError("Incorrect username or password."); 
            } else {
                setGeneralError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const navigateToOppositeForm = () => {
        navigate(method === "login" ? "/register" : "/login");
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} style={{ padding: "2rem", marginTop: "2rem", borderRadius: "8px" }}>
                <Typography variant="h4" align="center" gutterBottom>
                    {name}
                </Typography>
                {generalError && <div className="general-error">{generalError}</div>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        className="form-input"
                        type="text"
                        label="Username"
                        value={username}
                        onChange={(e) => dispatch(setUsername(e.target.value))}
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
                        {loading ? "Loading..." : name}
                    </Button>
                    <p className="link" onClick={navigateToOppositeForm} style={{ textAlign: "center", marginTop: "1rem" }}>
                        {method === "login" ? "If you don't have an account, sign up here." : "Already have an account? Log in here."}
                    </p>
                </form>
            </Paper>
        </Container>
    );
}

export default Form;