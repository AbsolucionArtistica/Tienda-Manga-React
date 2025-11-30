import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ role }) => {
    const { user, loading } = useAuth();

    if (loading) return <div>Cargando...</div>;

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (role && user.role !== role) {
        return <Navigate to="/tienda" />; // O una página de "Acceso Denegado"
    }

    return <Outlet />;
};

export default ProtectedRoute;
