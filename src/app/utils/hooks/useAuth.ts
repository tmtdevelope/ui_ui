// hooks/useAuth.ts
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string;
    email: string;
    token: string;
    roles?: string[];
}

const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // تحقق إذا كانت البيئة هي المتصفح قبل الوصول إلى localStorage
        if (typeof window !== 'undefined') {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                router.push('/sign-in');
            }
            setLoading(false);
        }
    }, [router]);

    const logout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('user');
        }
        setUser(null);
        router.push('/sign-in');
    };

    return { user, loading, logout };
};

export default useAuth;
