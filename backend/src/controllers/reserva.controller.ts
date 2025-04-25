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
