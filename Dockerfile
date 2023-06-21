FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .


CMD ["/bin/bash", "-c", " npm run migration; fi"]