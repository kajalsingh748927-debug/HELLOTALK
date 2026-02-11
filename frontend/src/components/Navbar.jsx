import { Link, useNavigate } from 'react-router-dom';
import { Mic2, LogOut, User, Radio } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-void/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center
            group-hover:bg-cyan-500/20 group-hover:border-cyan-500/60 transition-all duration-200">
            <Radio className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-white">
            Open<span className="text-cyan-400">Talk</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg text-subtle hover:text-white
                  hover:bg-surface transition-all duration-200 text-sm font-body"
              >
                <User className="w-4 h-4" />
                <span>{user?.username}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-subtle hover:text-red-400
                  hover:bg-surface transition-all duration-200 text-sm font-body"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost text-sm py-2 px-4">
                Log in
              </Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
