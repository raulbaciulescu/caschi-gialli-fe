import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ServiceProvider } from './contexts/ServiceContext';
import { ChatProvider } from './contexts/ChatContext';
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

function App() {
  return (
      <AuthProvider>
        <ServiceProvider>
          <ChatProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
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
                </Routes>
              </Layout>
            </Router>
          </ChatProvider>
        </ServiceProvider>
      </AuthProvider>
  );
}

export default App;