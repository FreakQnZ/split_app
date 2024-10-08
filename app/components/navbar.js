"use client";

import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import AuthContext from '../context/authContext';

const Navbar = () => {
    const { isAuthenticated, logout, login } = useContext(AuthContext);
    const [contextLoad, setContextLoad] = useState(true);
    useEffect(() => {
        if (isAuthenticated) {
           // Do nothing
        }
        setTimeout(() => {
            setContextLoad(false);
        }, 400);
    }, [isAuthenticated]);

    const logoutAction = () => {
        localStorage.removeItem('token');
        logout();
    };

    if (contextLoad) {
        return (
            <div className="navbar bg-base-100">
                <div className="navbar-start">
                    <Link href="/" className="btn btn-ghost text-xl">Auth</Link>
                </div>
                <div className="navbar-end">
                    <button className="btn">Loading...</button>
                </div>
            </div>
        );
    }

    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <Link href="/" className="btn btn-ghost text-xl">Auth</Link>
            </div>
            <div className="navbar-end">
                {!isAuthenticated ? (
                    <Link href="/auth" className="btn">Login</Link>
                ) : (
                    <button onClick={logoutAction} className="btn">Logout</button>
                )}
            </div>
        </div>
    );
};

export default Navbar;
