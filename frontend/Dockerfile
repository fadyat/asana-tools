FROM node:18-alpine AS build
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./

CMD ["npm", "start"]