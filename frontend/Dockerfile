# Etapa de build
FROM node:18 AS builder

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Etapa de produção
FROM nginx:alpine

# Copia os arquivos da build
COPY --from=builder /app/build /usr/share/nginx/html

# NGINX para suportar rotas do React
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
