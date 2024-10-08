"use client";

import { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            try {
                const res = await fetch("/api/validate", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ token }),
                });

                const data = await res.json();

                if (data?.success) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    localStorage.removeItem('token');
                }
            } catch (error) {
                console.error("Error during authentication check", error);
                setIsAuthenticated(false);
            } finally {
                setLoading(false); // Stop loading once check is complete
            }
        };

        checkAuth();
    }, []);

    

    const login = () => {
        setIsAuthenticated(true);
        router.push('/'); // redirect after login
    };

    const logout = () => {
        setIsAuthenticated(false);
        router.push('/auth'); // redirect after logout
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
