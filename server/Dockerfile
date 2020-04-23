FROM mhart/alpine-node

WORKDIR /app
COPY package*.json ./
RUN apk --no-cache add --virtual builds-deps build-base python

# Install nodemon for hot reload
RUN npm install -g nodemon

# Install project dependencies
RUN npm config set registry http://registry.npmjs.org/ && npm install

COPY src /app

EXPOSE 8081

CMD ["npm", "run", "dev"]