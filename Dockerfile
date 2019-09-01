FROM node:12.9.1-alpine

ENV NODE_ENV=production

ENTRYPOINT ["npm", "run", "start"]

WORKDIR /src
COPY . /src

RUN ./build
