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

    const reservas = await prisma.reservation.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        dateTime: 'desc',
      },
      select: {
        id: true,
        table: true,
        dateTime: true,
      },
    });

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

export const deletarReserva = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.userId;

    const reserva = await prisma.reservation.findUnique({
      where: { id },
    });

    if (!reserva) {
      return res.status(404).json({ error: 'Reserva não encontrada' });
    }

    if (reserva.userId !== userId) {
      return res
        .status(403)
        .json({ error: 'Você não tem permissão para cancelar esta reserva' });
    }

    const agora = new Date();
    if (new Date(reserva.dateTime) < agora) {
      return res
        .status(400)
        .json({ error: 'Não é possível cancelar reservas já realizadas' });
    }

    await prisma.reservation.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Reserva cancelada com sucesso' });
  } catch (error) {
    console.error('Erro ao cancelar reserva:', error);
    res.status(500).json({ error: 'Erro interno ao cancelar reserva' });
  }
};
