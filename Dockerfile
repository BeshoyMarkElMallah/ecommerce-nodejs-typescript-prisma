FROM node

WORKDIR /src

COPY package.json .
RUN yarn install
COPY . .
RUN yarn install && yarn start

# CMD [ "yarn","start"]
