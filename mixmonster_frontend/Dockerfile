# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app/frontend
COPY package.json ./
RUN npm install
COPY . .
ARG frontend_host
ARG frontend_port
ENV VUE_APP_FRONTEND_HOST=$frontend_host
ENV VUE_APP_FRONTEND_PORT=$frontend_port
RUN echo "Oh dang look at that $VUE_APP_FRONTEND_HOST"
RUN echo "Oh dang look at that $VUE_APP_FRONTEND_PORT"
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/frontend/dist /usr/share/nginx/html