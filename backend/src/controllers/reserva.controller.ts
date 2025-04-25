import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const criarReserva = async (req: any, res: any) => {
  const { table, dateTime } = req.body;
  const userId = (req as any).user.userId;
  const date = new Date(dateTime);

  if (date.getDay() === 0) {
    return res
      .status(400)
      .json({ error: 'Reservas não são permitidas aos domingos.' });
  }

  const hour = date.getHours();
  if (hour < 18 || hour > 23) {
    return res
      .status(400)
      .json({ error: 'Horário de reserva deve ser entre 18h00 e 23h59.' });
  }

  const conflito = await prisma.reservation.findFirst({
    where: {
      table,
      dateTime: date,
    },
  });

  if (conflito) {
    return res
      .status(409)
      .json({ error: 'Já existe uma reserva para essa mesa neste horário.' });
  }

  const reserva = await prisma.reservation.create({
    data: { userId, table, dateTime: date },
  });

  res.json(reserva);
};

export const minhasReservas = async (req: any, res: any) => {
  try {
    const userId = (req as any).user.userId;
    console.log(userId);

    // Busca todas as reservas do usuário, ordenadas pelas mais recentes
    const reservas = await prisma.reservation.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        dateTime: 'desc', // Ordena da reserva mais recente para a mais antiga
      },
      select: {
        id: true,
        table: true,
        dateTime: true,
        // Você pode incluir outros campos se necessário
      },
    });

    // Formata as datas para o frontend (opcional)
    const reservasFormatadas = reservas.map((reserva) => ({
      ...reserva,
      dateTime: reserva.dateTime.toISOString(), // Ou outro formato desejado
    }));

    res.json(reservasFormatadas);
  } catch (error) {
    console.error('Erro ao buscar reservas:', error);
    res.status(500).json({ error: 'Erro interno ao buscar reservas' });
  }
};
