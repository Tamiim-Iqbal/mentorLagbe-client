import React from 'react';

const AuthLayout = ({children}: {children: React.ReactNode}) => {
    return (
        <>
        <h2>Auth Layout</h2>
            {children}
        </>
    );
};

export default AuthLayout;