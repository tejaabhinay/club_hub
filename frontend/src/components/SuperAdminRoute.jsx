import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const SuperAdminRoute = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="text-white text-center mt-10">Loading...</div>;
    }

    if (user && user.role === 'superadmin') {
        return <Outlet />;
    }

    return <Navigate to="/dashboard" />;
};

export default SuperAdminRoute;
