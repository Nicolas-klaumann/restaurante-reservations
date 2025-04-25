// src/pages/AdminPanel.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Button from '../components/Button.tsx';

const AdminPanel = ({ token }: { token: string }) => {
  const [reservas, setReservas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const fetchReservas = async () => {
    try {
      setLoading(true);
      
      const params = {
        ...filters
      };

      const res = await axios.get('http://localhost:5000/api/reservas/admin/todas-reservas', {
        params,
        headers: { Authorization: `Bearer ${token}` }
      });

      setReservas(res.data.data);
    } catch (err) {
      console.error('Erro ao buscar reservas:', err);
      if (err.response?.status === 403) {
        navigate('/');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, [filters]);

  const handleCancelReservation = async (id) => {
    try {
      console.log(id);
      
      await axios.delete(`http://localhost:5000/api/reservas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage({ text: 'Reserva cancelada com sucesso', type: 'success' });
      fetchReservas();
    } catch {
      setMessage({ text: 'Erro ao cancelar reserva', type: 'error' });
    } finally {
        setTimeout(() => {
            setMessage({ text: '', type: '' });
        }, 2000);
    }
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ status: e.target.value });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Painel Administrativo - Reservas</h1>
        <Button onClick={() => {
          localStorage.removeItem('token');
          navigate('/login');
        }}>Sair</Button>
      </header>

      <div className="mb-6 flex justify-between items-center">
        <div className="flex gap-4">
          <select
            value={filters.status}
            onChange={handleStatusChange}
            className="border p-2 rounded"
          >
            <option value="">Todas</option>
            <option value="AGENDADAS">Agendadas</option>
            <option value="CONCLUIDAS">Concluidas</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            {message.text && (
                <p className={`mb-4 ${message.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                  {message.text}
                </p>
            )}
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">ID</th>
                  <th className="py-3 px-4 text-left">Cliente</th>
                  <th className="py-3 px-4 text-left">Mesa</th>
                  <th className="py-3 px-4 text-left">Data/Hora</th>
                  <th className="py-3 px-4 text-left">Situação</th>
                  <th className="py-3 px-4 text-left">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reservas.map((reserva) => {                    
                    return (<tr key={reserva.id}>
                        <td className="py-3 px-4">{reserva.id}</td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{reserva.user.name}</p>
                            <p className="text-sm text-gray-600">{reserva.user.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">{reserva.table}</td>
                        <td className="py-3 px-4">
                          {format(parseISO(reserva.dateTime), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                        </td>
                        <td className="py-3 px-4">
                          {new Date() < new Date(reserva.dateTime)
                            ? 'Agendada'
                            : 'Concluída'}
                        </td>
                        <td className="py-3 px-4">
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => handleCancelReservation(reserva.id)}
                          >
                            Cancelar
                          </Button>
                        </td>
                      </tr>)
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminPanel;
