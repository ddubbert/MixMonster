FROM node:14.17.6-alpine 

WORKDIR /app/backend

COPY package.json ./

RUN npm install

COPY . . 

CMD [ "npm", "start" ]