FROM node:lts-alpine
WORKDIR /app
COPY package* ./
COPY src src

RUN npm install --ci
