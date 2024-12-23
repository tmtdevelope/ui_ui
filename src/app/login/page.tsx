// src/pages/signin.tsx
'use client'
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../utils/authService';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';

export default function SignInPage() {
    const { login } = useAuth(); // Now useAuth can be safely used
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response: any = await authService.login({ email, password });
            const userData = response.data.data
            login(userData);  // Pass the user object to the AuthContext
        } catch (err: any) {
            setError(err.message || 'Login failed');
        }
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            minHeight="100vh"
            p={3}
        >
            <Typography variant="h4" gutterBottom>
                Sign In
            </Typography>
            <Box component="form" onSubmit={handleSubmit} width="100%" maxWidth="400px">
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
                    Login
                </Button>
            </Box>
        </Box>
    );
}
