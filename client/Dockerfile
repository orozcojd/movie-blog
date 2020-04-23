FROM node:latest

WORKDIR /app
COPY package.json /app/package.json
RUN npm install
RUN npm install @vue/cli -g
# add this line in docker file.
EXPOSE 8080 
CMD ["npm", "run", "dev"]