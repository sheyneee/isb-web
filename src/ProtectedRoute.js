import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const userRole = user?.roleinBarangay;
    const location = useLocation(); // Get current location

    // Log current role and required role
    console.log('Current user role:', userRole);
    console.log('Required role:', requiredRole);

    if (!token) {
        console.log('No token found, redirecting to login...');
        return <Navigate to="/" />;
    }

    const isAdminRole = ['Barangay Captain', 'Secretary', 'Kagawad'].includes(userRole);
    const isResidentRole = ['Resident'].includes(userRole);

    // Check if the current route requires admin access but the user is not an admin
    if (requiredRole === 'admin' && !isAdminRole) {
        console.log(`User role ${userRole} does not match required role admin, redirecting...`);
        // Redirect residents trying to access /home to /Resident/Home
        if (isResidentRole && location.pathname === '/home') {
            return <Navigate to="/Resident/Home" />;
        }
        return <Navigate to="/" />;
    }

    // Check if the current route requires resident access but the user is not a resident
    if (requiredRole === 'resident' && !isResidentRole) {
        console.log(`User role ${userRole} does not match required role resident, redirecting...`);
        // Redirect admins trying to access /Resident/Home to /home
        if (isAdminRole && location.pathname === '/Resident/Home') {
            return <Navigate to="/home" />;
        }
        return <Navigate to="/" />;
    }

    return children;
};

export default ProtectedRoute;
