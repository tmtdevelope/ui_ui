
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Prevent rendering or redirection until `isAuthenticated` is resolved
    /*    if (user === null) {
           alert(user)
           return; // Don't render anything until the state is resolved
       } */
    /*  if (user === null) {
         return
     } */
    useEffect(() => {
        const isAuth = isAuthenticated
        // Redirect if the user is not authenticated
        if (!isAuth) {
            router.push('/sign-in');
            // return;
        }

        // Redirect if the user does not have the required role
        if (!user?.roles || user.roles[0] !== 'admin') {
            router.push('/sign-in');
            return;
        }

        // Redirect to dashboard if the user is on the root admin path
        if (pathname === '/admin') {
            router.push('/admin/dashboard');
            return;

        }
    }, [isAuthenticated, user, pathname, router]);

    return <>{children}</>;
};

export default ProtectedRoute;
