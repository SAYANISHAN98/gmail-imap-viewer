import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('token')) return true;
    return !!localStorage.getItem('token');
  });

  useEffect(() => {
    // Check if token exists in localStorage or url params
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get('token');
    
    if (tokenFromUrl) {
      localStorage.setItem('token', tokenFromUrl);
      window.history.replaceState({}, document.title, '/dashboard');
      setIsAuthenticated(true);
    } else if (localStorage.getItem('token')) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Routes>
          <Route 
            path="/login" 
            element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard onLogout={() => {
              localStorage.removeItem('token');
              setIsAuthenticated(false);
            }}/> : <Navigate to="/login" />} 
          />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
