import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../../api/auth.service';

const PrivateRoute = ({ roles }) => {
    const currentUser = authService.getCurrentUser();

    if (!currentUser || !currentUser.token) {
        return <Navigate to="/login" replace />;
    }

    const userRole = currentUser.role.replace('ROLE_', '');
    const requiredRoles = roles.map(r => r.replace('ROLE_', ''));

    console.log('PrivateRoute Debug:', { userRole, requiredRoles, allowed: requiredRoles.includes(userRole) });

    if (requiredRoles && !requiredRoles.includes(userRole)) {
        // Redirect to appropriate dashboard based on actual role
        if (userRole === 'ADMIN') return <Navigate to="/admin" replace />;
        if (userRole === 'INSTRUCTOR') return <Navigate to="/instructor" replace />;
        if (userRole === 'STUDENT') return <Navigate to="/courses" replace />;
        // Fallback
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
