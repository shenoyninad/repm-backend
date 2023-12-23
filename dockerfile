# Base
FROM node as base
# RUN mkdir -p /usr/src/app
RUN apt-get install -y libtool

WORKDIR /app
EXPOSE 3000

FROM base as development
ENV NODE_ENV development
COPY package*.json ./
RUN npm install
COPY tsconfig*.json ./
COPY nest-cli.json ./
COPY .eslintrc.js ./
COPY config ./config
COPY src ./src
RUN ["npm", "run", "build"]
# RUN ["npm", "run", "start"]