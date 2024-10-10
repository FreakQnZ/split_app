import React from 'react';
import Link from 'next/link';

const Navbar = () => {
    return (
        <div className="navbar bg-base-100">
            <div className="navbar-start">
                <Link href="/" className="btn btn-ghost text-xl">Split</Link>
            </div>
            <div className="navbar-end">
                <Link href="/auth" className="btn">Login</Link>
            </div>
        </div>
    );
};

export default Navbar;
