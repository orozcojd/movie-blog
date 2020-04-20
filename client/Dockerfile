# build stage
FROM node:latest as build-stage

MAINTAINER Jonathan Orozco <jondorozco@gmail.com>

WORKDIR /app

COPY package*.json ./

RUN npm install

# Install dependecies

COPY . .

RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]