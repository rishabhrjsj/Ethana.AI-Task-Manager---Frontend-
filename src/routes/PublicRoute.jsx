import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
