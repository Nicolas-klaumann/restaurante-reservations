// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
// import { format, parseISO, isSunday, isBefore, isAfter, addHours } from 'date-fns';
// import { ptBR } from 'date-fns/locale';
// import Button from './components/Button.tsx';
// import Card from './components/Card.tsx';
// import Input from './components/Input.tsx';

// // Páginas
// const LoginPage = ({ setToken }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
//       setToken(res.data.token);
//       localStorage.setItem('token', res.data.token);
//       navigate('/reservas');
//     } catch (err) {
//       setError('Credenciais inválidas');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
//       <Card title="Acessar sua conta">
//         <form onSubmit={handleLogin}>
//           <Input 
//             label="Email" 
//             type="email" 
//             value={email} 
//             onChange={(e) => setEmail(e.target.value)} 
//             required 
//           />
//           <Input 
//             label="Senha" 
//             type="password" 
//             value={password} 
//             onChange={(e) => setPassword(e.target.value)} 
//             required 
//           />
//           {error && <p className="text-red-500 mb-4">{error}</p>}
//           <Button type="submit" className="w-full">Entrar</Button>
//         </form>
//         <p className="mt-4 text-center text-gray-600">
//           Não tem uma conta? <Link to="/registro" className="text-green-600 hover:underline">Registre-se</Link>
//         </p>
//       </Card>
//     </div>
//   );
// };

// const RegisterPage = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const navigate = useNavigate();

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
//       setSuccess('Conta criada com sucesso! Redirecionando para login...');
//       setTimeout(() => navigate('/login'), 2000);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Erro ao criar conta');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
//       <Card title="Criar nova conta">
//         <form onSubmit={handleRegister}>
//           <Input 
//             label="Nome completo" 
//             value={name} 
//             onChange={(e) => setName(e.target.value)} 
//             required 
//           />
//           <Input 
//             label="Email" 
//             type="email" 
//             value={email} 
//             onChange={(e) => setEmail(e.target.value)} 
//             required 
//           />
//           <Input 
//             label="Senha" 
//             type="password" 
//             value={password} 
//             onChange={(e) => setPassword(e.target.value)} 
//             minLength="6"
//             required 
//           />
//           {error && <p className="text-red-500 mb-4">{error}</p>}
//           {success && <p className="text-green-500 mb-4">{success}</p>}
//           <Button type="submit" className="w-full">Registrar</Button>
//         </form>
//         <p className="mt-4 text-center text-gray-600">
//           Já tem uma conta? <Link to="/login" className="text-green-600 hover:underline">Faça login</Link>
//         </p>
//       </Card>
//     </div>
//   );
// };

// const ReservasPage = ({ token }) => {
//   const [table, setTable] = useState(1);
//   const [dateTime, setDateTime] = useState('');
//   const [message, setMessage] = useState({ text: '', type: '' });
//   const [userReservations, setUserReservations] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     if (!token) {
//       navigate('/login');
//     } else {
//       fetchUserReservations();
//     }
//   }, [token, navigate]);

//   const fetchUserReservations = async () => {
//     try {
//       const res = await axios.get('http://localhost:5000/api/reservas/minhas-reservas', {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setUserReservations(res.data);
//     } catch (err) {
//       setMessage({ text: 'Erro ao carregar reservas', type: 'error' });
//     }
//   };

//   const handleReserva = async (e) => {
//     e.preventDefault();
//     setLoading(true);
    
//     try {
//       const selectedDate = parseISO(dateTime);
      
//       // Validação no frontend (reforça as validações do backend)
//       if (isSunday(selectedDate)) {
//         throw new Error('Não é possível reservar aos domingos');
//       }
      
//       const openingTime = new Date(selectedDate);
//       openingTime.setHours(18, 0, 0, 0);
      
//       const closingTime = new Date(selectedDate);
//       closingTime.setHours(23, 59, 0, 0);
      
//       if (isBefore(selectedDate, openingTime) || isAfter(selectedDate, closingTime)) {
//         throw new Error('Reservas permitidas apenas entre 18:00 e 23:59');
//       }

//       await axios.post('http://localhost:5000/api/reservas', { table, dateTime }, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       setMessage({ text: 'Reserva feita com sucesso!', type: 'success' });
//       setDateTime('');
//       fetchUserReservations();
//     } catch (err) {
//       setMessage({ 
//         text: err.response?.data?.message || err.message || 'Erro ao fazer reserva', 
//         type: 'error' 
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancelReservation = async (id) => {
//     try {
//       await axios.delete(`http://localhost:5000/api/reservas/${id}`, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
//       setMessage({ text: 'Reserva cancelada com sucesso', type: 'success' });
//       fetchUserReservations();
//     } catch (err) {
//       setMessage({ text: 'Erro ao cancelar reserva', type: 'error' });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
//       <div className="max-w-4xl mx-auto">
//         <header className="flex justify-between items-center mb-8">
//           <h1 className="text-2xl font-bold text-gray-800">Sistema de Reservas</h1>
//           <Button onClick={() => {
//             localStorage.removeItem('token');
//             navigate('/login');
//           }}>Sair</Button>
//         </header>

//         <div className="grid md:grid-cols-2 gap-8">
//           <Card title="Nova Reserva">
//             <form onSubmit={handleReserva}>
//               <Input 
//                 label="Número da Mesa (1-15)" 
//                 type="number" 
//                 min="1" 
//                 max="15" 
//                 value={table} 
//                 onChange={(e) => setTable(parseInt(e.target.value))} 
//                 required 
//               />
              
//               <Input 
//                 label="Data e Hora" 
//                 type="datetime-local" 
//                 value={dateTime} 
//                 onChange={(e) => setDateTime(e.target.value)} 
//                 required 
//               />
              
//               {message.text && (
//                 <p className={`mb-4 ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
//                   {message.text}
//                 </p>
//               )}
              
//               <Button type="submit" className="w-full" disabled={loading}>
//                 {loading ? 'Processando...' : 'Fazer Reserva'}
//               </Button>
//             </form>
//           </Card>

//           <div>
//             <h2 className="text-xl font-semibold mb-4 text-gray-800">Minhas Reservas</h2>
            
//             {userReservations.length === 0 ? (
//               <p className="text-gray-600">Você não tem reservas ainda.</p>
//             ) : (
//               <div className="space-y-4">
//                 {userReservations.map(reserva => (
//                   <div key={reserva._id} className="bg-white p-4 rounded-lg shadow">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <p className="font-medium">Mesa {reserva.table}</p>
//                         <p className="text-gray-600">
//                           {format(parseISO(reserva.dateTime), "PPPPp", { locale: ptBR })}
//                         </p>
//                         <p className={`text-sm ${
//                           new Date(reserva.dateTime) < new Date() ? 
//                           'text-gray-500' : 'text-green-600'
//                         }`}>
//                           {new Date(reserva.dateTime) < new Date() ? 
//                            'Reserva concluída' : 'Reserva ativa'}
//                         </p>
//                       </div>
//                       {new Date(reserva.dateTime) > new Date() && (
//                         <button 
//                           onClick={() => handleCancelReservation(reserva._id)}
//                           className="text-red-500 hover:text-red-700 text-sm"
//                         >
//                           Cancelar
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const App = () => {
//   const [token, setToken] = useState(localStorage.getItem('token') || '');

//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<LoginPage setToken={setToken} />} />
//         <Route path="/registro" element={<RegisterPage />} />
//         <Route path="/reservas" element={<ReservasPage token={token} />} />
//         <Route path="*" element={<LoginPage setToken={setToken} />} />
//       </Routes>
//     </Router>
//   );
// };

// export default App;

import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/Login.tsx';
import RegisterPage from './pages/Register.tsx';
import ReservasPage from './pages/Reservas.tsx';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage setToken={setToken} />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/reservas" element={<ReservasPage token={token} />} />
        <Route path="*" element={<LoginPage setToken={setToken} />} />
      </Routes>
    </Router>
  );
};

export default App;
