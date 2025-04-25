import React, { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [table, setTable] = useState(1);
  const [dateTime, setDateTime] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      console.log(res);

      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setMessage('Login bem-sucedido');
    } catch (err) {
      setMessage('Erro ao fazer login');
    }
  };

  const handleReserva = async () => {
    try {
      await axios.post('http://localhost:5000/api/reservas', { table, dateTime }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage('Reserva feita com sucesso');
    } catch (err) {
      setMessage('Erro ao fazer reserva');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-100 p-6">
      <h1 className="text-3xl font-bold mb-4">Sistema de Reservas</h1>

      {!token ? (
        <div className="bg-white p-6 rounded shadow w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Login</h2>
          <input className="border p-2 w-full mb-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="border p-2 w-full mb-2" placeholder="Senha" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="bg-green-600 text-white px-4 py-2 rounded w-full" onClick={handleLogin}>Entrar</button>
        </div>
      ) : (
        <div className="bg-white p-6 rounded shadow w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4">Nova Reserva</h2>
          <input className="border p-2 w-full mb-2" type="number" min="1" max="15" placeholder="Mesa (1-15)" value={table} onChange={e => setTable(parseInt(e.target.value))} />
          <input className="border p-2 w-full mb-2" type="datetime-local" value={dateTime} onChange={e => setDateTime(e.target.value)} />
          <button className="bg-green-600 text-white px-4 py-2 rounded w-full" onClick={handleReserva}>Reservar</button>
        </div>
      )}

      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
    </div>
  );
}
