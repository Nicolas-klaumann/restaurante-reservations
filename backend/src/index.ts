import express from 'express';
import dotenv from 'dotenv';
import reservaRoutes from './routes/reservas.routes';
import authRoutes from './routes/auth.routes';

import cors from 'cors'; // Importando o cors

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api', reservaRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
