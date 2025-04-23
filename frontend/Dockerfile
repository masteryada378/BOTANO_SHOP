# frontend/Dockerfile
FROM node:22-slim

WORKDIR /app

COPY package*.json ./
RUN npm install @tailwindcss/postcss && npm install
# RUN npm install

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev"]