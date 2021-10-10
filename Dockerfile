FROM keymetrics/pm2:14-alpine

EXPOSE 3000

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

RUN mkdir /app
WORKDIR /app
ADD package.json yarn.lock /app/
RUN yarn --pure-lockfile
ADD . /app

EXPOSE 80
EXPOSE 8085

CMD ["yarn", "docker:start"]
