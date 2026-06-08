import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, role, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // If they have a role but it's not allowed here, redirect to their respective dashboard
    if (role === 'doctor') return <Navigate to="/doctor-dashboard" replace />;
    if (role === 'patient') return <Navigate to="/patient-dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
