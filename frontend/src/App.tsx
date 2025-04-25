import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login.tsx';
import RegisterPage from './pages/Register.tsx';
import ReservasPage from './pages/Reservas.tsx';
import AdminPanel from './pages/AdminPanel.tsx';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage setToken={setToken} />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/reservas" element={<ReservasPage token={token} />} />
        <Route path="*" element={<LoginPage setToken={setToken} />} />
        <Route path="/admin" element={<AdminPanel token={token} />} />
      </Routes>
    </Router>
  );
};

export default App;
