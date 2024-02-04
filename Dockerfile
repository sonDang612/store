FROM node:18-alpine

WORKDIR /app

COPY package.json ./

COPY yarn.lock ./

RUN yarn install

COPY . ./

ENV MONGO_URI_DOCKER = mongodb://127.0.0.1:27018/electronics-store
RUN echo $MONGO_URI_DOCKER
RUN yarn build

EXPOSE 3000

CMD yarn start