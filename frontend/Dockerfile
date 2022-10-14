FROM node:18-alpine AS build
WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=build /app/build ./build
RUN npm install -g serve
CMD serve -s /app/build -l 3000