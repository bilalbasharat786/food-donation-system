# Step 1: Build React app
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve app with nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx exposes port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
