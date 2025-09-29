# Node.js base image
FROM node:18

# Working directory inside container
WORKDIR /app

# package.json copy aur install
COPY package*.json ./
RUN npm install

# Baaki code copy
COPY . .

# Port expose (jo backend use karta hai)
EXPOSE 5000

# Start command
CMD ["npm", "run", "start"]
