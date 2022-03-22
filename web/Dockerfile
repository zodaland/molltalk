FROM node:14-alpine

ENV TZ Asia/Seoul

RUN apk add tzdata
RUN mkdir /home/http
WORKDIR /home/http
CMD yarn && yarn start
