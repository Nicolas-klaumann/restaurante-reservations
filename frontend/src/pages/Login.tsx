import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button.tsx';
import Card from '../components/Card.tsx';
import Input from '../components/Input.tsx';

const LoginPage = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);

      if (res.data.admin) {
        navigate('/admin');
      } else {
        navigate('/reservas');
      }
    } catch (err) {
      setError('Credenciais inválidas');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
      <Card title="Acessar sua conta">
        <form onSubmit={handleLogin}>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <Button type="submit" className="w-full">Entrar</Button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Não tem uma conta? <Link to="/registro" className="text-green-600 hover:underline">Registre-se</Link>
        </p>
      </Card>
    </div>
  );
};

export default LoginPage;
