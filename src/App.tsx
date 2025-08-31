import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ServiceProvider } from './contexts/ServiceContext';
import { ChatProvider } from './contexts/ChatContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { OnlineStatusProvider } from './contexts/OnlineStatusContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import RegisterClient from './pages/RegisterClient';
import RegisterCG from './pages/RegisterCG';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Services from './pages/Services';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import CookiePolicy from './pages/CookiePolicy';

// Component to handle scroll to top on route change
const ScrollToTop: React.FC = () => {
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};

const AppRoutes: React.FC = () => {
  return (
    <>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register-client" element={<RegisterClient />} />
          <Route path="/register-cg" element={<RegisterCG />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/services" element={<Services />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:cgId" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
        </Routes>
      </Layout>
    </>
  );
};

function App() {
  return (
      <AuthProvider>
        <OnlineStatusProvider>
          <ServiceProvider>
              <NotificationProvider>
                 <ChatProvider>
                    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                      <AppRoutes />
                    </Router>
                </ChatProvider>
              </NotificationProvider>
          </ServiceProvider>
        </OnlineStatusProvider>
      </AuthProvider>
  );
}

export default App;