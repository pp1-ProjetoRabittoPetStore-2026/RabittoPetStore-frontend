# Estágio de desenvolvimento
FROM node:22-slim

WORKDIR /app

# Copia arquivos de dependência
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos
COPY . .

# Expõe a porta padrão do Vite
EXPOSE 5173

# Comando para rodar o dev server com host exposto
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]