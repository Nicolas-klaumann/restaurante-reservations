import express from 'express';
import {
  criarReserva,
  minhasReservas,
} from '../controllers/reserva.controller';
import { autenticarToken } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/reservas', autenticarToken, criarReserva);
router.get('/reservas/minhas-reservas', autenticarToken, minhasReservas);

export default router;
