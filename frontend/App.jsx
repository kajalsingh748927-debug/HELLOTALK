import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './src/context/AuthContext.jsx';
import { CallProvider } from './src/context/CallContext.jsx';
import Navbar from './src/components/Navbar.jsx';
import ProtectedRoute from './src/components/ProtectedRoute.jsx';

// Pages
import LandingPage from './src/pages/LandingPage.jsx';
import LoginPage from './src/pages/LoginPage.jsx';
import RegisterPage from './src/pages/RegisterPage.jsx';
import Dashboard from './src/pages/Dashboard.jsx';
import VideoCallPage from './src/pages/VideoCallPage.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<><Navbar /><LandingPage /></>} />
      <Route path="/login" element={<><Navbar /><LoginPage /></>} />
      <Route path="/register" element={<><Navbar /><RegisterPage /></>} />

      {/* Protected */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Navbar />
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/video-call/:roomId"
        element={
          <ProtectedRoute>
            {/* No navbar on call page — full screen */}
            <VideoCallPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <CallProvider>
          <AppRoutes />
        </CallProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
