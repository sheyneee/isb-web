import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const userRole = user?.roleinBarangay;
    const location = useLocation(); // Get current location

    // Check for password reset token in the URL or localStorage (to handle protected reset-password route)
    const urlParams = new URLSearchParams(location.search);
    const resetPasswordToken = urlParams.get('token') || localStorage.getItem('resetPasswordToken');

    if (!token && requiredRole !== 'reset-password') {
        return <Navigate to="/" />;
    }

    const isAdminRole = ['Barangay Captain', 'Secretary', 'Kagawad'].includes(userRole);
    const isResidentRole = ['Resident'].includes(userRole);

    // Check if the current route requires admin access but the user is not an admin
    if (requiredRole === 'admin' && !isAdminRole) {
        // Redirect residents trying to access /home to /Resident/Home
        if (isResidentRole && location.pathname === '/home') {
            return <Navigate to="/Resident/Home" />;
        }
        return <Navigate to="/" />;
    }

    // Check if the current route requires resident access but the user is not a resident
    if (requiredRole === 'resident' && !isResidentRole) {
        // Redirect admins trying to access /Resident/Home to /home
        if (isAdminRole && location.pathname === '/Resident/Home') {
            return <Navigate to="/home" />;
        }
        return <Navigate to="/" />;
    }

   // Password reset route handling (admin or resident)
   if (requiredRole === 'reset-password') {
    if (!resetPasswordToken) {
        return <Navigate to="/forgot-password" />;
    }

    // Handle route redirection based on role
    if (isAdminRole && location.pathname.includes('/Resident/reset-password')) {
        return <Navigate to="/Admin/reset-password" />;
    }

    if (isResidentRole && location.pathname.includes('/Admin/reset-password')) {
        return <Navigate to="/Resident/reset-password" />;
    }
}

    return children;
};

export default ProtectedRoute;
