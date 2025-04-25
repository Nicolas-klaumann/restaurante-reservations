import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Criar admin
  const adminPassword = await bcrypt.hash('123', 10);
  const admin = await prisma.user.create({
    data: {
      name: 'Administrador',
      email: 'admin@restaurante.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  console.log('Admin criado:', admin);

  // Criar usuários comuns
  const commonUsers = [];
  const commonPasswords = await Promise.all([
    bcrypt.hash('123', 10),
    bcrypt.hash('123', 10),
    bcrypt.hash('123', 10),
  ]);

  for (let i = 1; i <= 3; i++) {
    const user = await prisma.user.create({
      data: {
        name: `Usuário ${i}`,
        email: `user${i}@email.com`,
        password: commonPasswords[i - 1],
        role: 'USER',
      },
    });
    commonUsers.push(user);
    console.log(`Usuário ${i} criado:`, user);
  }

  // Criar reservas para cada usuário
  const now = new Date();

  for (const user of commonUsers) {
    for (let j = 1; j <= 5; j++) {
      // Data aleatória nos próximos 30 dias ou passados
      const daysOffset = Math.floor(Math.random() * 30) - 5;
      const hoursOffset = 18 + Math.floor(Math.random() * 6); // Entre 18h e 23h
      const dateTime = new Date(now);
      dateTime.setDate(now.getDate() + daysOffset);
      dateTime.setHours(hoursOffset, 0, 0, 0);

      const reservation = await prisma.reservation.create({
        data: {
          userId: user.id,
          table: Math.floor(Math.random() * 15) + 1, // Mesa entre 1 e 15
          dateTime: dateTime,
        },
      });
      console.log(`Reserva ${j} para usuário ${user.id} criada:`, reservation);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
