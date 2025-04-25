echo 'Iniciando backend...'
cd backend/ && npm install && docker-compose up --build -d

echo 'Iniciando frontend...'
cd ../frontend/ && docker-compose up --build -d
