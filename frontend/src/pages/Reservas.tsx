import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, isSunday, isBefore, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Button from '../components/Button.tsx';
import Card from '../components/Card.tsx';
import Input from '../components/Input.tsx';

const ReservasPage = ({ token }) => {
  const [table, setTable] = useState(1);
  const [dateTime, setDateTime] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const [userReservations, setUserReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchUserReservations();
    }
  }, [token, navigate]);

  const fetchUserReservations = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reservas/minhas-reservas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserReservations(res.data);
    } catch {
      setMessage({ text: 'Erro ao carregar reservas', type: 'error' });
    }
  };

  const handleReserva = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const selectedDate = parseISO(dateTime);
      if (isSunday(selectedDate)) throw new Error('Não é possível reservar aos domingos');

      const openingTime = new Date(selectedDate);
      openingTime.setHours(18, 0, 0, 0);
      const closingTime = new Date(selectedDate);
      closingTime.setHours(23, 59, 0, 0);

      if (isBefore(selectedDate, openingTime) || isAfter(selectedDate, closingTime)) {
        throw new Error('Reservas permitidas apenas entre 18:00 e 23:59');
      }

      await axios.post('http://localhost:5000/api/reservas', { table, dateTime }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage({ text: 'Reserva feita com sucesso!', type: 'success' });
      setDateTime('');
      fetchUserReservations();
    } catch (err) {
      setMessage({
        text: err.response?.data?.error || err.message || 'Erro ao fazer reserva',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelReservation = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/reservas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage({ text: 'Reserva cancelada com sucesso', type: 'success' });
      fetchUserReservations();
    } catch {
      setMessage({ text: 'Erro ao cancelar reserva', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Sistema de Reservas</h1>
          <Button onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}>Sair</Button>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          <Card title="Nova Reserva">
            <form onSubmit={handleReserva}>
              <Input label="Número da Mesa (1-15)" type="number" min="1" max="15" value={table} onChange={(e) => setTable(parseInt(e.target.value))} required />
              <Input label="Data e Hora" type="datetime-local" value={dateTime} onChange={(e) => setDateTime(e.target.value)} required />
              {message.text && (
                <p className={`mb-4 ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                  {message.text}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Processando...' : 'Fazer Reserva'}
              </Button>
            </form>
          </Card>

          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Minhas Reservas</h2>
            {userReservations.length === 0 ? (
              <p className="text-gray-600">Você não tem reservas ainda.</p>
            ) : (
              <div className="space-y-4">
                {userReservations.map(reserva => (
                  <div key={reserva._id} className="bg-white p-4 rounded-lg shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Mesa {reserva.table}</p>
                        <p className="text-gray-600">
                          {format(parseISO(reserva.dateTime), "PPPPp", { locale: ptBR })}
                        </p>
                        <p className={`text-sm ${new Date(reserva.dateTime) < new Date() ? 'text-gray-500' : 'text-green-600'}`}>
                          {new Date(reserva.dateTime) < new Date() ? 'Reserva concluída' : 'Reserva ativa'}
                        </p>
                      </div>
                      {new Date(reserva.dateTime) > new Date() && (
                        <button onClick={() => handleCancelReservation(reserva.id)} className="text-red-500 hover:text-red-700 text-sm">
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservasPage;
