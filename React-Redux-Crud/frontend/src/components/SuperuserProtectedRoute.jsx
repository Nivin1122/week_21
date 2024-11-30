import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function SuperuserProtectedRoute({ children }) {
    const { isSuperuser, isActive } = useSelector((state) => state.admin);

    return isSuperuser && isActive ? children : <Navigate to="/adminlogin" />;
}

export default SuperuserProtectedRoute;