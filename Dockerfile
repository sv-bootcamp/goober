FROM node:6.4.0

MAINTAINER Goober <dev.goober@gmail.com>

RUN mkdir -p /app
WORKDIR /app

ADD . /app

RUN npm install
RUN npm build

ENV NODE_ENV development

EXPOSE 5000

CMD ["npm", "server"]
