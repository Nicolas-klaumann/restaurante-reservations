## APLICATIVOS DE RESERVAS PARA UM RESTAURANTE
### Nicolas Eduardo Klaumann <nicolasklaumann2003@gmail.com>

Para iniciar a aplicação, basta executar o comando `./start.sh`.

Para popular o bando de dados, basta executar os comandos:

```bash
docker-compose exec backend npx prisma migrate dev --name init
docker-compose exec backend npm run seed
