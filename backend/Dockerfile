# Usa imagem oficial do Node.js
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependência
COPY package*.json tsconfig.json ./

# Instala as dependências
RUN npm install

# Copia o restante do código-fonte
COPY . .

# Compila o código TypeScript
RUN npm run build

# Expõe a porta usada pela aplicação
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "start"]
