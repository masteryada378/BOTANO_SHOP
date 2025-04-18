# Use official Node.js image
FROM node:22-slim

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 5005

# Start the server
CMD ["npx", "ts-node", "src/server.ts"]