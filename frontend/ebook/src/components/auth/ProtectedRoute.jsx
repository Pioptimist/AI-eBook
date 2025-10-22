import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import Spinner from '../ui/Spinner';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {  //anything which is nested inside protectedroute will be passed as prop called children, this is ver important
  const { isAuthenticated, loading } = useAuth();  //destructuring the values from authcontext
  const location = useLocation();

  if (loading) {
    return <Spinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
