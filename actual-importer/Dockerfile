FROM node:lts-alpine
WORKDIR /app
COPY package* ./
COPY src src
RUN mkdir data

RUN npm install --ci
