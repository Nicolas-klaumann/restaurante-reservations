import express from 'express';
import {
  criarReserva,
  deletarReserva,
  listarTodasReservas,
  minhasReservas,
} from '../controllers/reserva.controller';
import { autenticarToken } from '../middlewares/auth.middleware';
import { adminMiddleware } from '../middlewares/admin.middleware';

const router = express.Router();

router.post('/reservas', autenticarToken, criarReserva);
router.get('/reservas/minhas-reservas', autenticarToken, minhasReservas);
router.get(
  '/reservas/admin/todas-reservas',
  autenticarToken,
  adminMiddleware,
  listarTodasReservas
);
router.delete('/reservas/:id', autenticarToken, deletarReserva);

export default router;
