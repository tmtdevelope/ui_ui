// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    name: string;
    role: 'admin' | 'quote';  // Define roles here
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (userData: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));

        // Redirect based on role
        if (userData.role === 'admin') {
            router.push('/admin');
        } else {
            router.push('/user');  // Adjust path for user dashboard
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        router.push('/signin');
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
