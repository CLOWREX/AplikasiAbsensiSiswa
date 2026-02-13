# frontend/Dockerfile
FROM node:20 AS build
WORKDIR /app

# Copy package.json & package-lock.json
COPY package*.json ./

# Install dependencies di container
RUN npm install

# Copy semua kode frontend
COPY . .

# Build React/Vite app
RUN npm run build

# Serve dengan nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
