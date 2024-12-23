/** @format */

'use client';

import {
	createContext,
	useContext,
	useEffect,
	useState,
	ReactNode,
	useLayoutEffect,
} from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../utils/authService';

interface User {
	name: string;
	email: string;
	roles: string[];
	token: string;
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
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const router = useRouter();

	const login = (userData: User) => {
		setUser(userData);
		localStorage.setItem('user', JSON.stringify(userData));
		setIsAuthenticated(true);

		// Redirect based on role
		if (userData.roles[0] === 'admin') {
			router.push('/admin/dashboard');
		} else {
			router.push('/user/dashboard');
		}
	};

	const logout = async () => {
		try {
			const userString = localStorage.getItem('user');

			if (userString) {
				const user: User = JSON.parse(userString);
				if (user.token) {
					await authService.logout(user);
					setUser(null);
					localStorage.removeItem('user');
					setIsAuthenticated(false);
					router.push('/sign-in');
				}
			}
		} catch (error) {
			console.error('Failed to logout', error);
		}
	};

	useLayoutEffect(() => {
		const storedUser = localStorage.getItem('user');

		if (storedUser) {
			try {
				const parsedUser: User = JSON.parse(storedUser);
				setUser(parsedUser);
				setIsAuthenticated(true);
			} catch (error) {
				console.error('Failed to parse user from localStorage', error);
				localStorage.removeItem('user'); // إزالة القيمة غير الصحيحة
				setIsAuthenticated(false);
			}
		} else {
			setIsAuthenticated(false);
		}
		setIsLoading(false);
	}, []);

	// Avoid rendering until loading is complete
	/*  if (isLoading) {
         return null; // Optionally return null if you don't want to show a loading message
     } */

	return (
		<AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
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
