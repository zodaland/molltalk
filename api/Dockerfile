FROM node:14-alpine

ENV TZ Asia/Seoul

RUN apk add tzdata
RUN mkdir /home/http
WORKDIR /home/http
RUN npm i nodemon@latest -g
RUN npm install
CMD nodemon -L app.js
