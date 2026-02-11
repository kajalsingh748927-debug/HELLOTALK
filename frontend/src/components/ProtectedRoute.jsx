import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-void flex items-center justify-center">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 rounded-full bg-cyan-500 dot-1" />
          <span className="w-2 h-2 rounded-full bg-cyan-500 dot-2" />
          <span className="w-2 h-2 rounded-full bg-cyan-500 dot-3" />
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
