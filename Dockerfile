FROM node:18-slim

WORKDIR /app

# Instalar OpenSSL y otras dependencias necesarias
RUN apt-get update && apt-get install -y \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# Copiar archivos de configuración primero
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm ci --omit=dev
RUN npm cache clean --force

# Generar Prisma Client
RUN npx prisma generate

# Copiar el resto de archivos
COPY . .

# Construir la aplicación
RUN npm run build

EXPOSE 8081
CMD ["npm", "run", "docker-start"]
