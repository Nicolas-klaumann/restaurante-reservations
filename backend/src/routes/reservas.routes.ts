import express from 'express';
import { criarReserva } from '../controllers/reserva.controller';
import { autenticarToken } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/reservas', autenticarToken, criarReserva);

export default router;
