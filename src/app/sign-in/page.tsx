'use client'

import { useState, FormEvent, FocusEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../utils/authService';
import { TextField, Button, Box, Typography, Alert, CircularProgress } from '@mui/material';
import Logo from '../components/Logo';
import { styled } from '@mui/material/styles';
import { z } from 'zod';

// Custom styled components
interface StyledBoxProps {
    variant?: 'default' | 'dark' | 'light';
}

const StyledBox = styled(Box)<StyledBoxProps>(({ variant }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: 0, // Adjust gap as needed
    // padding: 3,
    /*  backgroundImage:
         variant === 'dark'
             ? 'url("/path/to/dark-background.jpg")'
             : variant === 'light'
                 ? 'url("/path/to/light-background.jpg")'
                 : 'url("/path/to/default-background.jpg")', // Replace with actual paths
     backgroundSize: 'cover',
     backgroundPosition: 'center', */
    width: '100%',
    margin: 0
}));

const StyledForm = styled('form')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 400,
    padding: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    marginTop: '20px',
});

// Define the validation schema with Zod
const signInSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export default function SignInPage(): JSX.Element {
    const { login } = useAuth();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const handleEmailBlur = (e: FocusEvent<HTMLInputElement>) => {
        const validationResult = signInSchema.shape.email.safeParse(e.target.value);
        if (!validationResult.success) {
            setEmailError(validationResult.error.errors[0].message);
        } else {
            setEmailError(null);
        }
    };

    const handlePasswordBlur = (e: FocusEvent<HTMLInputElement>) => {
        const validationResult = signInSchema.shape.password.safeParse(e.target.value);
        if (!validationResult.success) {
            setPasswordError(validationResult.error.errors[0].message);
        } else {
            setPasswordError(null);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        setError(null);

        const validationResult = signInSchema.safeParse({ email, password });
        if (!validationResult.success) {
            setError(validationResult.error.errors.map(err => err.message).join(', '));
            return;
        }

        try {
            setIsLoading(true);
            const response: any = await authService.login({ email, password });
            setIsLoading(false);
            const userData = response.data.data;
            login(userData);
        } catch (err: any) {
            setError(err.message || 'Login failed');
        }
    };

    return (
        <div/*  style={{ backgroundColor: 'red', padding: 10 }} */>
            <StyledBox bgcolor={'#e8eaf6'}> {/* Change variant to "dark" or "light" as needed */}
                <StyledForm onSubmit={handleSubmit} noValidate>
                    <Logo width="300px" height="auto" />

                    <Typography variant="h6" gutterBottom sx={{ mt: 5 }}>
                        Sign In
                    </Typography>
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={handleEmailBlur}
                        error={!!emailError}
                        helperText={emailError}
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
                        onBlur={handlePasswordBlur}
                        error={!!passwordError}
                        helperText={passwordError}
                        required
                    />
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Button type="submit" disabled={isLoading} variant="contained" color="primary" fullWidth sx={{ mt: 3 }}>
                        {isLoading ? (
                            <CircularProgress size={20} />
                        ) : (
                            'Login'
                        )}
                    </Button>
                </StyledForm>
            </StyledBox>
        </div>
    );
}
