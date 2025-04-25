import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button.tsx';
import Card from '../components/Card.tsx';
import Input from '../components/Input.tsx';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      setSuccess('Conta criada com sucesso! Redirecionando para login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Erro ao criar conta');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
      <Card title="Criar nova conta">
        <form onSubmit={handleRegister}>
          <Input label="Nome completo" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength="6" required />
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <Button type="submit" className="w-full">Registrar</Button>
        </form>
        <p className="mt-4 text-center text-gray-600">
          Já tem uma conta? <Link to="/login" className="text-green-600 hover:underline">Faça login</Link>
        </p>
      </Card>
    </div>
  );
};

export default RegisterPage;
