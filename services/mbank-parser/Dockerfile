FROM node:20-alpine
WORKDIR /app
COPY package* ./
COPY src src

RUN npm install --ci
